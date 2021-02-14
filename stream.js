const Stream = require('node-rtsp-stream');
const os = require('os');
const EventEmitter = require('events');
const cpu_cores = os.cpus().length;

module.exports = class Streams extends EventEmitter {
  constructor(core_num) {
    super();
    this.aval_streams = [...process.env.RTSP_STREAM_IDS.split(", ")];
    this.length = this.aval_streams.length;
    this.core_num = core_num;
    this.createStream = this.createStream.bind(this);
    this.once('restart', () => {
      process.disconnect();
    });
  }



  createStream () {
    let arr = [];
    const remainder = this.length % cpu_cores;
    const fixed = parseFloat((this.length / cpu_cores).toFixed(0))
    for(let i = 0 ; i < cpu_cores ; i++) {
      if(remainder && i === 0) {
        arr.push(fixed + remainder);
      } else {
        arr.push(fixed);
      }
    }
    let value = 0;
    let newArr = [];
    arr.forEach((cur, index) => {
      if(index < this.core_num) {
        value = value + cur;
      } else if (index === this.core_num) {
        for(let i = 0 ; i < cur ; i++) {
          let total = value + i;
          total = this.aval_streams[total];
          newArr.push(total);
          console.log(9000 + total);
          const streamURL = "rtsp://" + process.env.RTSP_ADMIN_USERNAME + 
            ":" + process.env.RTSP_ADMIN_PASSWORD + "@" + process.env.RTSP_URL
          streamURL.replace(process.env.REGEX_REPLACE_ID, total);
          const channel = new Stream({
            name: `channel_${total}`,
            streamUrl: streamURL,
            wsPort: 9000 + total,
            ffmpegOptions: { // options ffmpeg flags
              '-stats': '', 
              '-r': 30,
              '-hide_banner' : '',
              '-loglevel' : '',
              'panic' : ''
            }
          });
          channel.once('timeout', () => {
            this.emit('restart');
          });
        }
      }
    });
    console.log('Channel ' + newArr + ' is now streaming');
    return newArr;
  }
}
