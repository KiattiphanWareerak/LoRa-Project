const grpc = require("@grpc/grpc-js");
const tenant_grpc = require("@chirpstack/chirpstack-api/api/tenant_grpc_pb");
const tenant_pb = require("@chirpstack/chirpstack-api/api/tenant_pb");
// This must point to the ChirpStack API interface.
const serverChirpStack = "202.28.95.234:8080";
// The API token (can be obtained through the ChirpStack web-interface).
const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6IjViZTdhYjlhLTkyYjMtNDFjMi05MWZkLTJmZWUyZTMyYjkxNCIsInR5cCI6ImtleSJ9.ebiRNuybsq2jBmkO2ecgr4VxHOZi1qpbACxmOvrLpxs";
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