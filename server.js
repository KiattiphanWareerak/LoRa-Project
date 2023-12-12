const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const WebSocket = require('ws');

//---------------------------------------------------------------------// 
//--------------------------------SERVER-------------------------------//

const server = http.createServer((req, res) => {
  let q = url.parse(req.url, true);
  let fileName = '.' + q.pathname;

  if (fileName === './' || fileName === './applicatonsPage.html') {
      fileName = './applicationsPage.html';
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

const host = 'localhost';
const port = 8080;

server.listen(port, () => {
  console.log(`Server is running on http://${host}:${port}/`);
});
//---------------------------------------------------------------------// 

let dev_EUI = '';

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
  else if (url.pathname === '/listDeviceRequest') {
    console.log('WebSocket connection established for client');
  
    ws.on('message', (message) => {
      console.log(`Received message for client: ${message}`);

      data = JSON.parse(message);

      let resp_listDevicesReq = [
        { dev_name: "MAX-01", dev_id: "c735b5b4-8130-454b-abf5-26021f5327f0", last_seen: "2023-10-30T12:00:53.000Z" },
        { dev_name: "MAX-02", dev_id: "c735b5b4-8130-454b-abf5-26021f535555", last_seen: "2023-10-30T12:00:53.000Z" }
      ];
      ws.send(JSON.stringify({ status: 'success', resp_listDevicesReq }));

      // listDevicesRequest_to_chirpstack(data.appID, (err, devices) => {
      //   if (err) {
      //       ws.send(JSON.stringify({ status: 'error', message: 'Failed to retrieve device list' }));
      //   } else {
      //       ws.send(JSON.stringify({ status: 'success', devices }));
      //   }
      // });
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

      let resp_listApplicationsReq = [
        { app_name: "my-app-1", app_id: "c735b5b4-8130-454b-abf5-26021f5327f0", app_num: 1 },
        { app_name: "my-app-2", app_id: "c735b5b4-8130-454b-abf5-26021f535555", app_num: 2 }
      ];
      ws.send(JSON.stringify({ status: 'success', resp_listApplicationsReq }));
      // listApplicationsRequest_to_chirpstack(data.user_tenantID, (err, resp_listApplicationsReq) => {
      //   if (err) {
      //       ws.send(JSON.stringify({ status: 'error', message: 'Failed' }));
      //   } else {
      //       ws.send(JSON.stringify({ status: 'success', resp_listApplicationsReq }));
      //   }
      // });
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

//---------------------------------------------------------------------// 
//----------------------------FUNCTIONS--------------------------------//

//--------------------------ChirpStack API-----------------------------//

const grpc = require("@grpc/grpc-js");
const application_grpc = require("@chirpstack/chirpstack-api/api/application_grpc_pb");
const application_pb = require("@chirpstack/chirpstack-api/api/application_pb");
const device_grpc = require("@chirpstack/chirpstack-api/api/device_grpc_pb");
const device_pb = require("@chirpstack/chirpstack-api/api/device_pb");
// This must point to the ChirpStack API interface.
const serverChirpStack = "192.168.50.54:8080";
// The API token (can be obtained through the ChirpStack web-interface).
const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjJmZjMzODRiLWZjYzgtNDE5OS1hNmY0LWVjYWEwNzUyMmE5NiIsInR5cCI6ImtleSJ9.HcJsMD_Vv-oPUFHqRIDo_xPlJOPPzNeNxSsixNXTRX0";
// Create the client for the Service.
const applicationService = new application_grpc.ApplicationServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
);
const deviceService = new device_grpc.DeviceServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
);
// Create the Metadata object.
const metadata = new grpc.Metadata();
metadata.set("authorization", "Bearer " + apiToken);

//---------------------------------------------------------------------//
//---CREATE DEVICE REQUEST---//
function createDeviceRequest_to_chirpstack(deviceName, devEUI) {
  // Create a new device.
  const newDevice = new device_pb.Device();
  newDevice.setApplicationId("c735b5b4-8130-454b-abf5-26021f5327f0");
  newDevice.setName(deviceName);
  newDevice.setDevEui(devEUI);
  newDevice.setDeviceProfileId("437b8519-76bc-4974-85bf-6e0645f800be");
  newDevice.setDescription("");
  newDevice.setIsDisabled(true);
  newDevice.setSkipFcntCheck(true);

  // Create a request to add a new device.
  const createReq = new device_pb.CreateDeviceRequest();
  createReq.setDevice(newDevice);

  deviceService.create(createReq, metadata, (err, resp) => {
  if (err !== null) {
      console.log(err);
      return;
  }
  console.log('New device has been created.');
  });
}
//---------------------------------------------------------------------//
//---DELETE DEVICE REQUEST---//
function deleteDeviceRequest_to_chripstack(devEUI) {
  // Create a request to delete a device.
  const createReq = new device_pb.DeleteDeviceRequest();
  createReq.setDevEui(devEUI);

  deviceService.delete(createReq, metadata, (err, resp) => {
  if (err !== null) {
      console.log(err);
      return;
  }
  console.log('Device has been deleted.');
  });
}
//---------------------------------------------------------------------//
//---CREATE DEVICE KEY REQUEST (OTAA KEY)---//
function createDeviceKeysRequest_to_chirpstack(devKey) {
  // Create a device key (OTAA Key).
  const deviceKey = new device_pb.DeviceKeys();
  deviceKey.setDevEui(dev_EUI);
  deviceKey.setNwkKey(appKey); // LoRaWAN 1.0.x
  // deviceKey.setAppKey(appKey); // LoRaWAN 1.1.x

  // Create a request to add a device key.
  const createReq = new device_pb.CreateDeviceKeysRequest();
  createReq.setDeviceKeys(deviceKey);

  deviceService.createKeys(createReq, metadata, (err, resp) => {
  if (err !== null) {
      console.log(err);
      return;
  }
  console.log('App Key (OTAA) has been created.');
  });
}
//---------------------------------------------------------------------//
//---UPDATE DEVICE KEY REQUEST (OTAA KEY)---//
function updateDeviceKeyRequest_to_chirpstack(devKey) {
  // Update a device key (OTAA).
  const deviceKey = new device_pb.DeviceKeys();
  deviceKey.setDevEui(dev_EUI);
  deviceKey.setNwkKey(devKey); // LoRaWAN 1.0.x
  // deviceKey.setAppKey(devKey); // LoRaWAN 1.1.x
    
  // Create a request to update a device key.
  const createReq = new device_pb.UpdateDeviceKeysRequest();
  createReq.setDeviceKeys(deviceKey);
    
  deviceService.updateKeys(createReq, metadata, (err, resp) => {
  if (err !== null) {
      console.log(err);
      return;
  }
  console.log('App Key (OTAA) has been updated.');
  });
}
//---------------------------------------------------------------------//
//---LIST DEVICES REQUEST---//
function listDevicesRequest_to_chirpstack(appID, callback) {
  // Create a request to list devices
  const createReq = new device_pb.ListDevicesRequest();
  createReq.setLimit(99);
  createReq.setApplicationId(appID); //Application ID

  deviceService.list(createReq, metadata, (err, resp) => {
      if (err !== null) {
          console.log(err);
          callback(err, null);
          return;
      }
      console.log(resp);

      let devices = resp.array[1]; //list devices at index 1
      console.log(devices);

      for (const device of devices) {
          let devEUI = device[0]; // DevEUI at index 0
          let devName = device[4]; // Device name at index 4

          console.log("DevEUI:", devEUI);
          console.log("Device Name:", devName);
      }

      callback(null, devices);
  });
}
//---------------------------------------------------------------------//
//---LIST APPLICATIONS REQUEST---//
function listApplicationsRequest_to_chirpstack(tenantID, callback) {
  // Create a request to list applications.
  const createReq = new application_pb.ListApplicationsRequest();
  createReq.setLimit(99);
  // createReq.setOffset();
  createReq.setTenantId(tenantID);
  
  applicationService.list(createReq, metadata, (err, resp) => {
  if (err !== null) {
      console.log(err);
      callback(err, null);
      return;
  }
  console.log('list applications has been completed.');

  console.log(resp.toObject());
  let resp_listApplicationsReq = resp.array[1];
  console.log(resp_listApplicationsReq);
  callback(null, resp_listApplicationsReq)
  });
}
//---------------------------------------------------------------------//