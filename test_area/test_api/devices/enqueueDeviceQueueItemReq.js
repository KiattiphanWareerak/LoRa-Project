const grpc = require("@grpc/grpc-js");
const device_grpc = require("@chirpstack/chirpstack-api/api/device_grpc_pb");
const device_pb = require("@chirpstack/chirpstack-api/api/device_pb");
// This must point to the ChirpStack API interface.
const serverChirpStack = "202.28.95.234:8080";
// The API token (can be obtained through the ChirpStack web-interface).
const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjQyOGM5OWQwLWU3MjEtNDFkYy04OWJlLTg1ZWM4YjUwOTExOCIsInR5cCI6ImtleSJ9.OwZHbhj_KX2j0Pc6ekIb9RS9gpFO2Xbp8DupeZR7tpA";
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
  queueDevice.setData(Buffer.from("Hello").toString('base64'));
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

    data = resp.toObject();
    console.log(data);
    console.log('Enqueue Device has been compleled.');
  });
}

enqueueDeviceQueueItemRequest_to_chripstack("1aec628d153c9ba1");