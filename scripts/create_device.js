const grpc = require("@grpc/grpc-js");
const device_grpc = require("@chirpstack/chirpstack-api/api/device_grpc_pb");
const device_pb = require("@chirpstack/chirpstack-api/api/device_pb");

// This must point to the ChirpStack API interface.
const server = "192.168.50.54:8080";

// The API token (can be obtained through the ChirpStack web-interface).
const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjJmZjMzODRiLWZjYzgtNDE5OS1hNmY0LWVjYWEwNzUyMmE5NiIsInR5cCI6ImtleSJ9.HcJsMD_Vv-oPUFHqRIDo_xPlJOPPzNeNxSsixNXTRX0";

// Create the client for the DeviceService.
const deviceService = new device_grpc.DeviceServiceClient(
  server,
  grpc.credentials.createInsecure(),
);

// Create the Metadata object.
const metadata = new grpc.Metadata();
metadata.set("authorization", "Bearer " + apiToken);

// Create a new device.
const newDevice = new device_pb.Device();
newDevice.setDevEui("25c5d9e6325825c6");
newDevice.setName("DeviceBygRPC");
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
  console.log("New device has been created");
//   console.log("New device has been created with ID: " + resp.getId());
});
