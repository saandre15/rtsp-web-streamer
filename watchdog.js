const os = require('os');
const cluster = require('cluster');
const fs = require('fs');
const child = require('child_process');

const slave_cores = os.cpus().length;

module.exports = () => {
  console.log('Watchdog process has started on pid:' + process.pid);
  console.log('Currently Watching ' + slave_cores + ' cores');
  cluster.on('disconnect', (worker) => {
    cluster.fork().send(worker.id);
  })
  cluster.on('message', (worker, msg) => {
    console.log(msg);
    if(msg === 'exit') {
      cluster.removeAllListeners('disconnect');
      for(let id in cluster.workers) {
        console.log('Worker ' + cluster.workers[id].id + ' is currently being killed');
        cluster.workers[id].kill();
      }
      process.exit(0);
      return;
    }
  });
}