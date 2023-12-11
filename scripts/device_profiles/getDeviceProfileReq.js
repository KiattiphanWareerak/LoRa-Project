const grpc = require("@grpc/grpc-js");
const device_profile_grpc_pb = require("@chirpstack/chirpstack-api/api/device_profile_grpc_pb");
const device_profile_pb = require("@chirpstack/chirpstack-api/api/device_profile_pb");
// This must point to the ChirpStack API interface.
const serverChirpStack = "192.168.50.54:8080";
// The API token (can be obtained through the ChirpStack web-interface).
const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjJmZjMzODRiLWZjYzgtNDE5OS1hNmY0LWVjYWEwNzUyMmE5NiIsInR5cCI6ImtleSJ9.HcJsMD_Vv-oPUFHqRIDo_xPlJOPPzNeNxSsixNXTRX0";
// Create the client for the DeviceService.
const deviceProfileService = new device_profile_grpc_pb.DeviceProfileServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
);
// Create the Metadata object.
const metadata = new grpc.Metadata();
metadata.set("authorization", "Bearer " + apiToken);

function getDeviceProfileRequest_to_chirpstack(devProID) {
    // Create a request to new device profile.
    const createReq = new device_profile_pb.GetDeviceProfileRequest();
    createReq.setId(devProID);

    deviceProfileService.get(createReq, metadata, (err, resp) => {
    if (err !== null) {
        console.log(err);
        return;
    }
    console.log('Get Device Profile has been completed.\n' + 
    resp.toObject());
    });
}

getDeviceProfileRequest_to_chirpstack("");