const os = require('os');
const fs = require('fs');
const { exec } = require('child_process');

const Streams = require('./stream');
const reboot = require('./reboot');

if(os.cpus().length < 2) {
  console.log('This application requires at least 2 cores to function properly.');
  process.exit(0);
};

// Stream
console.log('Stream Process/es has started on pid: ' + process.pid);
exec('pm2 prettylist', (err, stdout, stderr) => {
  if(err) {
    process.exit(0);
  } else if (stdout) {
    const list = eval(stdout);
    let proc = list.filter((cur) => {
      if(cur.pid === process.pid) {
        return cur;
      }
    });
    const id = proc[0].pm_id;
    console.log(id)
    const streams = new Streams(id);
    streams.createStream();
  }
});
return;


  



