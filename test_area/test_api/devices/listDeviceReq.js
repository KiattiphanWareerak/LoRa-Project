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

function listDevicesRequest_to_chripstack(appID) {
    // Create a request to list devices
    const createReq = new device_pb.ListDevicesRequest();
    createReq.setLimit(99);
    createReq.setApplicationId(appID); //Application ID of User

    deviceService.list(createReq, metadata, (err, resp) => {
        if (err !== null) {
            console.log(err);
            return;
        }
        console.log(resp);

        let devices = resp.array[1]; //list devices at index 1
        console.log(devices);

        for (const device of devices) {
            const devEUI = device[0]; // DevEUI at index 0
            const deviceName = device[4]; // Device name at index 4

            console.log("DevEUI:", devEUI);
            console.log("Device Name:", deviceName);
        }
    });
}

listDevicesRequest_to_chripstack("3d13c146-4226-4a2a-9462-3011a703c50b");