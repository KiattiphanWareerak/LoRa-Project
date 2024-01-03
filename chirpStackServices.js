//---------------------------------------------------------------------// 
//----------------------ChirpStack API Services------------------------//
//---------------------------------------------------------------------// 
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
//-------------------------------FUNCTIONS-----------------------------//
//---------------------------------------------------------------------//
function applicationsListRequest(values) {
  // Create a request to list applications.
  // const createReq = new application_pb.ListApplicationsRequest();
  // createReq.setLimit(99);
  // createReq.setOffset(0);
  // createReq.setTenantId(items);
  
  // applicationService.list(createReq, metadata, (err, resp) => {
  // if (err !== null) {
  //     console.log(err);
  // }

  // console.log('list applications has been completed.');
  // let resp_listApplicationsReq = resp.toObject().resultList.map(item => ({
  //   id: item.id,
  //   name: item.name,
  //   description: item.description,
  // }));
  // resp_listApplicationsReq.totalCount = resp.toObject().totalCount;
  
  // console.log(resp_listApplicationsReq);
  // });

  let data = values;
  console.log('test from apps api');
  console.log(data);

  let respAppsList = { status: 'appsListSuccess', tenant_id: '0000-0000-0000-0000', message: 
  [
    { app_name: "my-app-1", app_id: "c735b5b4-8130-454b-abf5-26021f5327f0", app_num: 1 },
    { app_name: "my-app-2", app_id: "c735b5b4-8130-454b-abf5-26021f535555", app_num: 2 }
    ]
  };

  return respAppsList
}
//---------------------------------------------------------------------//
function devicesListRequest(values) {
  // Create a request to list devices
  // const createReq = new device_pb.ListDevicesRequest();
  // createReq.setLimit(99);
  // createReq.setApplicationId(items); //Application ID

  // deviceService.list(createReq, metadata, (err, resp) => {
  //     if (err !== null) {
  //         console.log(err);
  //         return;
  //     }
  //     console.log(resp);

  //     let devices = resp.array[1]; //list devices at index 1
  //     console.log(devices);

  //     for (const device of devices) {
  //         let devEUI = device[0]; // DevEUI at index 0
  //         let devName = device[4]; // Device name at index 4

  //         console.log("DevEUI:", devEUI);
  //         console.log("Device Name:", devName);
  //     }

  let data = values;
  console.log('test from device api');
  console.log(data);

  let respDevsList = { status: 'devsListSuccess', message: [
    { dev_name: "MAX-01", dev_id: "c735b5b4-8130-454b-abf5-26021f5327f0", last_seen: "2023-10-30T12:00:53.000Z" },
    { dev_name: "MAX-02", dev_id: "c735b5b4-8130-454b-abf5-26021f535555", last_seen: "2023-10-30T12:00:53.000Z" }
    ],
    app_id: '1',
    app_name: '1'
  };
  
  return respDevsList
}
//---------------------------------------------------------------------//
//---------------------------------------------------------------------//
function dashboardDeviceRequest(items, appId, appName) {
  // Create a request to list devices
  // const createReq = new device_pb.DeviceState();
  // createReq.setLimit(99);


  // deviceService.list(createReq, metadata, (err, resp) => {
  //     if (err !== null) {
  //         console.log(err);
  //         return;
  //     }
  //     console.log(resp);

  //     let devices = resp.array[1]; //list devices at index 1
  //     console.log(devices);

  //     for (const device of devices) {
  //         let devEUI = device[0]; // DevEUI at index 0
  //         let devName = device[4]; // Device name at index 4

  //         console.log("DevEUI:", devEUI);
  //         console.log("Device Name:", devName);
  //     }
  
  let respDashDevice = { status: 'dashDeviceSuccess',
  app_id: appId, app_name: appName, dev_id: items.dev_id, dev_name: items.dev_name,
    message: [
      { packets: "20", rssi: "-50", snr: "55" },
      { packets: "25", resi: "-25", snr: "55" }
    ]};

  return respDashDevice;
}
//---------------------------------------------------------------------//

module.exports = {
  applicationsListRequest,
  devicesListRequest,
  dashboardDeviceRequest
};
//---------------------------------------------------------------------//
