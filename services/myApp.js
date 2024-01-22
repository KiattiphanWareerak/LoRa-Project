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
            if (values.request === 'addApp') {
                const resp = await chirpStackServices.addApplicationRequest(values.message.data,
                    globalTenantId);
        
                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'addApp', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'appConfig') {
                const resp = await chirpStackServices.applicationConfigurationsRequest(values.message.data,
                    globalAppId, globalTenantId);
        
                if ( resp.message.status === 'success') {
                    globalAppName = values.message.data.app_name;
                    resolve(resp);
                } else {
                    resolve({ request: 'appConfig', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'addDev') {
                const resp = await chirpStackServices.addDeviceAndCreateDeviceKey(values.message.data,
                    globalAppId);
        
                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'addDev', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'delApp') {
                const resp = await chirpStackServices.deleteApplicationRequest(values.message.data,
                    globalTenantId);
        
                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'delApp', message: { status: 'failed', data: undefined }});
                }
            } else if (values.status === 'delDev') {
                const resp = await chirpStackServices.deleteDeviceRequest(values.message.data);

                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'delDev', message: { status: 'failed', data: undefined }});
                }
            } else if ( values.request === 'dispApp' ) {
                const resp = await chirpStackServices.applicationsAndDeviceTotalCount(globalTenantId);
        
                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'dispApp', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'dispDev') {
                let data = { app_id: globalAppId, app_name: globalAppName };
    
                const resp = await chirpStackServices.devicesListRequest(data);
            
                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'dispDev', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'dispDashDev') {
                let data = { dev_id: globalDevId, dev_name: globalDevName };
                
                const resp = await chirpStackServices.enterDeviceRequest(data, globalAppName);
        
                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'dispDashDiv', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'enterAppId') {
                const resp = await chirpStackServices.devicesListRequest(values.message.data);
            
                if ( resp.message.status === 'success') {
                    globalAppId = values.message.data.app_id;
                    globalAppName = values.message.data.app_name;
                    resolve(resp);
                } else {
                    resolve({ request: 'enterAppId', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'enterDevId') {
                const resp = await chirpStackServices.enterDeviceRequest(values.message.data, globalAppName);
        
                if ( resp.message.status === 'success') {
                    globalDevId = values.message.data.dev_id;
                    globalDevName = values.message.data.dev_name;
                    resolve(resp);
                } else {
                    resolve({ request: 'enterDevId', message: { status: 'failed', data: undefined }});
                }
            } 
            else if ( values.request === 'login' ) {
                const resp = await dataBaseServices.loginRequest(values.message.data);

                if ( resp.message.status === 'success' ) {
                    let tenant_id = '52f14cd4-c6f1-4fbd-8f87-4025e1d49242';
                    globalTenantId = tenant_id;
                    
                    resolve(resp);
                } else {
                    resolve({ request: 'login', message: { status: 'failed', data: undefined }});
                }
            }
            else {
                return { request: 'unknow', message: { status: 'failed', data: 'Unknow request from Client.' }};
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