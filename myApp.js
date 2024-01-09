//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
// Set api services
const testApiService = require('./testApiServices.js');
const chirpStackServices = require('./chirpStackServices.js');
const dataBaseServices = require('./dataBaseSevices.js');
//---------------------------------------------------------------------//
//Set values stored
let globalTenantId;
let globalAppId, globalAppName;
let globalDevId, globalDevName;
//---------------------------------------------------------------------//
function myApp(values) {
    let resp;

    if ( values.status === 'login' ) {
        resp = dataBaseServices.loginRequest(values.message);

        if ( resp.status === 'loginSuccess' ) {
            tenant_id = '0000-0000-0000-0001';
            globalTenantId = tenant_id;
            return resp;
        }
    } else if (values.status === 'displayApplications') {
        resp = testApiService.applicationsListRequest(globalTenantId);
        let parseResp = resp;
        
        if ( parseResp.status === 'appsListSuccess') {
            return parseResp;
        }
    } else if (values.status === 'displayRefreshDevices') {
        let data = { app_id: globalAppId, app_name: globalAppName };
        resp = testApiService.devicesListRequest(data);
        let parseResp = resp;

        if ( parseResp.status === 'devsListSuccess') {
            return parseResp;
        }
    } else if (values.status === 'appIdClickRequest') {
        resp = testApiService.devicesListRequest(values.message);
        let parseResp = resp;
    
        if ( parseResp.status === 'devsListSuccess') {
            globalAppId = values.message.app_id;
            globalAppName = values.message.app_name;
            return parseResp;
        }
    } else if (values.status === 'displayRefreshDashDevice') {
        let data = { message: { dev_id: globalDevId, dev_name: globalDevName},
        app_id: globalAppId, app_name: globalAppName};

        resp = testApiService.dashboardDeviceRequest(data.message, data.app_id, 
            data.app_name);
        let parseResp = resp;

        if ( parseResp.status === 'dashDeviceSuccess') {
            return parseResp;
        }
    } else if (values.status === 'devNameClickRequest') {
        resp = testApiService.dashboardDeviceRequest(values.message,
            globalAppId, globalAppName);
        let parseResp = resp;

        if ( parseResp.status === 'dashDeviceSuccess') {
            globalDevId = values.message.dev_id;
            globalDevName = values.message.dev_name;
            return parseResp;
        }
    } else if (values.status === 'addAppReq') {
        resp = testApiService.addApplicationRequest(values.message,
            globalTenantId);
        let parseResp = resp;

        if ( parseResp.status === 'addAppReqSuccess') {
            return parseResp;
        }
    }
    else {
        return (console.log('Request Error, pls try again.'));
    }
}
//---------------------------------------------------------------------//
module.exports = {
    myApp
};
//---------------------------------------------------------------------//