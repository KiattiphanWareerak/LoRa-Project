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

function getDeviceMetricsRequest_to_chripstack() {
  let devEUI = '24c5d9e6325811b8';
  
  const { Timestamp } = require('google-protobuf/google/protobuf/timestamp_pb');
  function getStartOfYear() {
      const startOfYear = new Date();
      startOfYear.setMonth(0); // January (0-based index)
      startOfYear.setDate(1); // First day of the month
      startOfYear.setHours(0, 0, 0, 0); // Midnight
    
      const startOfYearTimestamp = new Timestamp();
      startOfYearTimestamp.fromDate(startOfYear);
    
      return startOfYearTimestamp;
    }
    
  const startTimestamp = getStartOfYear();
  const endTimestamp = new Timestamp();

  // Create a request to get metrices.
  const createReq = new device_pb.GetDeviceMetricsRequest();
  createReq.setDevEui(devEUI);
  createReq.setStart(startTimestamp);
  createReq.setEnd(endTimestamp);
  createReq.setAggregation(Aggregation.MONTH);

  deviceService.getMetrics(createReq, metadata, (err, resp) => {
    if (err !== null) {
      console.log(err);
      return;
    }
    console.log(resp);
    console.log(resp.toObject());
    console.log('Get Metrics Device has been compleled.');
  });
}

getDeviceMetricsRequest_to_chripstack();
/*Not Yet*/