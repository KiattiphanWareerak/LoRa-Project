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

const devEui = "24c5d9e6325820f4";
const netWorkApiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6Ijc3M2Y5OGQwLTk5YTMtNDVjMS1hY2JhLThhOTQzYzdiODFiZiIsInR5cCI6ImtleSJ9.FiCRWLwVlG9mm5_KqUm52afDzMZRJ5qc4jQJz4waxZI";

let dataEvents = {
  dev_events: [],
};
let eventCount = 0;
try {
  // Create the Metadata object.
  const metadata = new grpc.Metadata();
  metadata.set("authorization", "Bearer " + netWorkApiToken);

  const streamDeviceEventsRequest = new internal_pb.StreamDeviceEventsRequest();
  streamDeviceEventsRequest.setDevEui(devEui);

  console.log("Streaming device events for:", devEui);

  const stream = internalService.streamDeviceEvents(streamDeviceEventsRequest, metadata);

  stream.on("data", (response) => {
      // console.log("Received device event:", response);
      // Process the device event (e.g., store in database, send notification)

      dataEvents.dev_events.push(response);
      eventCount++;

      // Stop the stream after receiving 10 events
      if (eventCount === 10) {
          stream.cancel();
      }
  });

  stream.on("error", (error) => {
      console.error("Error streaming device events:", error.details);
  });

  stream.on("end", () => {
      console.log("Device event stream ended.");
      console.log(dataEvents.dev_events);
  });
} catch (error) {
  console.error(error);
}