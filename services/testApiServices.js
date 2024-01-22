//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
//---------------------------------------------------------------------//
function addApplicationRequest(values, tenantID) {
  console.log('test from addApp api');
  console.log(values, tenantID);

  let respReq = { status: 'addAppReqSuccess' };

  return respReq;
}
//---------------------------------------------------------------------//
function applicationsListRequest(values) {
    console.log('test from appsList api');
    console.log(values);

    let respAppsList = { status: 'appsListSuccess', tenant_id: values,
    message: [
        { app_name: "my-app-1", app_id: "c735b5b4-8130-454b-abf5-26021f532705", app_num: 1 },
        { app_name: "my-app-2", app_id: "c735b5b4-8130-454b-abf5-26021f535515", app_num: 2 }
        ]};

    return respAppsList
}
//---------------------------------------------------------------------//
function devicesListRequest(values) {
    console.log('test from devsList api');
    console.log(values);

    let respDevsList = { status: 'devsListSuccess', app_id: values.app_id,
    app_name: values.app_name, message: [
        { dev_name: "MAX-01", dev_id: "c735b5b4-8130-454b-abf5-26021f532725", last_seen: "2023-10-30T12:00:53.000Z" },
        { dev_name: "MAX-02", dev_id: "c735b5b4-8130-454b-abf5-26021f535555", last_seen: "2023-10-30T12:00:53.000Z" }
    ]};
    
    return respDevsList
}
//---------------------------------------------------------------------//
//---------------------------------------------------------------------//
function dashboardDeviceRequest(values, appId, appName) {
    console.log('test from dashDev api');
    console.log(values, appId, appName);
    
    let respDashDevice = { request: 'enterDevId', message: { 
      status: 'success', 
      data: { app_id: appId, app_name: appName, dev_id: values.dev_id, dev_name: values.dev_name, 
        dev_dash: [{ packets: "20", rssi: "-50", snr: "55" },
        { packets: "25", resi: "-25", snr: "55" }]
    }}};

  return respDashDevice;
}
//---------------------------------------------------------------------//
module.exports = {
  addApplicationRequest,
  applicationsListRequest,
  devicesListRequest,
  dashboardDeviceRequest
};
//---------------------------------------------------------------------//