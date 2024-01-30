//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
const netWorkApiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6Ijc3M2Y5OGQwLTk5YTMtNDVjMS1hY2JhLThhOTQzYzdiODFiZiIsInR5cCI6ImtleSJ9.FiCRWLwVlG9mm5_KqUm52afDzMZRJ5qc4jQJz4waxZI";
// Set services
const chirpStackServices = require('./chirpStackServices.js');
const dataBaseServices = require('./dataBaseSevices.js');
//---------------------------------------------------------------------//
//Set values stored
let globalUserToken, globalUserId, globalTenantId;
let globalAppId, globalAppName, globalAppDesc, globalDevId, globalDevName, globalDevDesc;
//---------------------------------------------------------------------//
async function myApp(values) {
    try {
        return new Promise(async (resolve, reject) => {
            if (values.request === 'addApp') {
                const resp = await chirpStackServices.addApplicationRequest(values.message.data,
                    globalUserToken, globalTenantId);
        
                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'addApp', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'appConfig') {
                const resp = await chirpStackServices.applicationConfigurationsRequest(values.message.data,
                    globalUserToken, globalTenantId, globalAppId);
        
                if ( resp.message.status === 'success') {
                    globalAppName = values.message.data.app_name;
                    resolve(resp);
                } else {
                    resolve({ request: 'appConfig', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'addDev') {
                const resp = await chirpStackServices.addDeviceAndCreateDeviceKey(values.message.data,
                    globalUserToken, globalAppId);
        
                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'addDev', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'delApp') {
                const resp = await chirpStackServices.deleteApplicationRequest(values.message.data,
                    globalUserToken);
        
                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'delApp', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'delDev') {
                const resp = await chirpStackServices.deleteDeviceRequest(values.message.data,
                    globalUserToken);

                if ( resp.message.status === 'success') {
                    resolve(resp);
                } else {
                    resolve({ request: 'delDev', message: { status: 'failed', data: undefined }});
                }
            } else if ( values.request === 'dispApp' ) {
                const respFromAppsList = await chirpStackServices.applicationsListRequest(globalTenantId, globalUserToken);

                if (respFromAppsList.request === 'appsList' && respFromAppsList.message.status === 'success') {
                    resolve({ request: 'dispApp', message: { status: 'success', data: { app_list: respFromAppsList.message.data }}});
                } else {
                    resolve({ request: 'dispApp', message: { status: 'failed', data: respFromAppsList.message.data }});
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
                    globalUserToken, globalTenantId, globalAppName);
        
                if ( resp.message.status === 'success') {
                    resp.request = "dispDashDev";

                    resolve(resp);
                } else {
                    resolve({ request: 'dispDashDev', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'enterAppId') {
                const resp = await chirpStackServices.devicesListRequest(values.message.data, globalUserToken);
            
                if ( resp.message.status === 'success') {
                    const getAppReq = await chirpStackServices.getApplicationRequest(values.message.data.app_id, globalUserToken);

                    globalAppId = values.message.data.app_id;
                    globalAppName = values.message.data.app_name;

                    resp.message.data.app_config = getAppReq;

                    resolve(resp);
                } else {
                    resolve({ request: 'enterAppId', message: { status: 'failed', data: undefined }});
                }
            } else if (values.request === 'enterDevId') {
                const resp = await chirpStackServices.enterDeviceRequest(values.message.data, 
                    globalUserToken, globalTenantId, globalAppName);
        
                if ( resp.message.status === 'success') {
                    globalDevId = values.message.data.dev_id;
                    globalDevName = values.message.data.dev_name;

                    resolve(resp);
                } else {
                    resolve({ request: 'enterDevId', message: { status: 'failed', data: undefined }});
                }
            } 
            else if ( values.request === 'loginUser' ) {
                const respFromLoginUser = await chirpStackServices.loginUserRequest(values.message.data, netWorkApiToken);

                if ( respFromLoginUser.request === 'loginUser' && respFromLoginUser.message.status === 'success' ) {
                    globalUserToken = respFromLoginUser.message.data.jwt;

                    const respFromProfileUser = await chirpStackServices.profileUserRequest(globalUserToken);

                    if ( respFromProfileUser.request === 'profileUser' && respFromProfileUser.message.status === 'success' ) {
                        globalUserId = respFromProfileUser.message.data.user_profile.user.id;
                        globalTenantId = respFromProfileUser.message.data.user_profile.tenantsList[0].tenantId;

                        console.log("USER ID: ", globalUserId);
                        console.log("USER TOKEN: ",globalUserToken);
                        console.log("USER TENANT ID: ", globalTenantId);
                        resolve({ request: 'loginUser', message: { status: 'success', data: "Welcome to LoRa Management Web Application!" }});
                    } else {
                        resolve({ request: 'profileUser', message: { status: 'failed', data: respFromProfileUser.data }});
                    }
                } else {
                    resolve({ request: 'loginUser', message: { status: 'failed', data: respFromLoginUser.message.data }});
                }
            }
            else if ( values.request === 'register' ) {
                const respFromCreateUser = await chirpStackServices.createUser(values.message.data, netWorkApiToken);

                if ( respFromCreateUser.request === 'createUser' && respFromCreateUser.message.status === 'success' ) {
                    const respFromCreateTenant = await chirpStackServices.createTenant(respFromCreateUser.message.data, netWorkApiToken);

                    if ( respFromCreateTenant.request === 'createTenant' && respFromCreateTenant.message.status === 'success' ) {
                        const respFromCreateTenantUser = await chirpStackServices.createTenantUser(respFromCreateTenant.message.data, netWorkApiToken);

                        if ( respFromCreateTenantUser.request === 'createTenantUser' && respFromCreateTenant.message.status === 'success' ) {
                            resolve(respFromCreateTenantUser);
                        } else {
                            resolve({ request: 'createTenantUser', message: { status: 'failed', data: respFromCreateTenantUser.message.data }});
                        }
                    } else {
                        resolve({ request: 'createTenant', message: { status: 'failed', data: respFromCreateTenant.message.data }});
                    }
                } else {
                    resolve({ request: 'register', message: { status: 'failed', data: respFromCreateUser.message.data }});
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