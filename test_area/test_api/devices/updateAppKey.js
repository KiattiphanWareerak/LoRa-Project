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

function updateDeviceKeyRequest_to_chripstack(devEUI, devKey) {
    // Update a device key (OTAA).
    const deviceKey = new device_pb.DeviceKeys();
    deviceKey.setDevEui(devEUI);
    deviceKey.setNwkKey(devKey); // LoRaWAN 1.0.x
    // deviceKey.setAppKey(devKey); // LoRaWAN 1.1.x
    
    // Create a request to update a device key.
    const createReq = new device_pb.UpdateDeviceKeysRequest();
    createReq.setDeviceKeys(deviceKey);
    
    deviceService.updateKeys(createReq, metadata, (err, resp) => {
    if (err !== null) {
        console.log(err);
        return;
    }
    console.log('App Key (OTAA) has been updated.');
    });
}

updateDeviceKeyRequest_to_chripstack("", "");