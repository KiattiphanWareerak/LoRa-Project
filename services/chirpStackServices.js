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
async function applicationConfigurationsRequest(values, appId, tenantId) {
  try {
    return new Promise((resolve, reject) => {
      // Create an application.
      const updateApplication = new application_pb.Application();
      updateApplication.setId(appId);
      updateApplication.setName(values.app_name);
      updateApplication.setDescription(values.app_desp);
      updateApplication.setTenantId(tenantId);

      // Create a request to update an application.
      const createReq = new application_pb.UpdateApplicationRequest();
      createReq.setApplication(updateApplication);

      applicationService.update(createReq, metadata, (err, resp) => {
      if (err !== null) {
          console.log(err);
          return;
      }
      console.log('Update an application has been completed.');

      resolve({ status: 'appConfigReqSuccess' });
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
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
          app_id: item.id ? item.id : undefined,
          app_name: item.name ? item.name : 'Never added application.',
          app_description: item.description ? item.description : undefined,
          dev_totalCount: undefined,
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
async function addApplicationRequest(values, tenantID) {
  try {
    // Create a new application.
    const newApplication = new application_pb.Application();
    newApplication.setName(values.app_name);
    newApplication.setDescription(values.description);
    newApplication.setTenantId(tenantID);
    
    return new Promise((resolve, reject) => {
      // Create a request to create application.
      const createReq = new application_pb.CreateApplicationRequest();
      createReq.setApplication(newApplication);

      applicationService.create(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          return;
        }
        console.log('New application has been created.');

        resolve({ status: 'addAppReqSuccess' });
      });
    });
  } catch (error) {
    console.error(error);
  }
}
//---------------------------------------------------------------------//
async function deleteApplicationRequest(values) {
  try {    
    return new Promise((resolve, reject) => {
      for (const appID of values) {
        // Create a request to delete an application.
        const createReq = new application_pb.DeleteApplicationRequest();
        createReq.setId(appID.app_id);
  
        applicationService.delete(createReq, metadata, (err, resp) => {
          if (err !== null) {
            console.log(err);
            return;
          }
          console.log('Delete an application has been completed.');
        });
      }

      resolve({ status: 'delAppReqSuccess' });
    });
  } catch (error) {
    console.error(error);
  }
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
        dev_name: item.name ? item.name : 'Never added device in this application.',
        dev_id: item.devEui ? item.devEui : undefined,
        dev_lastSeen: item.lastSeenAt && item.lastSeenAt.seconds ? new Date(item.lastSeenAt.seconds * 1000 + item.lastSeenAt.nanos / 1e9) : undefined,
      }));

      resolve({ status: 'devsListSuccess', message: respDevsListReq, 
      app_id: values.app_id, app_name: values.app_name});
    });
  });
}
//---------------------------------------------------------------------//
async function addDeviceAndCreateDeviceKey(values, appID) {
  try {
    return new Promise(async (resolve, reject) => {
      const respAddDevReq = await addDeviceRequest(values, appID);
      console.log(respAddDevReq);
      let respForward = respAddDevReq.message;
      const respAddDevKeyReq = await createDeviceKeyRequest(respForward)
      resolve(respAddDevKeyReq);
    })
  } catch (error) {
    console.error(error);
  }
}
//---------------------------------------------------------------------//
async function addDeviceRequest(values, appID) {
  try {
    return new Promise((resolve, reject) => {
      // Create a new device.
      const newDevice = new device_pb.Device();
      newDevice.setApplicationId(appID);
      newDevice.setName(values.dev_name);
      newDevice.setDevEui(values.dev_id);
      newDevice.setDeviceProfileId("74085133-a46e-4ce8-b175-4d1b2d2545f9");
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

      resolve({ status: 'addAppReqSuccess', message: { 
        dev_id: values.dev_id, dev_key: values.dev_key }});
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function createDeviceKeyRequest(values) {
  try {
    return new Promise((resolve, reject) => {
      // Create a device key (OTAA Key).
      const deviceKey = new device_pb.DeviceKeys();
      deviceKey.setDevEui(values.dev_id);
      deviceKey.setNwkKey(values.dev_key); // LoRaWAN 1.0.x
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

      resolve({ status: 'createDevKeyReqSuccess' });
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function deleteDeviceRequest(values) {
  try {
    return new Promise((resolve, reject) => {
      for (const devID of values) {
        // Create a request to delete a device.
        const createReq = new device_pb.DeleteDeviceRequest();
        createReq.setDevEui(devID.dev_id);
  
        deviceService.delete(createReq, metadata, (err, resp) => {
          if (err !== null) {
              console.log(err);
              return;
          }
          console.log('Device has been deleted.');
        });
      }

      resolve({ status: 'delDevReqSuccess' });
    });
  } catch (error) {
    console.log(error);
  }
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
  applicationConfigurationsRequest,
  addDeviceAndCreateDeviceKey,
  applicationsAndDeviceTotalCount,
  addApplicationRequest,
  applicationsListRequest,
  devicesListRequest,
  deleteApplicationRequest,
  deleteDeviceRequest,
  dashboardDeviceRequest
};
//---------------------------------------------------------------------//
