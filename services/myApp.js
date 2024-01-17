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
    try {
        return new Promise(async (resolve, reject) => {
            if ( values.request === 'login' ) {
                const resp = await dataBaseServices.loginRequest(values.message.data);

                if ( resp.message.status === 'success' ) {
                    let tenant_id = '52f14cd4-c6f1-4fbd-8f87-4025e1d49242';
                    // let tenant_id = '52f14cd4-c6f1-4fbd-8f87-4025e1d49242';
                    globalTenantId = tenant_id;
                    
                    resolve(resp);
                } else {
                    resolve({ request: 'login', message: { status: 'failed', data: undefined }});
                }
            } else if ( values.request === 'displayApplications' ) {
                const resp = await chirpStackServices.applicationsAndDeviceTotalCount(globalTenantId);
                // resp = testApiService.applicationsListRequest(globalTenantId);
        
                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'displayApplications', message: { status: 'failed', data: undefined }});
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
                return { status: 'Failed', message: 'Request to ChitpStack Failed' };
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