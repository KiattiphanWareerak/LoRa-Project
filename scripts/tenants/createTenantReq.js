const grpc = require("@grpc/grpc-js");
const tenant_grpc = require("@chirpstack/chirpstack-api/api/tenant_grpc_pb");
const tenant_pb = require("@chirpstack/chirpstack-api/api/tenant_pb");
// This must point to the ChirpStack API interface.
const serverChirpStack = "192.168.50.54:8080";
// The API token (can be obtained through the ChirpStack web-interface).
const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6ImUyMTVhYTBlLTc1MjktNDkzMi05NDZjLWUyZmE1Mzc0MzM1YSIsInR5cCI6ImtleSJ9.pJuZ2xkxT6ItsQ3nTROFlRTVIBf4nVzlX6BrcWu-Gq4";
// Create the client for the DeviceService.
const tenantService = new tenant_grpc.TenantServiceClient(
  serverChirpStack,
  grpc.credentials.createInsecure(),
);
// Create the Metadata object.
const metadata = new grpc.Metadata();
metadata.set("authorization", "Bearer " + apiToken);

function createTenantRequest_to_chirpstack(tenantOj) {
    // Create a tenant.
    const newTenant = new tenant_pb.Tenant();
    newTenant.setName(tenantOj.name);
    newTenant.setDescription(tenantOj.description);
    newTenant.setCanHaveGateways(tenantOj.canHaveGateways);
    newTenant.setPrivateGatewaysUp(tenantOj.privateGatewaysUp);
    newTenant.setPrivateGatewaysDown(tenantOj.privateGatewaysDown);
    newTenant.setMaxGatewayCount(tenantOj.maxGatewayCount);
    newTenant.setMaxDeviceCount(tenantOj.maxDeviceCount);

    // Create a request to create a tenant.
    const createReq = new tenant_pb.CreateTenantRequest();
    createReq.setTenant(newTenant);

    tenantService.create(createReq, metadata, (err, resp) => {
    if (err !== null) {
        console.log(err);
        return;
    }
    console.log('Creaate a tenant has been completed.\n' + 
    "New Tenant ID: " + resp);
    });
}

let tenantOj = {
    name: "TenantDemo",
    description: "Input the user email",
    canHaveGateways: true,
    privateGatewaysUp: false,
    privateGatewaysDown: false,
    maxGatewayCount: 0, // 0 = unlimited
    maxDeviceCount: 0, // 0 = unlimited
  };
createTenantRequest_to_chirpstack(tenantOj);