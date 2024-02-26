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
const google_protobuf_empty_pb = require("google-protobuf/google/protobuf/empty_pb");
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
          console.log(err.details);
          resolve({ request: 'addApp', message: { 
            status: 'failed', 
            data: err.message }
          });
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
      newDevice.setDescription("");
      newDevice.setIsDisabled(true);
      newDevice.setSkipFcntCheck(true);

      // Create a request to add a new device.
      const createReq = new device_pb.CreateDeviceRequest();
      createReq.setDevice(newDevice);

      deviceService.create(createReq, metadata, (err, resp) => {
      if (err !== null) {
        console.log(err.details);
        resolve({ request: 'addDev', message: { 
          status: 'failed', 
          data: err.message }
        });
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
async function addDeviceProfilesRequest(values, apiToken) { 
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    let devProfs = deviceProfiles(values);

    return new Promise((resolve, reject) => {
      for ( const devProf of devProfs) {
        // Create a new device profile.
        const newDevProfs = new device_profile_pb.DeviceProfile();
        newDevProfs.setTenantId(devProf.id);
        newDevProfs.setName(devProf.name);
        newDevProfs.setRegion(common_common_pb.Region.AS923);
        newDevProfs.setRegionConfigId('AS923');
        newDevProfs.setMacVersion(devProf.macVersion);
        newDevProfs.setRegParamsRevision(common_common_pb.RegParamsRevision.A);
        newDevProfs.setAdrAlgorithmId('default');
        newDevProfs.setFlushQueueOnActivate(true);
        newDevProfs.setUplinkInterval(3600);
        newDevProfs.setAllowRoaming(false);
        newDevProfs.setDeviceStatusReqInterval(1);
        newDevProfs.setSupportsOtaa(true);
        newDevProfs.setSupportsClassB(false);
        newDevProfs.setSupportsClassC(true);
        newDevProfs.setClassCTimeout(5);
        // newDevProfs.setPayloadCodecScript();
        newDevProfs.setIsRelay(false);
        newDevProfs.setIsRelayEd(false);
        newDevProfs.setAutoDetectMeasurements(true);

        // Create a request to add a new device.
        const createReq = new device_profile_pb.CreateDeviceProfileRequest();
        createReq.setDeviceProfile(newDevProfs);

        deviceProfileService.create(createReq, metadata, (err, resp) => {
          if (err !== null) {
          console.log(err.details);
          resolve({ request: 'addDevProfs', message: { 
            status: 'failed', 
            data: err.message }
          });
          return;
        }
        console.log('New device profile has been created: ', devProf.name);
        });
      }

      resolve({ request: 'addDevProfs', message: { 
        status: 'success', 
        data: {}
      }});
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function addGatewayRequest(values, tenantId, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      for ( const gw of values) {
        // Create a new gateway.
        const newGw = new gateway_pb.Gateway();
        newGw.setTenantId(tenantId);
        newGw.setName(gw.name);
        newGw.setGatewayId(gw.id);
        newGw.setStatsInterval(30);

        // Create a request to add a new gateway.
        const createReq = new gateway_pb.CreateGatewayRequest();
        createReq.setGateway(newGw);

        gatewayService.create(createReq, metadata, (err, resp) => {
          if (err !== null) {
          console.log(err.details);
          resolve({ request: 'addGw', message: { 
            status: 'failed', 
            data: err.message }
          });
          return;
        }
        console.log('New gateway has been created: ', gw.name);
        });
      }

      resolve({ request: 'addGw', message: { 
        status: 'success', 
        data: {}
      }});
    });
  } catch (error) {
    console.log(error);
  }
}
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
        console.log(err.details);
        resolve({ request: 'appConfig', message: { 
          status: 'failed', 
          data: err.message }
        });
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
async function applicationsListRequest(tenantId, apiToken) {
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
          console.log(err.details);
          resolve({ request: 'appsList', message: { 
            status: 'failed', 
            data: err.message }
          });
          return;
        }

        console.log('Applications list request has been completed.');

        resolve({ request: 'appsList', message: { 
          status: 'success', 
          data: resp.toObject() }
        });
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
        console.log(err.details);
        resolve({ request: 'createDevKey', message: { 
          status: 'failed', 
          data: err.message }
        });
        return;
      }
      console.log('App Key (OTAA) has been created.');

      resolve({ request: 'createDevKey', message: { status: 'success', data: undefined }});
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function createTenant(values, apiToken) { 
  try {
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
          user_id: values.user_id,
          user_em: values.user_em }
        }});
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function createUser(values, apiToken) { 
  try {
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
                  user_em: values.user_em }
        }});
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function createTenantUser(values, apiToken) { 
  try {
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
      tenantUser.setIsGatewayAdmin(true);
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
  } catch (error) {
    console.log(error);
  }
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
            console.log(err.details);
            resolve({ request: 'delApp', message: { 
              status: 'failed', 
              data: err.message }
            });
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
async function deviceConfigurationsRequest(values, apiToken, tenantId, appName) { 
  try {
    let data = {};

    return new Promise(async (resolve, reject) => {
      const respGetLinkMetric = await getLinkMetricsRequest(values.dev_id, apiToken);
      const respGetDevConfig = await getDeviceConfiguration(values.dev_id, apiToken);
      const respGetDevKey = await getDeviceKey(values.dev_id, apiToken);
      const respGetActivation = await getDeviceActivation(values.dev_id, apiToken);
      const respGetDeviceProfile = await getDeviceProfile(tenantId, apiToken);
      const respGetQueueItems = await getQueueItems(values.dev_id, apiToken);
      const respGetEvents = await getDeviceEventsRequest(values.dev_id, apiToken);
      const respGetFrames = await getDeviceFramesRequest(values.dev_id, apiToken);

      data.dev_linkMetrics = respGetLinkMetric;
      data.dev_config = respGetDevConfig;
      data.dev_key = respGetDevKey;
      data.dev_activation = respGetActivation;
      data.dev_profiles = respGetDeviceProfile;
      data.dev_queueItems = respGetQueueItems;
      data.dev_events = respGetEvents;
      data.dev_frames = respGetFrames;
      
      resolve({ request: 'dispDashDev', message: { 
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
            console.log(err.details);
            resolve({ request: 'delDev', message: { 
              status: 'failed', 
              data: err.message }
            });
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
async function devicesListRequest(appId, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a request to list devices
      const createReq = new device_pb.ListDevicesRequest();
      createReq.setLimit(99);
      createReq.setApplicationId(appId); //Application ID

      deviceService.list(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err.details);
          resolve({ request: 'dispDev', message: { 
            status: 'failed', 
            data: err.message }
          });
          return;
        }
        console.log('Devices list request has been completed.');

        resolve({ request: 'dispDev', message: { 
          status: 'success', 
          data: { devs_list: resp.toObject() }}
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function deviceProfilesListRequest(tenantId, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    const createReq = new device_profile_pb.ListDeviceProfilesRequest();
    createReq.setLimit(99);
    createReq.setTenantId(tenantId);
    
    return new Promise((resolve, reject) => {
      deviceProfileService.list(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err.details);
          resolve({ request: 'dispDevProfiles', message: { 
            status: 'failed', 
            data: err.message }
          });
          return;
        }
        console.log('Device profiles list request has been completed.');

        resolve({ request: 'dispDevProfiles', message: { 
          status: 'success', 
          data: resp.toObject() }
        });
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
//---------------------------------------------------------------------//
async function enterApplicationRequest(values, apiToken) {
  try {
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
          console.log(err.details);
          resolve({ request: 'enterAppId', message: { 
            status: 'failed', 
            data: err.message }
          });
          return;
        }
        console.log('Devices list request has been completed.');

        resolve({ request: 'enterAppId', message: { 
          status: 'success', 
          data: { devs_list: resp.toObject() }}
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
}
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
      const respGetEvents = await getDeviceEventsRequest(values.dev_id, apiToken);
      const respGetFrames = await getDeviceFramesRequest(values.dev_id, apiToken);

      data.dev_linkMetrics = respGetLinkMetric;
      data.dev_config = respGetDevConfig;
      data.dev_key = respGetDevKey;
      data.dev_activation = respGetActivation;
      data.dev_profiles = respGetDeviceProfile;
      data.dev_queueItems = respGetQueueItems;
      data.dev_events = respGetEvents;
      data.dev_frames = respGetFrames;
      
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
async function getApplicationRequest(appId, apiToken) { 
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a request to get application.
      const createReq = new application_pb.GetApplicationRequest();
      createReq.setId(appId);

      applicationService.get(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err.details);
          resolve({ request: 'getAdd', message: { 
            status: 'failed', 
            data: err.message }
          });
          return;
        }
        console.log('Get Application has been completed.');

        resolve({ request: 'getApp', message: { 
          status: 'success', 
          data: { app_config: resp.toObject() }}
        });
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
async function getDevicesSummaryRequest(tenantId, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a request to list devices
      const createReq = new internal_pb.GetDevicesSummaryRequest();
      createReq.setTenantId(tenantId);

      internalService.getDevicesSummary(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err.details);
          resolve({ request: 'devsSummary', message: { 
            status: 'failed', 
            data: err.message }
          });
          return;
        }
        console.log('Devices summary request has been completed.');

        resolve({ request: 'devsSummary', message: { 
          status: 'success', 
          data: resp.toObject() }
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getDeviceEventsRequest(values, apiToken) { 
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    let dataEvents = {
      dev_events: [],
    };

    let eventCount = 0;
    return new Promise((resolve, reject) => {
      const createReq = new internal_pb.StreamDeviceEventsRequest();
      createReq.setDevEui(values);
    
      console.log("Streaming device events for:", values);
    
      const stream = internalService.streamDeviceEvents(createReq, metadata);
    
      stream.on("data", (response) => {
          // console.log("Received device event:", response);
          
          dataEvents.dev_events.push(response);
          eventCount++;
    
          // Stop the stream after receiving 10 events
          if (eventCount === 10) {
              stream.cancel();
          }
      });
    
      stream.on("error", (error) => {
        console.error("Error streaming device events:", error.details);
        
        // resolve({ request: 'devEvents', message: { 
        //   status: 'failed', 
        //   data: error.details }
        // });
      });
    
      stream.on("end", () => {
        console.log("Device event stream ended.");

        resolve(dataEvents.dev_events);
        // resolve({ request: 'devEvents', message: { 
        //   status: 'success', 
        //   data: dataEvents }
        // });
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getDeviceFramesRequest(values, apiToken) { 
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    let dataFrames = {
      dev_frames: [],
    };
    
    let frameCount = 0;
    return new Promise((resolve, reject) => {
      const createReq = new internal_pb.StreamDeviceFramesRequest();
      createReq.setDevEui(values);
    
      console.log("Streaming device frames for:", values);
    
      const stream = internalService.streamDeviceFrames(createReq, metadata);
    
      stream.on("data", (response) => {
          // console.log("Received device frame:", response);

          dataFrames.dev_frames.push(response);
          frameCount++;
    
          // Stop the stream after receiving 10 events
          if (frameCount === 10) {
              stream.cancel();
          }
      });
    
      stream.on("error", (error) => {
          console.error("Error streaming device frames:", error.details);

          // resolve({ request: 'devFrames', message: { 
          //   status: 'failed', 
          //   data: error.details }
          // });
      });
    
      stream.on("end", () => {
        console.log("Device frame stream ended.");

        resolve(dataFrames.dev_frames);
        // resolve({ request: 'devFrames', message: { 
        //   status: 'success', 
        //   data: dataFrames }
        // });
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getGatewaysSummaryRequest(tenantId, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a request to list devices
      const createReq = new internal_pb.GetGatewaysSummaryRequest();
      createReq.setTenantId(tenantId);

      internalService.getGatewaysSummary(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err.details);
          resolve({ request: 'gatewaysSummary', message: { 
            status: 'failed', 
            data: err.message }
          });
          return;
        }
        console.log('Gateway summary request has been completed.');

        resolve({ request: 'gatewaysSummary', message: { 
          status: 'success', 
          data: resp.toObject() }
        });
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
async function getMainDashboard(tenantId, apiToken) { 
  try {
    let data = {};

    return new Promise(async (resolve, reject) => {
      const respFromAppsList = await applicationsListRequest(tenantId, apiToken);
      data.apps_list = respFromAppsList.message.data;

      let index = 0;
      for (const app of respFromAppsList.message.data.resultList) {
        const respFromDevList = await devicesListRequest(app.id, apiToken);

        data.apps_list.resultList[index].totalCount_devs = respFromDevList.message.data.devs_list.totalCount;
        index++;
      }

      const respFromGatewayList = await gatewayListRequest("52f14cd4-c6f1-4fbd-8f87-4025e1d49242", apiToken);
      data.gateways_list = respFromGatewayList.message.data;

      const respFromGetewaysSummary = await getGatewaysSummaryRequest("52f14cd4-c6f1-4fbd-8f87-4025e1d49242", apiToken);
      const respFromDevicesSummary = await getDevicesSummaryRequest(tenantId, apiToken);
      data.geteways_summary = respFromGetewaysSummary.message.data;
      data.devs_summary = respFromDevicesSummary.message.data;
      
      resolve({ request: 'dispMainDash', message: { 
        status: 'success', 
        data: data}
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
async function gatewayListRequest(tenantId, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a request to list devices
      const createReq = new gateway_pb.ListGatewaysRequest();
      createReq.setLimit(99);
      createReq.setTenantId(tenantId);

      gatewayService.list(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err.details);
          resolve({ request: 'gatewayList', message: { 
            status: 'failed', 
            data: err.message }
          });
          return;
        }
        console.log('Gateway list request has been completed.');

        resolve({ request: 'gatewayList', message: { 
          status: 'success', 
          data: resp.toObject() }
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function loginUserRequest(values, apiToken) { 
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a request to get queue.
      const createReq = new internal_pb.LoginRequest();
      createReq.setEmail(values.user_em);
      createReq.setPassword(values.user_pw);

      internalService.login(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err.details);
          resolve({ request: 'loginUser', message: { 
            status: 'failed', 
            data: { err: err.message }}
          });
          return;
        }
        console.log('Login has been completed.');

        resolve({ request: 'loginUser', message: { 
          status: 'success', 
          data: { jwt: resp.toObject().jwt }}
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function profileUserRequest(apiToken) { 
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a empty.
      const createReq = new google_protobuf_empty_pb.Empty();

      internalService.profile(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err.details);
          resolve({ request: 'profileUser', message: { 
            status: 'failed', 
            data: { err: err.message }}
          });
          return;
        }
        console.log('Profile Response has been completed.');

        resolve({ request: 'profileUser', message: { 
          status: 'success', 
          data: { user_profile: resp.toObject() }}
        });
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
  addDeviceRequest,
  addDeviceProfilesRequest,
  applicationConfigurationsRequest,
  applicationsListRequest,
  createDeviceKeyRequest,
  createTenant,
  createUser,
  createTenantUser,
  deleteApplicationRequest,
  deviceConfigurationsRequest,
  deleteDeviceRequest,
  devicesListRequest,
  deviceProfilesListRequest,
  enterApplicationRequest,
  enterDeviceRequest,
  getApplicationRequest,
  getMainDashboard,
  loginUserRequest,
  profileUserRequest,
};
//---------------------------------------------------------------------//
//----------------------------COMMON ZONE------------------------------//
//---------------------------------------------------------------------//
function deviceProfiles(tenantId) {
  let devProfsArr = [{ name: "LoRaWAN 1.0.0 Profile", id: tenantId, macVersion: common_common_pb.MacVersion.LORAWAN_1_0_0 }, 
    { name: "LoRaWAN 1.0.1 Profile", id: tenantId, macVersion: common_common_pb.MacVersion.LORAWAN_1_0_1 },
    { name: "LoRaWAN 1.0.2 Profile", id: tenantId, macVersion: common_common_pb.MacVersion.LORAWAN_1_0_2 },
    { name: "LoRaWAN 1.0.3 Profile", id: tenantId, macVersion: common_common_pb.MacVersion.LORAWAN_1_0_3 },
    { name: "LoRaWAN 1.0.4 Profile", id: tenantId, macVersion: common_common_pb.MacVersion.LORAWAN_1_0_4 },
    { name: "LoRaWAN 1.1.0 Profile", id: tenantId, macVersion: common_common_pb.MacVersion.LORAWAN_1_1_0 }
  ];

  return devProfsArr;
}
//---------------------------------------------------------------------//
