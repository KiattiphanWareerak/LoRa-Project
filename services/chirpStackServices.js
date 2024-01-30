//---------------------------------------------------------------------// 
//----------------------ChirpStack API Services------------------------//
//---------------------------------------------------------------------// 
const grpc = require("@grpc/grpc-js");
const application_grpc = require("@chirpstack/chirpstack-api/api/application_grpc_pb");
const application_pb = require("@chirpstack/chirpstack-api/api/application_pb");
const device_grpc = require("@chirpstack/chirpstack-api/api/device_grpc_pb");
const device_pb = require("@chirpstack/chirpstack-api/api/device_pb");
const device_profile_grpc = require("@chirpstack/chirpstack-api/api/device_profile_grpc_pb");
const device_profile_pb = require("@chirpstack/chirpstack-api/api/device_profile_pb");
const gateway_grpc = require("@chirpstack/chirpstack-api/api/gateway_grpc_pb");
const gateway_pb = require("@chirpstack/chirpstack-api/api/gateway_pb");
const internal_grpc = require("@chirpstack/chirpstack-api/api/internal_grpc_pb");
const internal_pb = require("@chirpstack/chirpstack-api/api/internal_pb");
const tenant_grpc = require("@chirpstack/chirpstack-api/api/tenant_grpc_pb");
const tenant_pb = require("@chirpstack/chirpstack-api/api/tenant_pb");
const user_grpc = require("@chirpstack/chirpstack-api/api/user_grpc_pb");
const user_pb = require("@chirpstack/chirpstack-api/api/user_pb");

const common_common_pb = require("@chirpstack/chirpstack-api/common/common_pb");
const google_protobuf_timestamp_pb = require("google-protobuf/google/protobuf/timestamp_pb");

// This must point to the ChirpStack API interface.
// const serverChirpStack = "192.168.50.54:8080";
const serverChirpStack = "202.28.95.234:8080";

// Create the client for the Service.
const applicationService = new application_grpc.ApplicationServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
);

const deviceService = new device_grpc.DeviceServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
);

const deviceProfileService = new device_profile_grpc.DeviceProfileServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
);

const gatewayService = new gateway_grpc.GatewayServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
);

const internalService = new internal_grpc.InternalServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
);

const tenantService = new tenant_grpc.TenantServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
);

const userService = new user_grpc.UserServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
);
//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
//---------------------------------------------------------------------//
async function addApplicationRequest(values, apiToken, tenantID) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    // Create a new application.
    const newApplication = new application_pb.Application();
    newApplication.setName(values.app_name);
    newApplication.setDescription(values.app_desc);
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
        console.log('New an application has been created.');

        resolve({ request: 'addApp', message: { status: 'success', data: undefined }});
      });
    });
  } catch (error) {
    console.error(error);
  }
}
//---------------------------------------------------------------------//
async function addDeviceAndCreateDeviceKey(values, apiToken, appId) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise(async (resolve, reject) => {
      const respAddDevReq = await addDeviceRequest(values, apiToken, appId);
      let dataForward = respAddDevReq.message.data;
      const respAddDevKeyReq = await createDeviceKeyRequest(dataForward, apiToken)
      resolve(respAddDevKeyReq);
    })
  } catch (error) {
    console.error(error);
  }
}
//---------------------------------------------------------------------//
async function addDeviceRequest(values, apiToken, appId) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a new device.
      const newDevice = new device_pb.Device();
      newDevice.setApplicationId(appId);
      newDevice.setName(values.dev_name);
      newDevice.setDevEui(values.dev_id);
      newDevice.setDeviceProfileId('222ebb6d-e497-4ef2-825b-db8ec5fd1680');
      // newDevice.setDeviceProfileId("74085133-a46e-4ce8-b175-4d1b2d2545f9");
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

      resolve({ request: 'addDev', message: { 
        status: 'success', 
        data: { dev_id: values.dev_id, dev_key: values.dev_key }
        }});
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
// async function applicationsAndDeviceTotalCount(apiToken, tenantId) {
//   try {
//     return new Promise(async (resolve, reject) => {
//       const respAppsListReq = await applicationsListRequest(apiToken, tenantId);
//       let respForward = respAppsListReq;
  
//       for (const appId of respForward.apps_list) {
//         const respDevsListReq = await devicesTotalRequest(appId);
//         appId.dev_totalCount = respDevsListReq;
//       }

//       resolve({ request: 'dispApp', message: { status: 'success', data: respForward }});
//     })
//   } catch (error) {
//     console.error(error);
//   }
// }
//---------------------------------------------------------------------//
async function applicationConfigurationsRequest(values, apiToken, tenantId, appId) {
  try {
    return new Promise((resolve, reject) => {
      // Create the Metadata object.
      const metadata = new grpc.Metadata();
      metadata.set("authorization", "Bearer " + apiToken);

      // Create an application.
      const updateApplication = new application_pb.Application();
      updateApplication.setId(appId);
      updateApplication.setName(values.app_name);
      updateApplication.setDescription(values.app_desc);
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

      resolve({ request: 'appConfig', message: { status: 'success', data: undefined }});
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
//---------------------------------------------------------------------//
async function applicationsListRequest(apiToken, tenantId) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    const createReq = new application_pb.ListApplicationsRequest();
    createReq.setLimit(99);
    createReq.setTenantId(tenantId);
    
    return new Promise((resolve, reject) => {
      applicationService.list(createReq, metadata, (err, resp) => {
        if (err !== null) {
          reject(err);
          return;
        }

        console.log('Applications list request has been completed.');

        // const appsListData = resp.toObject().resultList.map(item => ({
        //   app_id: item.id ? item.id : undefined,
        //   app_name: item.name ? item.name : 'Never added application.',
        //   app_description: item.description ? item.description : undefined,
        //   dev_totalCount: undefined,
        // }));

        // const respAppsListReq = {
        //   apps_totalCount: resp.toObject().totalCount,
        //   apps_list: appsListData
        // };
        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
//---------------------------------------------------------------------//
async function createDeviceKeyRequest(values, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a device key (OTAA Key).
      const deviceKey = new device_pb.DeviceKeys();
      deviceKey.setDevEui(values.dev_id);
      deviceKey.setNwkKey(values.dev_key); // LoRaWAN 1.0.x
      deviceKey.setAppKey(values.dev_key); // LoRaWAN 1.1.x

      // Create a request to add a device key.
      const createReq = new device_pb.CreateDeviceKeysRequest();
      createReq.setDeviceKeys(deviceKey);

      deviceService.createKeys(createReq, metadata, (err, resp) => {
      if (err !== null) {
          console.log(err);
          return;
      }
      console.log('App Key (OTAA) has been created.');

      resolve({ request: 'addDev', message: { status: 'success', data: undefined }});
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function createTenant(values, apiToken) { 
  // Create the Metadata object.
  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Bearer " + apiToken);

  return new Promise((resolve, reject) => {
    // Create a tenant.
    const newTenant = new tenant_pb.Tenant();
    newTenant.setName(values.user_name);
    newTenant.setCanHaveGateways(true);
    newTenant.setPrivateGatewaysUp(false);
    newTenant.setPrivateGatewaysDown(false);
    newTenant.setMaxGatewayCount(0);
    newTenant.setMaxDeviceCount(0);

    // Create a request to create a tenant.
    const createReq = new tenant_pb.CreateTenantRequest();
    createReq.setTenant(newTenant);

    tenantService.create(createReq, metadata, (err, resp) => {
    if (err !== null) {
        console.log(err.details);
        resolve({ request: 'createTenant', message: { 
          status: 'failed', 
          data: err.message }
        });
        return;
    }
    console.log('Creaate a tenant has been completed.');

    resolve({ request: 'createTenant', message: { 
      status: 'success', 
      data: { tenant_id: resp.toObject().id,
        user_name: values.user_name, 
        user_id: values.user_id,
        user_em: values.user_em,
        user_pw: values.user_pw }
      }});
    });
  });
}
//---------------------------------------------------------------------//
async function createUser(values, apiToken) { 
  // Create the Metadata object.
  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Bearer " + apiToken);

  return new Promise((resolve, reject) => {
    // Create a tenant for user
    const userTenant = new user_pb.User();
    userTenant.setEmail(values.user_em);
    userTenant.setIsAdmin(false);
    userTenant.setIsActive(true);

    // Create a user to use an application.
    const createReq = new user_pb.CreateUserRequest();
    createReq.setUser(userTenant);
    createReq.setPassword(values.user_pw);

    userService.create(createReq, metadata, (err, resp) => {
      if (err !== null) {
        console.log(err.details);
        resolve({ request: 'createUser', message: { 
          status: 'failed', 
          data: err.message }
        });
        return;
      }
      console.log('Creaate a user has been completed.');

      resolve({ request: 'createUser', message: { 
        status: 'success', 
        data: { user_name: values.user_name, 
          user_id: resp.toObject().id,
          user_em: values.user_em,
          user_pw: values.user_pw }
        }});
    });
  });
}
//---------------------------------------------------------------------//
async function createTenantUser(values, apiToken) { 
  // Create the Metadata object.
  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Bearer " + apiToken);

  return new Promise((resolve, reject) => {
    // Create a tenant user.
    const tenantUser = new tenant_pb.TenantUser();
    tenantUser.setTenantId(values.tenant_id);
    tenantUser.setUserId(values.user_id);
    tenantUser.setIsAdmin(false);
    tenantUser.setIsDeviceAdmin(true);
    tenantUser.setIsGatewayAdmin(false);
    tenantUser.setEmail(values.user_em);

    // Create a request to create a tenant user.
    const createReq = new tenant_pb.AddTenantUserRequest();
    createReq.setTenantUser(tenantUser);

    tenantService.addUser(createReq, metadata, (err, resp) => {
      if (err !== null) {
          console.log(err.details);
          resolve({ request: 'createTenantUser', message: { 
            status: 'failed', 
            data: err.message }
          });
          return;
      }
      console.log('Creaate a tenant user has been completed.');

      resolve({ request: 'createTenantUser', message: { 
          status: 'success', 
          data: resp.toObject()
        }});
    });
  });
}
//---------------------------------------------------------------------//
async function deleteApplicationRequest(values, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

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

      resolve({ request: 'delApp', message: { status: 'success', data: undefined }});
    });
  } catch (error) {
    console.error(error);
  }
}
//---------------------------------------------------------------------//
async function deleteDeviceRequest(values, apiToken) {
  try {
    console.log("test");
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      for (const value of values) {
        // Create a request to delete a device.
        const createReq = new device_pb.DeleteDeviceRequest();
        createReq.setDevEui(value.dev_id);
  
        deviceService.delete(createReq, metadata, (err, resp) => {
          if (err !== null) {
              console.log(err);
              return;
          }
          console.log('Device has been deleted.');
        });
      }

      resolve({ request: 'delDev', message: { status: 'success', data: undefined }});
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function devicesListRequest(values, apiToken) {
  // Create the Metadata object.
  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Bearer " + apiToken);

  return new Promise((resolve, reject) => {
    // Create a request to list devices
    const createReq = new device_pb.ListDevicesRequest();
    createReq.setLimit(99);
    createReq.setApplicationId(values.app_id); //Application ID

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

      resolve({ request: 'enterAppId', message: { 
        status: 'success', 
        data: { devs_list: respDevsListReq, app_config: undefined}}
      });
    });
  });
}
//---------------------------------------------------------------------//
// async function devicesTotalRequest(values) {
//   // Create the Metadata object.
//   const metadata = new grpc.Metadata();
//   metadata.set("authorization", "Bearer " + apiToken);

//   // Create a request to list devices
//   const createReq = new device_pb.ListDevicesRequest();
//   createReq.setLimit(99);
//   createReq.setApplicationId(values.app_id); // Application ID

//   return new Promise((resolve, reject) => {
//     deviceService.list(createReq, metadata, (err, resp) => {
//       if (err !== null) {
//         reject(err);
//         return;
//       }

//       console.log('Devices total request has been completed.');

//       const dev_totalCount = resp.toObject().totalCount;

//       resolve(dev_totalCount); 
//     });
//   });
// }
//---------------------------------------------------------------------//
async function enterDeviceRequest(values, apiToken, tenantId, appName) { 
  try {
    let data = {};

    return new Promise(async (resolve, reject) => {
      const respGetLinkMetric = await getLinkMetricsRequest(values.dev_id, apiToken);
      const respGetDevConfig = await getDeviceConfiguration(values.dev_id, apiToken);
      const respGetDevKey = await getDeviceKey(values.dev_id, apiToken);
      const respGetActivation = await getDeviceActivation(values.dev_id, apiToken);
      const respGetDeviceProfile = await getDeviceProfile(tenantId, apiToken);
      const respGetQueueItems = await getQueueItems(values.dev_id, apiToken);

      data.dev_linlMetrics = respGetLinkMetric;
      data.dev_config = respGetDevConfig;
      data.dev_key = respGetDevKey;
      data.dev_activation = respGetActivation;
      data.dev_profiles = respGetDeviceProfile;
      data.dev_queueItems = respGetQueueItems;
      
      resolve({ request: 'enterDevId', message: { 
        status: 'success', 
        data: { app_name: appName, 
          dev_dash: data }}
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getApplicationRequest(values, apiToken) { 
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a request to get application.
      const createReq = new application_pb.GetApplicationRequest();
      createReq.setId(values);

      applicationService.get(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          return;
        }
        console.log('Get Application has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getDeviceActivation(values, apiToken) { 
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a request to get device key.
      const createReq = new device_pb.GetDeviceActivationRequest();
      createReq.setDevEui(values);

      deviceService.getActivation(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          return;
        }
        console.log('Get Activation has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getDeviceConfiguration(values, apiToken) { 
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a request to get device.
      const createReq = new device_pb.GetDeviceRequest();
      createReq.setDevEui(values);

      deviceService.get(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          return;
        }
        console.log('Get Device has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getDeviceKey(values, apiToken) { 
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a request to get device key.
      const createReq = new device_pb.GetDeviceKeysRequest();
      createReq.setDevEui(values);

      deviceService.getKeys(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          return;
        }
        console.log('Get Device Key has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getDeviceProfile(values, apiToken) { 
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);
    
    return new Promise((resolve, reject) => {
      // Create a request to list device profile.
      const createReq = new device_profile_pb.ListDeviceProfilesRequest();
      createReq.setLimit(99);
      createReq.setTenantId(values);

      deviceProfileService.list(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          return;
        }
        console.log('List Device Profiles has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getEvents(values, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a request to get event.
      const createReq = new tenant_pb.ListTenantsRequest();
      createReq.setLimit(99);
      createReq.setUserId("2232ce09-7731-4d69-bae3-eb0431346065");

      tenantService.list(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          return;
        }
        console.log('Stream Device Events has been completed.');
        console.log(resp.toObject());
        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getLinkMetricsRequest(values, apiToken) { 
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    // CurrentTime
    const currentTimestamp = google_protobuf_timestamp_pb.Timestamp.fromDate(new Date());
    
    // 24 hour ago
    const twentyFourHoursAgoTimestamp = new google_protobuf_timestamp_pb.Timestamp();
    const twentyFourHoursAgoDate = new Date();
    twentyFourHoursAgoDate.setHours(twentyFourHoursAgoDate.getHours() - 24);
    twentyFourHoursAgoTimestamp.fromDate(twentyFourHoursAgoDate);

    // 1 month ago
    const oneMonthAgoTimestamp = new google_protobuf_timestamp_pb.Timestamp();
    const oneMonthAgoDate = new Date();
    oneMonthAgoDate.setMonth(oneMonthAgoDate.getMonth() - 1);
    oneMonthAgoTimestamp.fromDate(oneMonthAgoDate);

    // 1 Year ago
    const oneYearAgoTimestamp = new google_protobuf_timestamp_pb.Timestamp();
    const oneYearAgoDate = new Date();
    oneYearAgoDate.setFullYear(oneYearAgoDate.getFullYear() - 1);
    oneYearAgoTimestamp.fromDate(oneYearAgoDate);

    return new Promise((resolve, reject) => {
      // Create a request to get event.
      const createReq = new device_pb.GetDeviceLinkMetricsRequest();
      createReq.setDevEui(values);
      createReq.setStart(oneYearAgoTimestamp);
      createReq.setEnd(currentTimestamp);
      createReq.setAggregation(common_common_pb.Aggregation.DAY);

      deviceService.getLinkMetrics(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          return;
        }
        console.log('Get Event has been completed.');
        
        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getQueueItems(values, apiToken) { 
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a request to get queue.
      const createReq = new device_pb.GetDeviceQueueItemsRequest();
      createReq.setDevEui(values);


      deviceService.getQueue(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          return;
        }
        console.log('Get Queue Items has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function functions(values) { 
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {

    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
module.exports = {
  addApplicationRequest,
  addDeviceAndCreateDeviceKey,
  applicationConfigurationsRequest,
  applicationsListRequest,
  createTenant,
  createUser,
  createTenantUser,
  deleteApplicationRequest,
  deleteDeviceRequest,
  devicesListRequest,
  enterDeviceRequest,
  getApplicationRequest,
};
//---------------------------------------------------------------------//
