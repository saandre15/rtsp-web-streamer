const Stream = require('node-rtsp-stream');
const os = require('os');
const EventEmitter = require('events');
const cpu_cores = os.cpus().length;

module.exports = class Streams extends EventEmitter {
  constructor(core_num) {
    super();
    this.aval_streams = [2,3,4,5,6,7,8,9,10];
    this.length = this.aval_streams.length;
    this.core_num = core_num;
    this.createStream = this.createStream.bind(this);
    this.once('restart', () => {
      process.disconnect();
    });
  }

  static getLength() {
    return 9;
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
    console.log(arr);
    let value = 0;
    let newArr = [];
    arr.forEach((cur, index) => {
      if(index < this.core_num) {
        value = value + cur;
      } else if (index === this.core_num) {
        for(let i = 0 ; i < cur ; i++) {
          let total = value + i;
          total = this.aval_streams[total];
          console.log(total);
          newArr.push(total);
          const channel = new Stream({
            name: `channel_${total}`,
            //streamUrl: 'rtsp://184.72.239.149/vod/mp4:BigBuckBunny_115k.mov',
            streamUrl: `rtsp://admin:Admin123@192.168.0.25:554/Streaming/Channels/${total}01`,
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
    return newArr;
  }
}
