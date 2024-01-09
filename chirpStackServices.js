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
function addApplicationRequest(items, tenantID) {
  // Create a new application.
  const newApplication = new application_pb.Application();
  newApplication.setName(items.app_name);
  newApplication.setDescription(items.description);
  newApplication.setTenantId(tenantID);

  // Create a request to create application.
  const createReq = new application_pb.CreateApplicationRequest();
  createReq.setApplication(newApplication);

  applicationService.create(createReq, metadata, (err, resp) => {
    if (err !== null) {
      console.log(err);
      return;
    }
    console.log('New application has been created.\n' + resp);

    let respReq = { status: 'addAppReqSuccess' };

    return respReq;
  });
}
//---------------------------------------------------------------------//
function applicationsListRequest(values) {
  // Create a request to list applications.
  const createReq = new application_pb.ListApplicationsRequest();
  createReq.setLimit(99);
  createReq.setOffset(0);
  createReq.setTenantId(values);
  
  applicationService.list(createReq, metadata, (err, resp) => {
  if (err !== null) {
      console.log(err);
  }

  console.log('list applications has been completed.');
  let resp_listApplicationsReq = resp.toObject().resultList.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
  }));
  resp_listApplicationsReq.totalCount = resp.toObject().totalCount;
  
  let respReq = { status: 'addAppReqSuccess', message: resp_listApplicationsReq};
  console.log(respReq);

  return respReq;
  });
}
//---------------------------------------------------------------------//
function devicesListRequest(values) {
  // Create a request to list devices
  const createReq = new device_pb.ListDevicesRequest();
  createReq.setLimit(99);
  createReq.setApplicationId(values); //Application ID

  deviceService.list(createReq, metadata, (err, resp) => {
      if (err !== null) {
          console.log(err);
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

      let respReq = { status: 'devsListSuccess', message: resp_listApplicationsReq};
      console.log(respReq);
    
      return respReq;
    });
}
//---------------------------------------------------------------------//
//---------------------------------------------------------------------//
function dashboardDeviceRequest(values, appId, appName) { 
  console.log('test from dash api');
  console.log(values);

  let respDashDevice = { status: 'dashDeviceSuccess',
  app_id: appId, app_name: appName, dev_id: values.dev_id, dev_name: values.dev_name,
    message: [
      { packets: "20", rssi: "-50", snr: "55" },
      { packets: "25", resi: "-25", snr: "55" }
  ]};

  return respDashDevice;
}
//---------------------------------------------------------------------//
module.exports = {
  addApplicationRequest,
  applicationsListRequest,
  devicesListRequest,
  dashboardDeviceRequest
};
//---------------------------------------------------------------------//
