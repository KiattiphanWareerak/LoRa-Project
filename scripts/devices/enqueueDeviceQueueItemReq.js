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

function enqueueDeviceQueueItemRequest_to_chripstack(devEUI) {
  // Create a device queue item.
  const queueDevice = new device_pb.DeviceQueueItem();
  queueDevice.setConfirmed(true);
  queueDevice.setData(Buffer.from("Hello!").toString('base64'));
  queueDevice.setDevEui(devEUI);
  // queueDevice.setExtension();
  // queueDevice.setFCntDown();
  queueDevice.setFPort(1);
  // queueDevice.setId();
  queueDevice.setIsPending();
  // queueDevice.setObject();

  // Create a request to enqueue device queue.
  const createReq = new device_pb.EnqueueDeviceQueueItemRequest();
  createReq.setQueueItem(queueDevice);

  deviceService.enqueue(createReq, metadata, (err, resp) => {
    if (err !== null) {
      console.log(err);
      return;
    }
    console.log(resp.toObject());
    console.log('Enqueue Device has been compleled.');
  });
}

enqueueDeviceQueueItemRequest_to_chripstack("");