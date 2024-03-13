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
async function addApplicationRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    // Create a new application.
    const newApplication = new application_pb.Application();
    newApplication.setName(message.app_name);
    newApplication.setDescription(message.app_desc);
    newApplication.setTenantId(message.tenant_id);

    return new Promise((resolve, reject) => {
      // Create a request to create application.
      const createReq = new application_pb.CreateApplicationRequest();
      createReq.setApplication(newApplication);

      applicationService.create(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve('failed');
          return;
        }
        console.log('New an application has been created.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.error(error);
  }
}
//---------------------------------------------------------------------//
async function addDeviceRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    return new Promise((resolve, reject) => {
      // Create a new device.
      const newDevice = new device_pb.Device();
      newDevice.setApplicationId(message.app_id);
      newDevice.setName(message.dev_name);
      newDevice.setDevEui(message.dev_id);
      newDevice.setDeviceProfileId(message.dev_devProfId);
      newDevice.setDescription("");
      newDevice.setIsDisabled(false);
      newDevice.setSkipFcntCheck(false);

      // Create a request to add a new device.
      const createReq = new device_pb.CreateDeviceRequest();
      createReq.setDevice(newDevice);

      deviceService.create(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve('failed');
          return;
        }
        console.log('New device has been created.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function addDeviceKeyRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    return new Promise((resolve, reject) => {
      // Create a device key (OTAA Key).
      const deviceKey = new device_pb.DeviceKeys();
      deviceKey.setDevEui(message.dev_id);
      deviceKey.setNwkKey(message.dev_key); // LoRaWAN 1.0.x
      deviceKey.setAppKey(message.dev_key); // LoRaWAN 1.1.x

      // Create a request to add a device key.
      const createReq = new device_pb.CreateDeviceKeysRequest();
      createReq.setDeviceKeys(deviceKey);

      deviceService.createKeys(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve('failed');
          return;
        }
        console.log('App Key (OTAA) has been created.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function addDeviceProfileRequest(message, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken.rows[0].cs_token);

    let devProfs = deviceProfiles(message.tenant_id);
    let codec = `function decodeUplink(input) {
        const bytes = input.bytes;
        const data = String.fromCharCode(...bytes);

        return {
          data: {
            uplink_decoder: data,
          },
        };
      };
      function encodeDownlink(input) {
            const bytes = input.bytes;
            const data = String.fromCharCode(...bytes);
        
            return {
              data: {
                downlink_decoder: data,
              },
            };
      };`;

    let count = 0;
    return new Promise((resolve, reject) => {
      for (const devProf of devProfs) {
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
        newDevProfs.setPayloadCodecRuntime(2);
        newDevProfs.setPayloadCodecScript(codec);
        newDevProfs.setIsRelay(false);
        newDevProfs.setIsRelayEd(false);
        newDevProfs.setAutoDetectMeasurements(true);

        // Create a request to add a new device.
        const createReq = new device_profile_pb.CreateDeviceProfileRequest();
        createReq.setDeviceProfile(newDevProfs);

        deviceProfileService.create(createReq, metadata, (err, resp) => {
          if (err !== null) {
            console.log(err);
            resolve({ status: 'failed' });
            return;
          }
          console.log('New device profile has been created: ', devProf.name);
          count++;

          if (count === devProfs.length) {
            resolve('success');
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function addUserInTenantRequest(message, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken.rows[0].cs_token);

    return new Promise((resolve, reject) => {
      // Create a tenant user.
      const tenantUser = new tenant_pb.TenantUser();
      tenantUser.setTenantId(message.tenant_id);
      tenantUser.setUserId(message.user_id);
      tenantUser.setIsAdmin(false);
      tenantUser.setIsDeviceAdmin(true);
      tenantUser.setIsGatewayAdmin(true);
      tenantUser.setEmail(message.user_em);

      // Create a request to create a tenant user.
      const createReq = new tenant_pb.AddTenantUserRequest();
      createReq.setTenantUser(tenantUser);

      tenantService.addUser(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve('failed');
          return;
        }
        console.log('Creaate a tenant user has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function createInfluxDbIntegrationRequest(appId, orgName, bucketName, csToken, iflxToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + csToken);

    // Create a new application.
    const influxDb = new application_pb.InfluxDbIntegration();
    influxDb.setApplicationId(appId);
    influxDb.setVersion(application_pb.InfluxDbVersion.INFLUXDB_2);
    influxDb.setEndpoint('http://202.28.95.234:8086/api/v2/write');
    influxDb.setOrganization(orgName);
    influxDb.setBucket(bucketName);
    influxDb.setToken(iflxToken);

    return new Promise((resolve, reject) => {
      // Create a request to create intg InfluxDB.
      const createReq = new application_pb.CreateInfluxDbIntegrationRequest();
      createReq.setIntegration(influxDb);

      applicationService.createInfluxDbIntegration(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve('failed');
          return;
        }
        console.log('Integration fluxDb has been created.');

        resolve('success');
      });
    });
  } catch (error) {
    console.error(error);
  }
}
//---------------------------------------------------------------------//
async function createTenantRequest(message, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken.rows[0].cs_token);

    return new Promise((resolve, reject) => {
      // Create a tenant.
      const newTenant = new tenant_pb.Tenant();
      newTenant.setName(message.user_un);
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
          console.log(err);
          resolve('failed');
          return;
        }
        console.log('Creaate a tenant has been completed.');

        resolve({
          tenant_id: resp.toObject().id,
          user_id: message.user_id,
          user_em: message.user_em,
          user_un: message.user_un
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function createUserRequest(message, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken.rows[0].cs_token);

    return new Promise((resolve, reject) => {
      // Create a tenant for user
      const userTenant = new user_pb.User();
      userTenant.setEmail(message.user_em);
      userTenant.setIsAdmin(false);
      userTenant.setIsActive(true);

      // Create a user to use an application.
      const createReq = new user_pb.CreateUserRequest();
      createReq.setUser(userTenant);
      createReq.setPassword(message.user_pw);

      userService.create(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve('failed');
          return;
        }
        console.log('Creaate a user has been completed.');

        resolve({
          user_un: message.user_un,
          user_id: resp.toObject().id,
          user_em: message.user_em
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function deleteApplicationRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    return new Promise(async (resolve, reject) => {
      if (message.del_apps === undefined || message.del_apps === null || message.del_apps === 0 || message.del_apps === ''
        || Number.isNaN(message.del_apps) || (Array.isArray(message.del_apps) && message.del_apps.length === 0)) {
        resolve('failed');
        return;
      }

      let count = 0;
      for (const appID of message.del_apps) {
        // Create a request to delete an application.
        const createReq = new application_pb.DeleteApplicationRequest();
        createReq.setId(appID.app_id);

        applicationService.delete(createReq, metadata, (err, resp) => {
          if (err !== null) {
            console.log(err);
            resolve('failed');
            return;
          }
          console.log('Delete an application has been completed.');
          count++;

          if (count === message.del_apps.length) {
            resolve('success');
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
}
//---------------------------------------------------------------------//
async function deleteDeviceRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    return new Promise((resolve, reject) => {
      if (message.del_devs === undefined || message.del_devs === null || message.del_devs === 0 || message.del_devs === ''
        || Number.isNaN(message.del_devs) || (Array.isArray(message.del_devs) && message.del_devs.length === 0)) {
        resolve('failed');
        return;
      }

      let count = 0;
      for (const value of message.del_devs) {
        // Create a request to delete a device.
        const createReq = new device_pb.DeleteDeviceRequest();
        createReq.setDevEui(value.dev_id);

        deviceService.delete(createReq, metadata, (err, resp) => {
          if (err !== null) {
            console.log(err);
            resolve('failed');
            return;
          }
          console.log('Device has been deleted.');
          count++;

          if (count === message.del_devs.length) {
            resolve('success');
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function enqueueDeviceRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    return new Promise((resolve, reject) => {
      // Create a queue.
      const queue = new device_pb.DeviceQueueItem();
      queue.setDevEui(message.dev_id);
      queue.setConfirmed(message.eq_cnf);
      queue.setFPort(message.eq_fport);
      queue.setIsEncrypted(message.eq_isEncry);
      queue.setData(Buffer.from(message.eq_data).toString('base64'));
      // Create a request to enqueue.
      const createReq = new device_pb.EnqueueDeviceQueueItemRequest();
      createReq.setQueueItem(queue);

      deviceService.enqueue(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve('failed');
          return;
        }
        console.log('enqueue has been completed. ', resp.getId());

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function flushQueueRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    return new Promise((resolve, reject) => {
      // Create a request to enqueue.
      const createReq = new device_pb.FlushDeviceQueueRequest();
      createReq.setDevEui(message.dev_id);

      deviceService.flushQueue(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve('failed');
          return;
        }
        console.log('flushQueueDev has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getApplicationRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    const createReq = new application_pb.GetApplicationRequest();
    createReq.setId(message.app_id);

    return new Promise((resolve, reject) => {
      applicationService.get(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve({ status: 'failed' });
          return;
        }
        console.log('Get Application request has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
//---------------------------------------------------------------------//
async function getApplicationListRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    const createReq = new application_pb.ListApplicationsRequest();
    createReq.setLimit(99);
    createReq.setTenantId(message.tenant_id);

    return new Promise((resolve, reject) => {
      applicationService.list(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve({ status: 'failed' });
          return;
        }
        console.log('Applications list request has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
//---------------------------------------------------------------------//
async function getDeviceRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    return new Promise((resolve, reject) => {
      // Create a request to get device.
      const createReq = new device_pb.GetDeviceRequest();
      createReq.setDevEui(message.dev_id);

      deviceService.get(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve('failed');
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
async function getDeviceEventRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    let dataEvents = {
      dev_events: [],
    };

    return new Promise((resolve, reject) => {
      const createReq = new internal_pb.StreamDeviceEventsRequest();
      createReq.setDevEui(message.dev_id);

      console.log("Streaming device events for:", message.dev_id);

      const stream = internalService.streamDeviceEvents(createReq, metadata);

      stream.on("data", (response) => {
        // console.log("Received device event:", response);

        dataEvents.dev_events.push(response);
      });

      stream.on("error", (error) => {
        console.error("Error streaming device events:", error.details);
      });

      const timeoutId = setTimeout(() => {
        console.log("Timeout reached, stopping stream.");
        stream.cancel();
      }, 500);

      stream.on("end", () => {
        clearTimeout(timeoutId);
        if (!dataEvents.dev_events) {
          resolve('failed');
        }
        console.log("Device event stream ended.");

        resolve(dataEvents.dev_events);
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getDeviceFrameRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    let dataFrames = {
      dev_frames: [],
    };

    return new Promise((resolve, reject) => {
      const createReq = new internal_pb.StreamDeviceFramesRequest();
      createReq.setDevEui(message.dev_id);

      console.log("Streaming device frames for:", message.dev_id);

      const stream = internalService.streamDeviceFrames(createReq, metadata);

      stream.on("data", (response) => {
        // console.log("Received device frame:", response);

        dataFrames.dev_frames.push(response);
      });

      stream.on("error", (error) => {
        console.error("Error streaming device frames:", error.details);
      });

      const timeoutId = setTimeout(() => {
        console.log("Timeout reached, stopping stream.");
        stream.cancel();
      }, 500);

      stream.on("end", () => {
        clearTimeout(timeoutId);
        if (!dataFrames.dev_frames) {
          resolve('failed');
        }
        console.log("Device frame stream ended.");

        resolve(dataFrames.dev_frames);
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getDeviceKeyRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    const createReq = new device_pb.GetDeviceKeysRequest();
    createReq.setDevEui(message.dev_id);

    return new Promise((resolve, reject) => {
      deviceService.getKeys(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve({ status: 'failed' });
          return;
        }
        console.log('Get Device Key has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
//---------------------------------------------------------------------//
async function getDeviceProfileListRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    const createReq = new device_profile_pb.ListDeviceProfilesRequest();
    createReq.setLimit(99);
    createReq.setTenantId(message.tenant_id);

    return new Promise((resolve, reject) => {
      deviceProfileService.list(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve({ status: 'failed' });
          return;
        }
        console.log('Device profiles list request has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
//---------------------------------------------------------------------//
async function getDeviceListRequest(appId, apiToken) {
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
          console.log(err);
          resolve({ status: 'failed', });
          return;
        }
        console.log('Devices list request has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getDeviceSummaryRequest(message, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a request to list devices
      const createReq = new internal_pb.GetDevicesSummaryRequest();
      createReq.setTenantId(message.tenant_id);

      internalService.getDevicesSummary(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve({ status: 'failed' });
          return;
        }
        console.log('Devices summary request has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getGatewaySummaryRequest(tenantId, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken.rows[0].cs_token);

    return new Promise((resolve, reject) => {
      // Create a request to list devices
      const createReq = new internal_pb.GetGatewaysSummaryRequest();
      createReq.setTenantId(tenantId.rows[0].tenant_id);

      internalService.getGatewaysSummary(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve({ status: 'failed' });
          return;
        }
        console.log('Gateway summary request has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getGatewayListRequest(tenantId, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken.rows[0].cs_token);

    return new Promise((resolve, reject) => {
      // Create a request to list devices
      const createReq = new gateway_pb.ListGatewaysRequest();
      createReq.setLimit(99);
      createReq.setTenantId(tenantId.rows[0].tenant_id);

      gatewayService.list(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve({ status: 'failed' });
          return;
        }
        console.log('Gateway list request has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getLinkMetricRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

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

      createReq.setDevEui(message.dev_id);

      if (message.timeAgo === "1y") {
        createReq.setStart(oneYearAgoTimestamp);
      } else if (message.timeAgo === "1m") {
        createReq.setStart(oneMonthAgoTimestamp);
      } else if (message.timeAgo === "1d") {
        createReq.setStart(twentyFourHoursAgoTimestamp);
      }
      createReq.setEnd(currentTimestamp);

      if (message.aggregation === "DAY") {
        createReq.setAggregation(common_common_pb.Aggregation.DAY);
      } else if (message.aggregation === "HOUR") {
        createReq.setAggregation(common_common_pb.Aggregation.HOUR);
      } else if (message.aggregation === "MONTH") {
        createReq.setAggregation(common_common_pb.Aggregation.MONTH);
      }

      deviceService.getLinkMetrics(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve('failed');
          return;
        }
        console.log('Get Link Metrics has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getQueueItemRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    return new Promise((resolve, reject) => {
      // Create a request to get queue.
      const createReq = new device_pb.GetDeviceQueueItemsRequest();
      createReq.setDevEui(message.dev_id);

      deviceService.getQueue(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve('failed');
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
async function getUserProfileRequest(apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken.user_token);

    return new Promise((resolve, reject) => {
      // Create a empty.
      const createReq = new google_protobuf_empty_pb.Empty();

      internalService.profile(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve({ user: { id: 'error' } });
          return;
        }
        console.log('Profile Response has been completed.\n', resp.toObject());

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getUserInTenantRequest(tenantId, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken.rows[0].cs_token);

    return new Promise((resolve, reject) => {
      // Create a request to list devices
      const createReq = new tenant_pb.ListTenantUsersRequest();
      createReq.setTenantId(tenantId.id);
      createReq.setLimit(999);

      tenantService.listUsers(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve({ status: 'error' });
          return;
        }
        console.log('Get user in tenant request has been completed.\n', resp.toObject());

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getTenantProfileRequest(tenantId, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken);

    return new Promise((resolve, reject) => {
      // Create a request to list devices
      const createReq = new tenant_pb.GetTenantRequest();
      createReq.setId(tenantId);

      tenantService.get(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve(err.details);
          return;
        }
        console.log('Get tenant profile request has been completed.\n', resp.toObject());

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getTenantsListRequest(apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken.rows[0].cs_token);

    return new Promise((resolve, reject) => {
      // Create a request to list devices
      const createReq = new tenant_pb.ListTenantsRequest();
      createReq.setLimit(999);

      tenantService.list(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve({ status: 'failed' });
          return;
        }
        console.log('Tenants list request has been completed.\n', resp.toObject());

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getUserListRequest(apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken.rows[0].cs_token);

    return new Promise((resolve, reject) => {
      // Create a request to list devices
      const createReq = new user_pb.ListUsersRequest();
      createReq.setLimit(999);

      userService.list(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve({ status: 'failed' });
          return;
        }
        console.log('User list request has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function postLoginUserRequest(message, apiToken) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + apiToken.rows[0].cs_token);

    return new Promise((resolve, reject) => {
      // Create a request to get queue.
      const createReq = new internal_pb.LoginRequest();
      createReq.setEmail(message.user_em);
      createReq.setPassword(message.user_pw);

      internalService.login(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve({ jwt: 'error' });
          return;
        }
        console.log('Login has been completed.\n', resp.toObject());

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function updateApplicationRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    // Create an application.
    const updateApplication = new application_pb.Application();
    updateApplication.setId(message.app_id);
    updateApplication.setName(message.app_name);
    updateApplication.setDescription(message.app_desc);
    updateApplication.setTenantId(message.tenant_id);

    const createReq = new application_pb.UpdateApplicationRequest();
    createReq.setApplication(updateApplication);

    return new Promise((resolve, reject) => {
      applicationService.update(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve('failed');
          return;
        }
        console.log('Update application request has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}
//---------------------------------------------------------------------//
async function updateDeviceRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    return new Promise((resolve, reject) => {
      // Create a device to updated.
      const deviceUpdate = new device_pb.Device();
      deviceUpdate.setApplicationId(message.app_id);
      deviceUpdate.setName(message.dev_name);
      deviceUpdate.setDevEui(message.dev_id);
      deviceUpdate.setJoinEui(message.dev_joinEui);
      deviceUpdate.setDeviceProfileId(message.dev_devProfId);
      deviceUpdate.setDescription(message.dev_desc);
      deviceUpdate.setIsDisabled(message.dev_IsDis);
      deviceUpdate.setSkipFcntCheck(message.dev_SkFntC);

      // Create a request to add a new device.
      const createReq = new device_pb.UpdateDeviceRequest();
      createReq.setDevice(deviceUpdate);

      deviceService.update(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve('failed');
          return;
        }
        console.log('Update Device has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function updateDeviceKeyRequest(message) {
  try {
    // Create the Metadata object.
    const metadata = new grpc.Metadata();
    metadata.set("authorization", "Bearer " + message.user_token);

    return new Promise((resolve, reject) => {
      // Update a device key (OTAA Key).
      const deviceKeyUpdate = new device_pb.DeviceKeys();
      deviceKeyUpdate.setDevEui(message.dev_id);
      deviceKeyUpdate.setNwkKey(message.dev_key); // LoRaWAN 1.0.x
      deviceKeyUpdate.setAppKey(message.dev_key); // LoRaWAN 1.1.x

      // Create a request to add a device key.
      const createReq = new device_pb.UpdateDeviceKeysRequest();
      createReq.setDeviceKeys(deviceKeyUpdate);

      deviceService.updateKeys(createReq, metadata, (err, resp) => {
        if (err !== null) {
          console.log(err);
          resolve('failed');
          return;
        }
        console.log('Update Device Key has been completed.');

        resolve(resp.toObject());
      });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
module.exports = {
  addApplicationRequest,
  addDeviceRequest,
  addDeviceKeyRequest,
  addDeviceProfileRequest,
  addUserInTenantRequest,
  createInfluxDbIntegrationRequest,
  createTenantRequest,
  createUserRequest,
  deleteApplicationRequest,
  deleteDeviceRequest,
  enqueueDeviceRequest,
  flushQueueRequest,
  getApplicationRequest,
  getApplicationListRequest,
  getDeviceProfileListRequest,
  getDeviceRequest,
  getDeviceEventRequest,
  getDeviceFrameRequest,
  getDeviceKeyRequest,
  getDeviceListRequest,
  getDeviceSummaryRequest,
  getGatewaySummaryRequest,
  getGatewayListRequest,
  getLinkMetricRequest,
  getQueueItemRequest,
  getUserProfileRequest,
  getUserInTenantRequest,
  getTenantProfileRequest,
  getTenantsListRequest,
  getUserListRequest,
  postLoginUserRequest,
  updateApplicationRequest,
  updateDeviceRequest,
  updateDeviceKeyRequest,
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
