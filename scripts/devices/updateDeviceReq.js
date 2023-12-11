const grpc = require("@grpc/grpc-js");
const device_grpc = require("@chirpstack/chirpstack-api/api/device_grpc_pb");
const device_pb = require("@chirpstack/chirpstack-api/api/device_pb");
// This must point to the ChirpStack API interface.
const serverChirpStack = "192.168.50.54:8080";
// The API token (can be obtained through the ChirpStack web-interface).
const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjJmZjMzODRiLWZjYzgtNDE5OS1hNmY0LWVjYWEwNzUyMmE5NiIsInR5cCI6ImtleSJ9.HcJsMD_Vv-oPUFHqRIDo_xPlJOPPzNeNxSsixNXTRX0";
// Create the client for the DeviceService.
const deviceService = new device_grpc.DeviceServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
);
// Create the Metadata object.
const metadata = new grpc.Metadata();
metadata.set("authorization", "Bearer " + apiToken);

function updateDeviceRequest_to_chirpstack() {
  let devEUI = '';

  const updateDevice = new device_pb.Device();
  updateDevice.setApplicationId("c735b5b4-8130-454b-abf5-26021f5327f0");
  updateDevice.setDescription("");
  updateDevice.setDevEui(devEUI);
  updateDevice.setDeviceProfileId("74085133-a46e-4ce8-b175-4d1b2d2545f9");
  // updateDevice.setExtension();
  updateDevice.setIsDisabled(false);
  // updateDevice.setJoinEui();
  updateDevice.setName("test");
  updateDevice.setSkipFcntCheck(false);

  // Create a request to add a device key.
  const createReq = new device_pb.UpdateDeviceRequest();
  createReq.setDevice(updateDevice);

  deviceService.update(createReq, metadata, (err, resp) => {
    if (err !== null) {
      console.log(err);
      return;
    }
    console.log(resp.toObject());
    console.log('Device has been updated [device: ' + devEUI + ']');
  });
}

updateDeviceRequest_to_chirpstack();