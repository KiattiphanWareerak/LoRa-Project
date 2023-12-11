const grpc = require("@grpc/grpc-js");
const application_grpc = require("@chirpstack/chirpstack-api/api/application_grpc_pb");
const application_pb = require("@chirpstack/chirpstack-api/api/application_pb");
// This must point to the ChirpStack API interface.
const serverChirpStack = "192.168.50.54:8080";
// The API token (can be obtained through the ChirpStack web-interface).
const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjJmZjMzODRiLWZjYzgtNDE5OS1hNmY0LWVjYWEwNzUyMmE5NiIsInR5cCI6ImtleSJ9.HcJsMD_Vv-oPUFHqRIDo_xPlJOPPzNeNxSsixNXTRX0";
// Create the client for the DeviceService.
const applicationService = new application_grpc.ApplicationServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
);
// Create the Metadata object.
const metadata = new grpc.Metadata();
metadata.set("authorization", "Bearer " + apiToken);

function listApplicationsRequest_to_chirpstack(tenantID) {
    // Create a request to list applications.
    const createReq = new application_pb.ListApplicationsRequest();
    createReq.setLimit(99);
    // createReq.setOffset();
    createReq.setTenantId(tenantID);

    applicationService.list(createReq, metadata, (err, resp) => {
    if (err !== null) {
        console.log(err);
        return;
    }
    console.log('list applications has been completed.\n' + 
    resp.toObject());
    });
}

listApplicationsRequest_to_chirpstack("");