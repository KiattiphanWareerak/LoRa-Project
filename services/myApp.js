//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
// Set services
const chirpStackServices = require('./chirpStackServices.js');
const dataBaseServices = require('./dataBaseSevices.js');
//---------------------------------------------------------------------//
//Set values stored
let globalApiToken, globalTenantId, globalUserToken,
    globalAppId, globalAppName, globalAppDesc, 
    globalDevId, globalDevName, globalDevDesc;
//---------------------------------------------------------------------//
async function myApp(values) {
    try {
        return new Promise(async (resolve, reject) => {
            if (values.request === 'addApp') {
                const resp = await chirpStackServices.addApplicationRequest(values.message.data,
                    globalApiToken, globalTenantId);
        
                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'addApp', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'appConfig') {
                const resp = await chirpStackServices.applicationConfigurationsRequest(values.message.data,
                        globalApiToken, globalTenantId, globalAppId);
        
                if ( resp.message.status === 'success') {
                    globalAppName = values.message.data.app_name;
                    resolve(resp);
                } else {
                    resolve({ request: 'appConfig', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'addDev') {
                const resp = await chirpStackServices.addDeviceAndCreateDeviceKey(values.message.data,
                    globalApiToken, globalAppId);
        
                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'addDev', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'delApp') {
                const resp = await chirpStackServices.deleteApplicationRequest(values.message.data,
                    globalApiToken);
        
                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'delApp', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'delDev') {
                const resp = await chirpStackServices.deleteDeviceRequest(values.message.data,
                    globalApiToken);

                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'delDev', message: { status: 'failed', data: undefined }});
                }
            } else if ( values.request === 'dispApp' ) {
                // const resp = await chirpStackServices.applicationsAndDeviceTotalCount(globalApiToken, globalTenantId);
                const respFromChirpStack = await chirpStackServices.applicationsListRequest(globalApiToken, globalTenantId);
                const respFromDatabase = await dataBaseServices.applicationListMatchingRequest(globalUserToken, respFromChirpStack);

                const resp = respFromDatabase;

                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'dispApp', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'dispDev') {
                const data = { app_id: globalAppId, app_name: globalAppName, app_desc: globalAppDesc };
    
                const resp = await chirpStackServices.devicesListRequest(data, globalApiToken);
            
                if ( resp.message.status === 'success') {
                    const getAppReq = await chirpStackServices.getApplicationRequest(globalAppId, globalApiToken);

                    resp.request = "dispDev";
                    resp.message.data.app_config = getAppReq;

                    resolve(resp);
                } else {
                    resolve({ request: 'dispDev', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'dispDashDev') {
                const data = { dev_id: globalDevId, dev_name: globalDevName };
                
                const resp = await chirpStackServices.enterDeviceRequest(data, 
                    globalApiToken, globalTenantId, globalAppName);
        
                if ( resp.message.status === 'success') {
                    resp.request = "dispDashDev";

                    resolve(resp);
                } else {
                    resolve({ request: 'dispDashDev', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'enterAppId') {
                const resp = await chirpStackServices.devicesListRequest(values.message.data, globalApiToken);
            
                if ( resp.message.status === 'success') {
                    const getAppReq = await chirpStackServices.getApplicationRequest(values.message.data.app_id, globalApiToken);

                    globalAppId = values.message.data.app_id;
                    globalAppName = values.message.data.app_name;

                    resp.message.data.app_config = getAppReq;

                    resolve(resp);
                } else {
                    resolve({ request: 'enterAppId', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'enterDevId') {
                const resp = await chirpStackServices.enterDeviceRequest(values.message.data, 
                    globalApiToken, globalTenantId, globalAppName);
        
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
                    globalApiToken = resp.message.data.api_token;
                    globalTenantId = resp.message.data.tenant_id;
                    globalUserToken = resp.message.data.user_token;
                    dataStored = resp.message.data.data_stored;
                    
                    resolve(resp);
                } else {
                    resolve({ request: 'login', message: { status: 'failed', data: undefined }});
                }
            }
            else if ( values.request === 'register' ) {
                const respFromCreateUser = await chirpStackServices.createUser(values.message.data, globalApiToken);

                if ( respFromCreateUser.request === 'createUser' && respFromCreateUser.message.status === 'success' ) {
                    const respFromCreateTenant = await chirpStackServices.createTenant(respFromCreateUser.message.data, globalApiToken);

                    if ( respFromCreateTenant.request === 'createTenant' && respFromCreateTenant.message.status === 'success' ) {
                        const respFromCreateTenantUser = await chirpStackServices.createTenantUser(respFromCreateTenant.message.data, globalApiToken);

                        if ( respFromCreateTenantUser.request === 'createTenantUser' && respFromCreateTenant.message.status === 'success' ) {
                            respFromCreateTenantUser.request = 'register';
                            resolve(respFromCreateTenantUser);
                        }
                    } 
                } else {
                    resolve(respFromCreateUser);
                }
            }
            else {
                resolve({ request: 'unknow', message: { status: 'failed', data: 'Unknow request from Client.' }});
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