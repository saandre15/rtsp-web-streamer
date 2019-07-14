const forever = require('forever-monitor');

const app = new forever.Monitor('./app.js');

app.start();