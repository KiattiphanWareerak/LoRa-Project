const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const WebSocket = require('ws');

const server = http.createServer((req, res) => {
  let q = url.parse(req.url, true);
  let fileName = '.' + q.pathname;

  if (fileName === './' || fileName === './login.html') {
      fileName = './login.html';
  } else if (!path.extname(fileName)) {
      fileName += '.html';
  }

  fs.readFile(fileName, function (err, data) {
      if (err) {
          res.writeHead(404, {'Content-Type': 'text/html'});
          return res.end('404 Page not Found');
      }

      const extname = path.extname(fileName);
      let contentType = 'text/html';

      switch (extname) {
          case '.css':
              contentType = 'text/css';
              break;
          case '.js':
              contentType = 'text/javascript';
              break;
      }

      res.writeHead(200, {'Content-Type': contentType});
      res.write(data);
      return res.end();
  })
})

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

        data = JSON.parse(message);
        devEUI = data.devEUI;
        addDevice(data.deviceName, data.devEUI);

        ws.send(JSON.stringify({ status: 'success', message: 'Device added successfully' }));
      });
  
      ws.on('close', () => {
        console.log('WebSocket connection closed for client');
      });
    } else if (url.pathname === '/addAppKey') {
      console.log('WebSocket connection established for client');
  
      ws.on('message', (message) => {
        console.log(`Received message for client: ${message}`);

        data = JSON.parse(message);
        createAppKey(data.appKey);

        ws.send(JSON.stringify({ status: 'success', message: 'Update AppKey successfully' }));
      });
  
      ws.on('close', () => {
        console.log('WebSocket connection closed for client');
      });
    };
  });
  
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, socket);
    });
});

//---------------------------------------------------------------------// 
//--------------------------------SERVER-------------------------------//
//---------------------------------------------------------------------//

const host = 'localhost';
const port = 8080;

server.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}/`);
});

//---------------------------------------------------------------------// 
//------------------------------FUNCTIONS------------------------------//
//---------------------------------------------------------------------//
// setting ChirpStack API
const grpc = require("@grpc/grpc-js");
const device_grpc = require("@chirpstack/chirpstack-api/api/device_grpc_pb");
const device_pb = require("@chirpstack/chirpstack-api/api/device_pb");
// This must point to the ChirpStack API interface.
const serverChirpStack = "192.168.50.54:8080";
// The API token (can be obtained through the ChirpStack web-interface).
const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjJmZjMzODRiLWZjYzgtNDE5OS1hNmY0LWVjYWEwNzUyMmE5NiIsInR5cCI6ImtleSJ9.HcJsMD_Vv-oPUFHqRIDo_xPlJOPPzNeNxSsixNXTRX0";
//---------------------------------------------------------------------//
//---------------------------------------------------------------------//
//---ADD DEVICE---//
function addDevice(deviceName, devEUI) {
    // Create the client for the DeviceService.
    const deviceService = new device_grpc.DeviceServiceClient(
    serverChirpStack,
    grpc.credentials.createInsecure(),
    );

    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    // Create a new device.
    const newDevice = new device_pb.Device();
    newDevice.setDevEui(devEUI);
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
    console.log('New device has been created [device: ' + devEUI + ']');
    });
}
//---------------------------------------------------------------------//
//---------------------------------------------------------------------//
//---CREATE OTAA KEY---//
function createAppKey(appKey) {
  const deviceService = new device_grpc.DeviceServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
  );
    
  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Bearer " + apiToken);

  // Create a device key (OTAA).
  const deviceKey = new device_pb.DeviceKeys();
  deviceKey.setDevEui(devEUI);
  deviceKey.setNwkKey(appKey); // LoRaWAN 1.0.x

  // Create a request to add a device key.
  const createReq = new device_pb.CreateDeviceKeysRequest();
  createReq.setDeviceKeys(deviceKey);

  deviceService.createKeys(createReq, metadata, (err, resp) => {
  if (err !== null) {
      console.log(err);
      return;
  }
  console.log('App Key (OTAA) has been created [device: ' + devEUI + ']');
  });
}
//---------------------------------------------------------------------//
//---------------------------------------------------------------------//
// devEUI = '25c5d9e6325825c6';
// appKey = '3e0c82264e71fe57d4087e0a3acf24cd';