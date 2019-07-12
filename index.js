const http = require('http');
const streams = require('./stream');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const message = new Date() + ': A new request has been made';
  console.log(message);
  res.writeHead(404);
  res.end('Unauthorized Access! Please visit https://petzmania.net if you are looking for our website.');
});

server.listen('9000', '127.0.0.1', () => {
  const message = new Date() + ': Listening on ' + server.address().port;
  console.log(message);
});









