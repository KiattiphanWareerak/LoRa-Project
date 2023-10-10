const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const host = 'localhost';
const port = 8080;

const server = http.createServer((req, res) => {
  const url = req.url;

  const indexPath = path.join(__dirname, 'index.html');

  if (url === '/') {
    fs.readFile(indexPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        const stylePath = path.join(__dirname, 'styles', 'style.css');
        const scriptPath = path.join(__dirname, 'scripts', 'script.js');

        fs.readFile(stylePath, 'utf8', (styleErr, styleData) => {
          fs.readFile(scriptPath, 'utf8', (scriptErr, scriptData) => {
            if (styleErr || scriptErr) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
            } else {
              const modifiedData = data
                .replace('<link rel="stylesheet" href="styles/style.css">', `<style>${styleData}</style>`)
                .replace('<script src="scripts/script.js"></script>', `<script>${scriptData}</script>`);

              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(modifiedData);
            }
          });
        });
      }
    });
  } else if (url === '/add_device.html') {
    const addDeivcePath = path.join(__dirname, 'add_device.html');

    fs.readFile(addDeivcePath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        const stylePath = path.join(__dirname, 'styles', 'style.css');
        const scriptPath = path.join(__dirname, 'scripts', 'add_device.js');

        fs.readFile(stylePath, 'utf8', (styleErr, styleData) => {
          fs.readFile(scriptPath, 'utf8', (scriptErr, scriptData) => {
            if (styleErr || scriptErr) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
            } else {
              const modifiedData = data
                .replace('<link rel="stylesheet" href="styles/style.css">', `<style>${styleData}</style>`)
                .replace('<script src="scripts/add_device.js"></script>', `<script>${scriptData}</script>`);

              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(modifiedData);
            }
          });
        });
      }
    });
  } else if (url === '/add_appKey.html') {
    const appKeyPath = path.join(__dirname, 'add_appKey.html');

    fs.readFile(appKeyPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        const stylePath = path.join(__dirname, 'styles', 'style.css');
        const scriptPath = path.join(__dirname, 'scripts', 'add_appKey.js');

        fs.readFile(stylePath, 'utf8', (styleErr, styleData) => {
          fs.readFile(scriptPath, 'utf8', (scriptErr, scriptData) => {
            if (styleErr || scriptErr) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
            } else {
              const modifiedData = data
                .replace('<link rel="stylesheet" href="styles/style.css">', `<style>${styleData}</style>`)
                .replace('<script src="scripts/add_appKey.js"></script>', `<script>${scriptData}</script>`);

              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(modifiedData);
            }
          });
        });
      }
    });
  } else if (url === '/devices.html') {
    const appKeyPath = path.join(__dirname, 'devices.html');

    fs.readFile(appKeyPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        const stylePath = path.join(__dirname, 'styles', 'style.css');
        const scriptPath = path.join(__dirname, 'scripts', 'script.js');

        fs.readFile(stylePath, 'utf8', (styleErr, styleData) => {
          fs.readFile(scriptPath, 'utf8', (scriptErr, scriptData) => {
            if (styleErr || scriptErr) {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
            } else {
              const modifiedData = data
                .replace('<link rel="stylesheet" href="styles/style.css">', `<style>${styleData}</style>`)
                .replace('<script src="scripts/script.js"></script>', `<script>${scriptData}</script>`);

              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(modifiedData);
            }
          });
        });
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

//---------------------------------------------------------------------// 
//------------------------------WEB SOCKET-----------------------------//
//---------------------------------------------------------------------//
const wss = new WebSocket.Server({ noServer: true });

let devEUI = '';

wss.on('connection', (ws, request, client) => {
    const url = new URL(request.url, 'http://' + host);
  
    if (url.pathname === '/addDevice') {
      console.log('WebSocket connection established for client');
  
      ws.on('message', (message) => {
        console.log(`Received message for client: ${message}`);

        devEUI = message.devEUI;
        addDevice(message.deviceName, message.devEUI);

        ws.send(JSON.stringify({ status: 'success', message: 'Device added successfully' }));
      });
  
      ws.on('close', () => {
        console.log('WebSocket connection closed for client');
      });
    } else if (url.pathname === '/addAppKey') {
      console.log('WebSocket connection established for client');
  
      ws.on('message', (message) => {
        console.log(`Received message for client: ${message}`);

        newAppKey(message.appKey);

        ws.send(JSON.stringify({ status: 'success', message: 'Update AppKey successfully' }));
      });
  
      ws.on('close', () => {
        console.log('WebSocket connection closed for client');
      });
    };
  });
  
  // เชื่อม WebSocket กับ HTTP Server
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, socket);
    });
});

//---------------------------------------------------------------------// 
//--------------------------------SERVER-------------------------------//
//---------------------------------------------------------------------//

server.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}/devices.html`);
});

//---------------------------------------------------------------------// 
//------------------------------FUNCTIONS------------------------------//
//---------------------------------------------------------------------//

//-ADD DEVICE-//
function addDevice(deviceName, devEUI) {
    const grpc = require("@grpc/grpc-js");
    const device_grpc = require("@chirpstack/chirpstack-api/api/device_grpc_pb");
    const device_pb = require("@chirpstack/chirpstack-api/api/device_pb");

    // This must point to the ChirpStack API interface.
    const server = "192.168.50.54:8080";

    // The API token (can be obtained through the ChirpStack web-interface).
    const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjJmZjMzODRiLWZjYzgtNDE5OS1hNmY0LWVjYWEwNzUyMmE5NiIsInR5cCI6ImtleSJ9.HcJsMD_Vv-oPUFHqRIDo_xPlJOPPzNeNxSsixNXTRX0";

    // Create the client for the DeviceService.
    const deviceService = new device_grpc.DeviceServiceClient(
    server,
    grpc.credentials.createInsecure(),
    );

    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    // Create a new device.
    const newDevice = new device_pb.Device();
    newDevice.setDevEui(devEUI); //25c5d9e6325825c6
    newDevice.setName(deviceName);
    newDevice.setApplicationId("c735b5b4-8130-454b-abf5-26021f5327f0");
    newDevice.setDeviceProfileId("437b8519-76bc-4974-85bf-6e0645f800be");

    // Create a request to add the new device.
    const createReq = new device_pb.CreateDeviceRequest();
    createReq.setDevice(newDevice);

    deviceService.create(createReq, metadata, (err, resp) => {
    if (err !== null) {
        console.log(err);
        return;
    }
    console.log("New device has been created");
    });
}
//---------------------------------------------------------------------//

//-UPDATE APP KEY-//
function newAppKey(newAppKey) {
  const grpc = require("@grpc/grpc-js");
  const device_grpc = require("@chirpstack/chirpstack-api/api/device_grpc_pb");
  const device_pb = require("@chirpstack/chirpstack-api/api/device_pb");

  const server = "192.168.50.54:8080";

  const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjJmZjMzODRiLWZjYzgtNDE5OS1hNmY0LWVjYWEwNzUyMmE5NiIsInR5cCI6ImtleSJ9.HcJsMD_Vv-oPUFHqRIDo_xPlJOPPzNeNxSsixNXTRX0";

  const deviceService = new device_grpc.DeviceServiceClient(
  server,
  grpc.credentials.createInsecure(),
  );

  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Bearer " + apiToken);

  // Create a request to update the new app key (OTAA).
  const updateAppKeyRequest = new device_pb.UpdateDeviceKeysRequest();
  updateAppKeyRequest.setDevEui(devEUI);
  updateAppKeyRequest.setAppKey(newAppKey);

  deviceService.updateKeys(updateAppKeyRequest, metadata, (err, resp) => {
  if (err !== null) {
      console.log(err);
      return;
  }
  console.log("App Key has been updated");
  });
}
//---------------------------------------------------------------------//