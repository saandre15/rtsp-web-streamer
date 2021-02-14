const cron = require('node-cron');
const child = require('child_process');

module.exports = cron.schedule('0 0 1 * * * ', () => {
  console.log('System is now rebooting');
  child.exec('sudo shutdown -r now', (err) => {
    if(err) {
      console.log('Error! Unable to shutdown.');
    }
  })

}, {
  timezone: process.env.TIMEZONE
});