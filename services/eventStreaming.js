const grpc = require("@grpc/grpc-js");
const internal_grpc = require("@chirpstack/chirpstack-api/api/internal_grpc_pb");
const internal_pb = require("@chirpstack/chirpstack-api/api/internal_pb");

// This must point to the ChirpStack API interface.
const serverChirpStack = "202.28.95.234:8080";

// Create the client for the Service.
const internalService = new internal_grpc.InternalServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
);

const netWorkApiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6Ijc3M2Y5OGQwLTk5YTMtNDVjMS1hY2JhLThhOTQzYzdiODFiZiIsInR5cCI6ImtleSJ9.FiCRWLwVlG9mm5_KqUm52afDzMZRJ5qc4jQJz4waxZI";
try {
  // Create the Metadata object.
  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Bearer " + netWorkApiToken);

  return new Promise((resolve, reject) => {
    // Create a request to create application.
    const createReq = new internal_pb.StreamDeviceEventsRequest();
    createReq.
    createReq.setDevEui("24c5d9e6325820f4");

    internalService.streamDeviceEvents(createReq, metadata, (err, resp) => {
      if (err !== null) {
        console.log(err.details);
        return;
      }
      console.log('Stream device events has been compleled.');

      console.log(resp);
    });
  });
} catch (error) {
  console.error(error);
}