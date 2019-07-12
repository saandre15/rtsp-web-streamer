const Stream = require('node-rtsp-stream');

const channels = [];

for(let i = 0 ; i < 14; i++) {
  i = i + 1;
  const channel = new Stream({
    name: `channel_${i}`,
    streamUrl: `rtsp://admin:Admin123@192.168.0.25:554/Streaming/Channels/${i}01`,
    wsPort: 9000 + i,
    ffmpegOptions: { // options ffmpeg flags
      '-stats': '', // an option with no neccessary value uses a blank string
      '-r': 30 // options with required values specify the value after the key
    }
  });
  channels.push(channel);
}

module.exports = channels;