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

    try {
        return new Promise(async (resolve, reject) => {
            if ( values.status === 'login' ) {
                resp = await dataBaseServices.loginRequest(values.message);
                let parseResp = resp;

                if (resp.status === 'loginSuccess') {
                    tenant_id = '52f14cd4-c6f1-4fbd-8f87-4025e1d49242';
                    //   tenant_id = '51d73e09-c29e-4cb1-9c9c-32b48b815fc6';
                    globalTenantId = tenant_id;
                    
                    resolve(parseResp);
                } else {
                    resolve({ status: 'loginFailed', data: 'ID or Password incorrect!' });
                }
            } else if (values.status === 'displayApplications') {
                resp = await chirpStackServices.applicationsAndDeviceTotalCount(globalTenantId);
                // resp = testApiService.applicationsListRequest(globalTenantId);
                let parseResp = resp;
        
                if ( parseResp.status === 'appsListAndDevCountSuccess') {
                    resolve(parseResp);
                }
            } else if (values.status === 'displayRefreshDevices') {
                let data = { app_id: globalAppId, app_name: globalAppName };
                console.log(data);
    
                resp = await chirpStackServices.devicesListRequest(data);
                // resp = testApiService.devicesListRequest(data);
                let parseResp = resp;
            
                if ( parseResp.status === 'devsListSuccess') {
                    resolve(parseResp);
                }
            } else if (values.status === 'appIdClickRequest') {
                resp = await chirpStackServices.devicesListRequest(values.message);
                // resp = testApiService.devicesListRequest(values.message);
                let parseResp = resp;
            
                if ( parseResp.status === 'devsListSuccess') {
                    globalAppId = values.message.app_id;
                    globalAppName = values.message.app_name;
                    resolve(parseResp);
                }
            } else if (values.status === 'displayRefreshDashDevice') {
                let data = { message: { dev_id: globalDevId, dev_name: globalDevName},
                app_id: globalAppId, app_name: globalAppName};
        
                resp = testApiService.dashboardDeviceRequest(data.message, data.app_id, 
                    data.app_name);
                let parseResp = resp;
        
                if ( parseResp.status === 'dashDeviceSuccess') {
                    resolve(parseResp);
                }
            } else if (values.status === 'devNameClickRequest') {
                resp = testApiService.dashboardDeviceRequest(values.message,
                    globalAppId, globalAppName);
                let parseResp = resp;
        
                if ( parseResp.status === 'dashDeviceSuccess') {
                    globalDevId = values.message.dev_id;
                    globalDevName = values.message.dev_name;
                    resolve(parseResp);
                }
            } else if (values.status === 'addAppReq') {
                resp = await chirpStackServices.addApplicationRequest(values.message,
                    globalTenantId);
                // resp = testApiService.addApplicationRequest(values.message,
                //     globalTenantId);
                let parseResp = resp;
        
                if ( parseResp.status === 'addAppReqSuccess') {
                    resolve(parseResp);
                }
            } else if (values.status === 'delAppReq') {
                resp = await chirpStackServices.deleteApplicationRequest(values.message,
                    globalTenantId);
                let parseResp = resp;
        
                if ( parseResp.status === 'delAppReqSuccess') {
                    resolve(parseResp);
                }
            } else if (values.status === 'addDevReq') {
                resp = await chirpStackServices.addDeviceAndCreateDeviceKey(values.message,
                    globalAppId);
                let parseResp = resp;
        
                if ( parseResp.status === 'createDevKeyReqSuccess') {
                    resolve(parseResp);
                }
            } else if (values.status === 'delDevReq') {
                resp = await chirpStackServices.deleteDeviceRequest(values.message);
                let parseResp = resp;
        
                if ( parseResp.status === 'delDevReqSuccess') {
                    resolve(parseResp);
                }
            } else if (values.status === 'appConfigReq') {
                resp = await chirpStackServices.applicationConfigurationsRequest(values.message,
                    globalAppId, globalTenantId);
                let parseResp = resp;
        
                if ( parseResp.status === 'appConfigReqSuccess') {
                    globalAppName = values.message.app_name;
                    resolve(parseResp);
                }
            }
            else {
                return (console.log('Request Error, pls try again.'));
            }
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
module.exports = {
    myApp
};
//---------------------------------------------------------------------//