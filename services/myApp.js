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
                const respFromAddApp = await chirpStackServices.addApplicationRequest(values.message.data,
                    globalUserToken, globalTenantId);
        
                if ( respFromAddApp.request === 'addApp' && respFromAddApp.message.status === 'success') {
                    resolve({ request: 'addApp', message: { status: 'success', data: undefined }} );
                } else {
                    console.log(respFromAddApp);

                    resolve({ request: 'addApp', message: { status: 'failed', data: undefined }});
                }
            } 
            else if (values.request === 'appConfig') {
                const respFromAppConfig = await chirpStackServices.applicationConfigurationsRequest(values.message.data,
                    globalUserToken, globalTenantId, globalAppId);
        
                if ( respFromAppConfig.request === 'appConfig' && respFromAppConfig.message.status === 'success') {
                    globalAppName = values.message.data.app_name;

                    resolve({ request: 'appConfig', message: { status: 'success', data: undefined }});
                } else {
                    console.log(respFromAppConfig);

                    resolve({ request: 'appConfig', message: { status: 'failed', data: undefined }});
                }
            } 
            else if (values.request === 'addDev') {
                const respFromAddDev = await chirpStackServices.addDeviceRequest(values.message.data,
                    globalUserToken, globalAppId);
        
                if ( respFromAddDev.request === 'addDev' && respFromAddDev.message.status === 'success') {
                    const respFromCreateDevKey = await chirpStackServices.createDeviceKeyRequest(respFromAddDev.message.data, globalUserToken);

                    if ( respFromCreateDevKey.request === 'createDevKey' && respFromCreateDevKey.message.status === 'success' ) {
                        resolve({ request: 'addDev', message: { status: 'success', data: undefined }});
                    } else {
                        console.log(respFromCreateDevKey);

                        resolve({ request: 'addDev', message: { status: 'failed', data: undefined }});
                    }
                } else {
                    console.log(respFromAddDev);

                    resolve({ request: 'addDev', message: { status: 'failed', data: undefined }});
                }
            } 
            else if (values.request === 'delApp') {
                const respFromDelApp = await chirpStackServices.deleteApplicationRequest(values.message.data,
                    globalUserToken);
        
                if ( respFromDelApp.request === 'delApp' && respFromDelApp.message.status === 'success') {
                    resolve({ request: 'delApp', message: { status: 'success', data: undefined }});
                } else {
                    console.log(respFromDelApp);

                    resolve({ request: 'delApp', message: { status: 'failed', data: undefined }});
                }
            } 
            else if (values.request === 'delDev') {
                const respFromDelDev = await chirpStackServices.deleteDeviceRequest(values.message.data,
                    globalUserToken);

                if ( respFromDelDev.request === 'delDev' && respFromDelDev.message.status === 'success') {
                    resolve({ request: 'delDev', message: { status: 'success', data: undefined }});
                } else {
                    console.log(respFromDelDev);

                    resolve({ request: 'delDev', message: { status: 'failed', data: undefined }});
                }
            } 
            else if ( values.request === 'dispApp' ) {
                const respFromAppsList = await chirpStackServices.applicationsListRequest(globalTenantId, globalUserToken);

                if (respFromAppsList.request === 'appsList' && respFromAppsList.message.status === 'success') {
                    resolve({ request: 'dispApp', message: { status: 'success', data: { app_list: respFromAppsList.message.data }}});
                } else {
                    console.log(respFromAppsList);

                    resolve({ request: 'dispApp', message: { status: 'failed', data: undefined }});
                }
            } 
            else if (values.request === 'dispDev') {
                const respFromDevsList = await chirpStackServices.devicesListRequest(globalAppId, globalUserToken);
            
                if ( respFromDevsList.request === 'dispDev' && respFromDevsList.message.status === 'success') {
                    respFromDevsList.message.data.app_name = globalAppName;

                    resolve({ request: 'dispDev', message: { status: 'success', data: respFromDevsList.message.data }});
                } else {
                    console.log(respFromDevsList);

                    resolve({ request: 'dispDev', message: { status: 'failed', data: undefined }});
                }
            } 
            else if (values.request === 'dispDashDev') {
                const data = { dev_id: globalDevId, dev_name: globalDevName };

                const respFromDispDash = await chirpStackServices.deviceConfigurationsRequest(data, 
                    globalUserToken, globalTenantId, globalAppName);
        
                if ( respFromDispDash.request === 'dispDashDev' && respFromDispDash.message.status === 'success') {
                    resolve({ request: 'dispDashDev', message: { status: 'success', data: respFromDispDash.message.data }});
                } else {
                    console.log(respFromDispDash);

                    resolve({ request: 'dispDashDev', message: { status: 'failed', data: undefined }});
                }
            } 
            else if ( values.request === 'dispDevProfiles' ) {
                const respFromDevProfList = await chirpStackServices.deviceProfilesListRequest(globalTenantId, globalUserToken);

                if (respFromDevProfList.request === 'dispDevProfiles' && respFromDevProfList.message.status === 'success') {
                    resolve({ request: 'dispDevProfiles', message: { status: 'success', data: { dev_profiles: respFromDevProfList.message.data }}});
                } else {
                    console.log(respFromDevProfList);

                    resolve({ request: 'dispDevProfiles', message: { status: 'failed', data: undefined }});
                }
            } 
            else if ( values.request === 'dispMainDash' ) {
                const respFromMainDash = await chirpStackServices.getMainDashboard(globalTenantId, netWorkApiToken);

                if (respFromMainDash.request === 'dispMainDash' && respFromMainDash.message.status === 'success') {
                    resolve({ request: 'dispMainDash', message: { status: 'success', data: respFromMainDash.message.data }});
                } else {
                    console.log(respFromMainDash);

                    resolve({ request: 'dispMainDash', message: { status: 'failed', data: undefined }});
                }
            } 
            else if (values.request === 'enterAppId') {
                const respFromEnterAppId = await chirpStackServices.enterApplicationRequest(values.message.data, globalUserToken);

                if ( respFromEnterAppId.request === 'enterAppId' && respFromEnterAppId.message.status === 'success') {
                    globalAppId = values.message.data.app_id;
                    globalAppName = values.message.data.app_name;

                    respFromEnterAppId.message.data.app_name = globalAppName;

                    resolve({ request: 'enterAppId', message: { status: 'success', data: respFromEnterAppId.message.data }});
                } else {
                    console.log(respFromEnterAppId);

                    resolve({ request: 'enterAppId', message: { status: 'failed', data: undefined }});
                }
            } 
            else if (values.request === 'enterDevId') {
                const respFromEnterDevId = await chirpStackServices.enterDeviceRequest(values.message.data, 
                    globalUserToken, globalTenantId, globalAppName);
        
                if ( respFromEnterDevId.request === 'enterDevId' && respFromEnterDevId.message.status === 'success') {
                    globalDevId = values.message.data.dev_id;
                    globalDevName = values.message.data.dev_name;

                    resolve({ request: 'enterDevId', message: { status: 'success', data: respFromEnterDevId.message.data }});
                } else {
                    console.log(respFromEnterDevId);

                    resolve({ request: 'enterDevId', message: { status: 'failed', data: undefined }});
                }
            } 
            else if (values.request === 'getApp') {
                const respFromGetApp = await chirpStackServices.getApplicationRequest(globalAppId, globalUserToken);
            
                if ( respFromGetApp.request === 'getApp' && respFromGetApp.message.status === 'success') {

                    resolve({ request: 'getApp', message: { status: 'success', data: respFromGetApp.message.data }});
                } else {
                    console.log(respFromGetApp);

                    resolve({ request: 'getApp', message: { status: 'failed', data: undefined }});
                }
            } 
            else if ( values.request === 'login' ) {
                const respFromNwApiToken = await dataBaseServices.getNetworkApiTokenFromDB();

                if ( respFromNwApiToken.request === 'getNwApiToken' && respFromNwApiToken.message.status === 'success' ) {
                    const respFromLoginUser = await chirpStackServices.loginUserRequest(values.message.data, respFromNwApiToken.message.data[0].api_token);

                    if ( respFromLoginUser.request === 'loginUser' && respFromLoginUser.message.status === 'success' ) {
                        globalUserToken = respFromLoginUser.message.data.jwt;

                        const respFromProfileUser = await chirpStackServices.profileUserRequest(globalUserToken);

                        if ( respFromProfileUser.request === 'profileUser' && respFromProfileUser.message.status === 'success' ) {
                            globalUserId = respFromProfileUser.message.data.user_profile.user.id;

                            if (respFromProfileUser.message.data.user_profile.tenantsList.length > 0) {
                                globalTenantId = respFromProfileUser.message.data.user_profile.tenantsList[0].tenantId;
                            } else {
                                globalUserToken = respFromNwApiToken.message.data[0].api_token;
                                globalTenantId = "52f14cd4-c6f1-4fbd-8f87-4025e1d49242";
                            }

                            // macthing gateway between user and db //

                            console.log("USER ID: ", globalUserId);
                            console.log("USER TENANT ID: ", globalTenantId);
                            console.log("USER TOKEN: ", globalUserToken);

                            resolve({ request: 'login', message: { status: 'success', data: undefined }});
                        } else {
                            console.log(respFromProfileUser);

                            resolve({ request: 'login', message: { status: 'failed', data: undefined }});
                        }
                    } else {
                        console.log(respFromLoginUser);

                        resolve({ request: 'login', message: { status: 'failed', data: undefined }});
                    }
                } else {
                    console.log(respFromNwApiToken);

                    resolve({ request: 'login', message: { status: 'failed', data: undefined }});
                }
            } 
            else if ( values.request === 'logout' ) {
                logout();

                resolve({ request: 'logout', message: { status: 'success', data: undefined }});
            } 
            else if ( values.request === 'register' ) {
                const respFromNwApiToken = await dataBaseServices.getNetworkApiTokenFromDB();

                if ( respFromNwApiToken.request === 'getNwApiToken' && respFromNwApiToken.message.status === 'success' ) {
                    const respFromCreateUser = await chirpStackServices.createUser(values.message.data, respFromNwApiToken.message.data[0].api_token);

                    if ( respFromCreateUser.request === 'createUser' && respFromCreateUser.message.status === 'success' ) {
                        const respFromCreateTenant = await chirpStackServices.createTenant(respFromCreateUser.message.data, respFromNwApiToken.message.data[0].api_token);

                        if ( respFromCreateTenant.request === 'createTenant' && respFromCreateTenant.message.status === 'success' ) {
                            const respFromCreateTenantUser = await chirpStackServices.createTenantUser(respFromCreateTenant.message.data, respFromNwApiToken.message.data[0].api_token);

                            if ( respFromCreateTenantUser.request === 'createTenantUser' && respFromCreateTenantUser.message.status === 'success' ) {
                                const respFromAddDevProf = await chirpStackServices.addDeviceProfilesRequest(respFromCreateTenant.message.data.tenant_id, respFromNwApiToken.message.data[0].api_token);
                                
                                if ( respFromAddDevProf.request === 'addDevProfs' && respFromAddDevProf.message.status === 'success' ) {
                                    resolve({ request: 'register', message: { status: 'success', data: undefined }});
                                } else {
                                    console.log(respFromAddDevProf);

                                    resolve({ request: 'register', message: { status: 'failed', data: undefined }});
                                }
                            } else {
                                console.log(respFromCreateTenantUser);

                                resolve({ request: 'register', message: { status: 'failed', data: undefined }});
                            }
                        } else {
                            console.log(respFromCreateTenant);

                            resolve({ request: 'register', message: { status: 'failed', data: undefined }});
                        }
                    } else {
                        console.log(respFromCreateUser);

                        resolve({ request: 'register', message: { status: 'failed', data: undefined }});
                    }
                } else {
                    console.log(respFromNwApiToken);

                    resolve({ request: 'register', message: { status: 'failed', data: undefined }});
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
//----------------------------COMMON ZONE------------------------------//
//---------------------------------------------------------------------//
function logout() {
    netWorkApiToken, 
    globalUserToken, globalUserId, globalTenantId, 
    globalAppId, globalAppName, globalAppDesc, 
    globalDevId, globalDevName, globalDevDesc
    = null;
}
//---------------------------------------------------------------------//