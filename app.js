const cluster = require('cluster');
const os = require('os');
const Streams = require('./stream');
const watchdog = require('./watchdog');
const reboot = require('./reboot');

const slave_cores = os.cpus().length - 1;

if(os.cpus().length < 2) {
  console.log('This application requires at least 2 cores to function properly.');
  process.exit(0);
};

// WatchDog
if(cluster.isMaster) {
  reboot.start();
  for(let i = 0 ; i < (slave_cores < Streams.getLength() ? slave_cores : Streams.getLength()) ; i++) {
    const worker = cluster.fork();
    worker.send(i);
  }
  watchdog();
} else {
  // Stream
  console.log('Stream Process/es has started on pid: ' + process.pid);
  process.on('message', (core_num) => {
    const stream = new Streams(core_num);
    const channels = stream.createStream();
    const msg = 'Hey Watchdog I have just created a new stream for channel number ' + channels;
    process.send(msg);
  });
  
}


