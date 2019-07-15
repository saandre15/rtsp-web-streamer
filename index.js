const forever = require('forever-monitor');

const app = new forever.Monitor('./app.js');

process.env.NODE_ENV = 'production';

app.start();
