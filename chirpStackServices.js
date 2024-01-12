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
async function applicationsAndDeviceTotalCount(values) {
  try {
    return new Promise(async (resolve, reject) => {
      const respAppsListReq = await applicationsListRequest(values);
      let respForward = respAppsListReq;
  
      for (const appId of respForward.apps_list) {
        const respDevsListReq = await devicesTotalRequest(appId);
        appId.dev_totalCount = respDevsListReq;
      }

      resolve({ status: 'appsListAndDevCountSuccess', message: respForward});
    })
  } catch (error) {
    console.error(error);
  }
}
//---------------------------------------------------------------------//
async function applicationsListRequest(values) {
  try {
    const createReq = new application_pb.ListApplicationsRequest();
    createReq.setLimit(99);
    createReq.setTenantId(values);
    
    return new Promise((resolve, reject) => {
      applicationService.list(createReq, metadata, (err, resp) => {
        if (err !== null) {
          reject(err);
          return;
        }

        console.log('Applications list request has been completed.');

        const appsListData = resp.toObject().resultList.map(item => ({
          app_id: item.id,
          app_name: item.name,
          app_description: item.description,
          dev_totalCount: 0,
        }));

        const respAppsListReq = {
          apps_totalCount: resp.toObject().totalCount,
          apps_list: appsListData
        };
        resolve(respAppsListReq);
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
//---------------------------------------------------------------------//
async function devicesTotalRequest(values) {
  // Create a request to list devices
  const createReq = new device_pb.ListDevicesRequest();
  createReq.setLimit(99);
  createReq.setApplicationId(values.app_id); // Application ID

  return new Promise((resolve, reject) => {
    deviceService.list(createReq, metadata, (err, resp) => {
      if (err !== null) {
        reject(err);
        return;
      }

      console.log('Devices total request has been completed.');

      const dev_totalCount = resp.toObject().totalCount;

      resolve(dev_totalCount); 
    });
  });
}
//---------------------------------------------------------------------//
async function devicesListRequest(values) {
  // Create a request to list devices
  const createReq = new device_pb.ListDevicesRequest();
  createReq.setLimit(99);
  createReq.setApplicationId(values.app_id); //Application ID

  return new Promise((resolve, reject) => {
    deviceService.list(createReq, metadata, (err, resp) => {
      if (err !== null) {
          console.log(err);
          return;
      }

      console.log('Devices list request has been completed.');

      let respDevsListReq = resp.toObject().resultList.map(item => ({
        dev_name: item.name ? item.name : undefined,
        dev_id: item.devEui ? item.devEui : undefined,
        dev_lastSeen: item.lastSeenAt && item.lastSeenAt.seconds ? new Date(item.lastSeenAt.seconds * 1000 + item.lastSeenAt.nanos / 1e9) : undefined,
      }));

      resolve({ status: 'devsListSuccess', message: respDevsListReq, 
      app_id: values.app_id, app_name: values.app_name});
    });
  });
}
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
  applicationsAndDeviceTotalCount,
  addApplicationRequest,
  applicationsListRequest,
  devicesListRequest,
  dashboardDeviceRequest
};
//---------------------------------------------------------------------//
