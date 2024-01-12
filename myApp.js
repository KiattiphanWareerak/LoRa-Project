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
async function myApp(values) {
    let resp;

    if ( values.status === 'login' ) {
        try {
            resp = await dataBaseServices.loginRequest(values.message);

            if (resp.status === 'loginSuccess') {
              tenant_id = '52f14cd4-c6f1-4fbd-8f87-4025e1d49242';
            //   tenant_id = '51d73e09-c29e-4cb1-9c9c-32b48b815fc6';
              globalTenantId = tenant_id;

              return resp;
            } else {
                return { status: 'loginFailed', data: 'ID or Password incorrect!' };
            }
          } catch (error) {
            console.log(error);
          }
    } else if (values.status === 'displayApplications') {
        try {
            resp = await chirpStackServices.applicationsAndDeviceTotalCount(globalTenantId);
            // resp = testApiService.applicationsListRequest(globalTenantId);
            let parseResp = resp;
    
            if ( parseResp.status === 'appsListAndDevCountSuccess') {
                return parseResp;
            }
        } catch (error) {
            console.log(error);
        }
    } else if (values.status === 'displayRefreshDevices') {
        try {
            let data = { app_id: globalAppId, app_name: globalAppName };

            resp = await chirpStackServices.devicesListRequest(data);
            // resp = testApiService.devicesListRequest(data);
            let parseResp = resp;
        
            if ( parseResp.status === 'devsListSuccess') {
                return parseResp;
            }
        } catch (error) {
            console.log(error);
        }
    } else if (values.status === 'appIdClickRequest') {
        try {
            resp = await chirpStackServices.devicesListRequest(values.message);
            // resp = testApiService.devicesListRequest(values.message);
            let parseResp = resp;
        
            if ( parseResp.status === 'devsListSuccess') {
                globalAppId = values.message.app_id;
                globalAppName = values.message.app_name;
                return parseResp;
            }
        } catch (error) {
            console.log(error);
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
        resp = await chirpStackServices.addApplicationRequest(values.message,
            globalTenantId);
        // resp = testApiService.addApplicationRequest(values.message,
        //     globalTenantId);
        let parseResp = resp;

        if ( parseResp.status === 'addAppReqSuccess') {
            return parseResp;
        }
    } else if (values.status === 'delAppReq') {
        resp = await chirpStackServices.deleteApplicationRequest(values.message,
            globalTenantId);
        let parseResp = resp;

        if ( parseResp.status === 'delAppReqSuccess') {
            return parseResp;
        }
    } else if (values.status === 'addDevReq') {
        resp = await chirpStackServices.addDeviceAndCreateDeviceKey(values.message,
            globalAppId);
        let parseResp = resp;

        if ( parseResp.status === 'createDevKeyReqSuccess') {
            return parseResp;
        }
    } else if (values.status === 'delDevReq') {
        resp = await chirpStackServices.deleteDeviceRequest(values.message);
        let parseResp = resp;

        if ( parseResp.status === 'delDevReqSuccess') {
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