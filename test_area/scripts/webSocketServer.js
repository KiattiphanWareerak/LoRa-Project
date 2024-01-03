const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const chirpStackApiModule = require('../api/chirpStackApiModule.js');
const databaseApiModule = require('../api/databaseApiModule.js');

const PORT = 3001;
const IP_ADDRESS = 'localhost';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, request) => {
  ws.on('message', (message) => {
    handleMessage(ws, message);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed.');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

function handleMessage(ws, message) {
  const data = JSON.parse(message);
  const path = ws.upgradeReq.url.replace('/', ''); // Extract path from WebSocket URL

  if (path === 'logReq') {
    let resp_lg = databaseApiModule.login(data);

    if (resp.status == 'success') {
      let resp_cs = chirpStackApiModule.applicationsList(resp_lg.messsage);

      ws.send(JSON.stringify(resp_cs));
    } else {
      let resp_cs = [{ status: 'Failed' }]

      ws.send(JSON.stringify(resp_cs));
    }
  } else if (path === 'AppsListReq') {
    let resp_cs = chirpStackApiModule.applicationsList(resp_lg.messsage);

    ws.send(JSON.stringify(resp_cs));
  } else {
    console.warn('Unknown WebSocket path:', path);
  }
}

// server.on('upgrade', (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, (ws) => {
//     wss.emit('connection', ws, request);
//   });
// });

server.listen(PORT, () => {
    console.log(`WebSocket server is running on http://${IP_ADDRESS}:${PORT}`);
});
