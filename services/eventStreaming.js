// eventStreaming.js
const grpc = require("@grpc/grpc-js");
const internal_pb = require("@thethingsnetwork/api/v4/internal");

function streamDeviceEvents(devEui, callbackFunc) {
  const internalService = new grpc.Client({
    target: "https://api.thethingsnetwork.org/v4/internal",
  });

  const metadata = new Metadata();
  metadata.set("authorization", "Bearer " + globalApiToken);

  const createReq = new internal_pb.StreamDeviceEventsRequest();
  createReq.setDevEui(devEui);

  let stream;
  return new Promise((resolve, reject) => {
    stream = internalService.streamDeviceEvents(createReq, metadata, (err, resp) => {
      if (err) {
        reject(err);
        return;
      }
      callbackFunc(resp);
    });
    resolve(stream);
  });
}

module.exports = {
  streamDeviceEvents,
};
