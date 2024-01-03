const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

// const WebSocket = require('ws');

//---------------------------------------------------------------------// 
//--------------------------------SERVER-------------------------------//
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  let filePath = '.' + parsedUrl.pathname;

  if (filePath === '../' || filePath === '../index.html') {
    filePath = '../index.html';
  }

  const extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('404 Not Found');
      } else {
        res.writeHead(500, {'Content-Type': 'text/html'});
        res.end('500 Internal Server Error');
      }
    } else {
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    }
  });
});

const host = 'localhost';
const port = 8080;

server.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}/`);
});
//---------------------------------------------------------------------// 

// let dev_EUI = '';

//---------------------------------------------------------------------// 
//------------------------------WEB SOCKET-----------------------------//

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws, request, client) => {
  const url = new URL(request.url, 'http://' + host);
  if (url.pathname === '/createDeviceRequest') {
    console.log('WebSocket connection established for client');

    ws.on('message', (message) => {
      console.log(`Received message for client: ${message}`);
      
      data = JSON.parse(message);
      dev_EUI = data.devEUI;
      createDeviceRequest_to_chirpstack(data.devName, data.devEUI);

      ws.send(JSON.stringify({ status: 'success', message: 'Device added successfully' }));
    });
  
    ws.on('close', () => {
      console.log('WebSocket connection closed for client');
    });
  } 
  else if (url.pathname === '/createDeviceKeyRequest') {
    console.log('WebSocket connection established for client');
  
    ws.on('message', (message) => {
      console.log(`Received message for client: ${message}`);

      data = JSON.parse(message);
      createDeviceKeysRequest_to_chirpstack(data.devKey);
      dev_EUI = "";

      ws.send(JSON.stringify({ status: 'success', message: 'Created AppKey successfully' }));
    });
  
    ws.on('close', () => {
      console.log('WebSocket connection closed for client');
    });
  }
  else if (url.pathname === '/listApplicationsRequest') {
    console.log('WebSocket connection established for client');
  
    ws.on('message', (message) => {
      console.log(`Received message for client: ${message}`);

      data = JSON.parse(message);

      myApiService.listApplicationsRequest_to_chirpstack(data.user_tenantID, (err, resp_listApplicationsReq) => {
        if (err) {
            ws.send(JSON.stringify({ status: 'error', message: 'Failed' }));
        } else {
            ws.send(JSON.stringify({ status: 'success', resp_listApplicationsReq }));
        }
      });
    });
  
    ws.on('close', () => {
      console.log('WebSocket connection closed for client');
    });
  }
  else if (url.pathname === '/listDevicesRequest') {
    console.log('WebSocket connection established for client');
  
    ws.on('message', (message) => {
      console.log(`Received message for client: ${message}`);

      data = JSON.parse(message);
      console.log("4");
      myApiService.listDevicesRequest_to_chirpstack(data.app_id, (err, resp_listDevicesReq) => {
        if (err) {
          console.log("5");
            ws.send(JSON.stringify({ status: 'error', message: 'Failed to retrieve device list' }));
        } else {
          console.log("6");
            ws.send(JSON.stringify({ status: 'success', resp_listDevicesReq }));
        }
      });
    });
  
    ws.on('close', () => {
      console.log('WebSocket connection closed for client');
    });
  } 
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request, socket);
  });
});
//---------------------------------------------------------------------//