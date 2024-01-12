const grpc = require("@grpc/grpc-js");
const device_grpc = require("@chirpstack/chirpstack-api/api/device_grpc_pb");
const device_pb = require("@chirpstack/chirpstack-api/api/device_pb");
const common_pb = require("@chirpstack/chirpstack-api/common/common_pb");
const google_protobuf_timestamp_pb = require("google-protobuf/google/protobuf/timestamp_pb");
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

function getDeviceLinkMetricsRequest_to_chirpstack() {
  let devEUI = '24c5d9e6325811b8';

  const startTimestamp = new google_protobuf_timestamp_pb.Timestamp();
  startTimestamp.setSeconds(/* ระบุเวลาในรูปแบบ UNIX timestamp */);
  startTimestamp.setNanos(0);

  const endTimestamp = new google_protobuf_timestamp_pb.Timestamp();
  endTimestamp.setSeconds(/* ระบุเวลาในรูปแบบ UNIX timestamp */);
  endTimestamp.setNanos(0);

  // ตัวอย่างเวลาในรูปแบบ UNIX timestamp สำหรับวันที่ 6 มิถุนายน 2023
  const startUnixTimestamp = Math.floor(new Date('2023-09-09T00:00:00Z').getTime() / 1000);

  // ตัวอย่างเวลาในรูปแบบ UNIX timestamp สำหรับปัจจุบัน
  const endUnixTimestamp = Math.floor(Date.now() / 1000);

  startTimestamp.setSeconds(startUnixTimestamp);
  endTimestamp.setSeconds(endUnixTimestamp);

  // Create a request to get device link metrics.
  const createReq = new device_pb.GetDeviceLinkMetricsRequest();
  createReq.setDevEui(devEUI);
  createReq.setStart(startTimestamp);
  createReq.setEnd(endTimestamp);
  createReq.setAggregation(common_pb.Aggregation.MONTH);

  deviceService.getLinkMetrics(createReq, metadata, (err, resp) => {
    if (err !== null) {
      console.log(err);
      return;
    }
    data = resp.toObject();
    console.log(data);
    console.log('Get Metrics Device has been compleled.');
  });
}

getDeviceLinkMetricsRequest_to_chirpstack();
/*Not Yet*/