//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
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
                const respFromNwApiToken = await dataBaseServices.getNetworkApiTokenFromDB();

                if ( respFromNwApiToken.request === 'getNwApiToken' && respFromNwApiToken.message.status === 'success' ) {
                    const respFromTnId = await dataBaseServices.getCSTenantIdFromDB();

                    if ( respFromTnId.request === 'getCSTenantId' && respFromTnId.message.status === 'success' ) {
                        const respFromMainDash = await chirpStackServices.getMainDashboard(globalTenantId, respFromTnId.message.data[0].tenant_id,
                            respFromNwApiToken.message.data[0].api_token);

                        if (respFromMainDash.request === 'dispMainDash' && respFromMainDash.message.status === 'success') {
                            resolve({ request: 'dispMainDash', message: { status: 'success', data: respFromMainDash.message.data }});
                        } else {
                            console.log(respFromMainDash);
        
                            resolve({ request: 'dispMainDash', message: { status: 'failed', data: undefined }});
                        }
                    } else {
                        console.log(respFromTnId);
        
                        resolve({ request: 'dispMainDash', message: { status: 'failed', data: undefined }});
                    }
                } else {
                    console.log(respFromNwApiToken);

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
                let data = {};
                let data_timestamp = { timeAgo: values.message.data.timeAgo, aggregation: values.message.data.aggregation };

                const respGetLinkMetric = await chirpStackServices.getLinkMetricsRequest(values.message.data.dev_id, globalUserToken, data_timestamp);
        
                if ( respGetLinkMetric.request === 'getLinkMetrics' && respGetLinkMetric.message.status === 'success') {
                    const respGetDevConfig = await chirpStackServices.getDeviceConfigurationRequest(values.message.data.dev_id, globalUserToken);

                    if ( respGetDevConfig.request === 'getDevice' && respGetDevConfig.message.status === 'success') {
                        globalDevId = values.message.data.dev_id;
                        globalDevName = values.message.data.dev_name;

                        data.dev_linkMetrics = respGetLinkMetric.message.data;
                        data.dev_config = respGetDevConfig.message.data;
                        data.app_name = globalAppName;

                        resolve({ request: 'enterDevId', message: { status: 'success', data: data }});
                    } else {
                        console.log(respGetDevConfig);
    
                        resolve({ request: 'enterDevId', message: { status: 'failed', data: undefined }});
                    }
                } else {
                    console.log(respGetLinkMetric);

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
            else if (values.request === 'getDashDev') {
                let data = {};

                const respGetLinkMetric = await chirpStackServices.getLinkMetricsRequest(globalDevId, globalUserToken, values.message.data);
        
                if ( respGetLinkMetric.request === 'getLinkMetrics' && respGetLinkMetric.message.status === 'success') {
                    const respGetDevConfig = await chirpStackServices.getDeviceConfigurationRequest(globalDevId, globalUserToken);

                    if ( respGetDevConfig.request === 'getDevice' && respGetDevConfig.message.status === 'success') {
                        data.dev_linkMetrics = respGetLinkMetric.message.data;
                        data.dev_config = respGetDevConfig.message.data;
                        data.app_name = globalAppName;

                        resolve({ request: 'getDashDev', message: { status: 'success', data: data }});
                    } else {
                        console.log(respGetDevConfig);
    
                        resolve({ request: 'getDashDev', message: { status: 'failed', data: undefined }});
                    }
                } else {
                    console.log(respGetLinkMetric);

                    resolve({ request: 'getDashDev', message: { status: 'failed', data: undefined }});
                }
            }
            else if (values.request === 'getDevEvents') {
                let data = {};

                const respGetDevEvents = await chirpStackServices.getDeviceEventsRequest(globalDevId, globalUserToken);
        
                if ( respGetDevEvents.request === 'getDevQueues' && respGetDevEvents.message.status === 'success') {
                    data.dev_events = respGetDevEvents.message.data;
                    data.app_name = globalAppName;

                    resolve({ request: 'getDevEvents', message: { status: 'success', data: data }});
                } else {
                    console.log(respGetDevEvents);

                    resolve({ request: 'getDevEvents', message: { status: 'failed', data: undefined }});
                }
            }
            else if (values.request === 'getDevFrames') {
                let data = {};

                const respGetDevFrames = await chirpStackServices.getDeviceFramesRequest(globalDevId, globalUserToken);
        
                if ( respGetDevFrames.request === 'getDevFrames' && respGetDevFrames.message.status === 'success') {
                    data.dev_frames = respGetDevFrames.message.data;
                    data.app_name = globalAppName;

                    resolve({ request: 'getDevFrames', message: { status: 'success', data: data }});
                } else {
                    console.log(respGetDevFrames);

                    resolve({ request: 'getDevFrames', message: { status: 'failed', data: undefined }});
                }
            }
            else if (values.request === 'getDevInfo') {
                let data = {};

                const respGetDevConfig = await chirpStackServices.getDeviceConfigurationRequest(globalDevId, globalUserToken);
        
                if ( respGetDevConfig.request === 'getDevice' && respGetDevConfig.message.status === 'success') {
                    const respDevProfileList = await chirpStackServices.deviceProfilesListRequest(globalTenantId, globalUserToken);

                    if ( respDevProfileList.request === 'dispDevProfiles' && respDevProfileList.message.status === 'success') {
                        const respGetDevKey = await chirpStackServices.getDeviceKeyRequest(globalDevId, globalUserToken);

                        if ( respGetDevKey.request === 'getDevKey' && respGetDevKey.message.status === 'success') {
                            const respGetDevActivation = await chirpStackServices.getDeviceActivationRequest(globalDevId, globalUserToken);

                            if ( respGetDevKey.request === 'getDevActivation' && respGetDevKey.message.status === 'success') {
                                data.dev_config = respGetDevConfig.message.data;
                                data.dev_profilesList = respDevProfileList.message.data;
                                data.dev_key = respGetDevKey.message.data;
                                data.dev_activation = respGetDevActivation.message.data;
                                data.app_name = globalAppName;
        
                                resolve({ request: 'getDevInfo', message: { status: 'success', data: data }});
                            } else {
                                console.log(respGetDevActivation);
            
                                resolve({ request: 'getDevInfo', message: { status: 'failed', data: undefined }});
                            }
                        } else {
                            console.log(respGetDevKey);
        
                            resolve({ request: 'getDevInfo', message: { status: 'failed', data: undefined }});
                        }
                    } else {
                        console.log(respDevProfileList);
    
                        resolve({ request: 'getDevInfo', message: { status: 'failed', data: undefined }});
                    }
                } else {
                    console.log(respGetDevConfig);

                    resolve({ request: 'getDevInfo', message: { status: 'failed', data: undefined }});
                }
            }
            else if (values.request === 'getDevQueues') {
                let data = {};

                const respGetDevQueue = await chirpStackServices.getQueueItemsRequest(globalDevId, globalUserToken);
        
                if ( respGetDevQueue.request === 'getDevQueues' && respGetDevQueue.message.status === 'success') {
                    data.dev_queues = respGetDevQueue.message.data;
                    data.app_name = globalAppName;

                    resolve({ request: 'getDevQueues', message: { status: 'success', data: data }});
                } else {
                    console.log(respGetDevQueue);

                    resolve({ request: 'getDevQueues', message: { status: 'failed', data: undefined }});
                }
            }
            else if ( values.request === 'loginByEmail' ) {
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
                            console.log("USER ID: ", globalUserId);
                            console.log("USER TENANT ID: ", globalTenantId);
                            console.log("USER TOKEN: ", globalUserToken);

                            resolve({ request: 'loginByEmail', message: { status: 'success', data: undefined }});
                        } else {
                            console.log(respFromProfileUser);

                            resolve({ request: 'loginByEmail', message: { status: 'failed', data: undefined }});
                        }
                    } else {
                        console.log(respFromLoginUser);

                        resolve({ request: 'loginByEmail', message: { status: 'failed', data: undefined }});
                    }
                } else {
                    console.log(respFromNwApiToken);

                    resolve({ request: 'loginByEmail', message: { status: 'failed', data: undefined }});
                }
            }
            else if ( values.request === 'loginByUname' ) {
                let data = {
                    user_em: undefined, 
                    user_pw: values.message.data.user_pw
                }
                const respFromNwApiToken = await dataBaseServices.getNetworkApiTokenFromDB();

                if ( respFromNwApiToken.request === 'getNwApiToken' && respFromNwApiToken.message.status === 'failed') {
                    console.log(respFromNwApiToken);

                    resolve({ request: 'register', message: { status: 'failed', data: undefined }});
                }
                else if ( respFromNwApiToken.request === 'getNwApiToken' && respFromNwApiToken.message.status === 'success' ) {
                    const respFromTenantList = await chirpStackServices.getTenantsListRequest(respFromNwApiToken.message.data[0].api_token);

                    if ( respFromTenantList.request === 'getTenantsList' && respFromTenantList.message.status === 'success' ) {
                        const resultCheckUserName = await checkUserName(values.message.data.user_un, respFromTenantList.message.data);

                        console.log(respFromTenantList.message.data);
                        if ( resultCheckUserName.request === 'checkUserName' && resultCheckUserName.message.status === 'failed' ) {
                            const respFromUserInTenant = await chirpStackServices.getUserInTenantRequest(resultCheckUserName.message.data.tenant_id, respFromNwApiToken.message.data[0].api_token);

                            if ( respFromUserInTenant.request === 'getUserInTn' && respFromUserInTenant.message.status === 'success' ) {
                                data.user_em = respFromUserInTenant.message.data[0].email;
                            } else {
                                console.log(respFromUserInTenant);

                                resolve({ request: 'loginByUname', message: { status: 'failed', data: undefined }});
                            }
                        } else {
                            console.log(resultCheckUserName);

                            resolve({ request: 'loginByUname', message: { status: 'failed', data: undefined }});
                        }
                    } else {
                        console.log(respFromTenantList);

                        resolve({ request: 'loginByUname', message: { status: 'failed', data: undefined }});
                    }
                }

                const respFromLoginUser = await chirpStackServices.loginUserRequest(data, respFromNwApiToken.message.data[0].api_token);

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
                        console.log("USER ID: ", globalUserId);
                        console.log("USER TENANT ID: ", globalTenantId);
                        console.log("USER TOKEN: ", globalUserToken);

                        resolve({ request: 'loginByUname', message: { status: 'success', data: undefined }});
                    } else {
                        console.log(respFromProfileUser);

                        resolve({ request: 'loginByUname', message: { status: 'failed', data: undefined }});
                    }
                } else {
                    console.log(respFromLoginUser);

                    resolve({ request: 'loginByUname', message: { status: 'failed', data: undefined }});
                }
            } 
            else if ( values.request === 'logout' ) {
                logout();

                resolve({ request: 'logout', message: { status: 'success', data: undefined }});
            }
            else if (values.request === 'postDevConfigConfirm') {
                const respPostDevConfig = await chirpStackServices.postDeviceConfigurationRequest(values.message.data, globalUserToken);
        
                if ( respPostDevConfig.request === 'postDev' && respPostDevConfig.message.status === 'success') {
                    const respPostDevKey = await chirpStackServices.postDeviceKeyRequest(values.message.data, globalUserToken);

                    if ( respPostDevKey.request === 'postDevKey' && respPostDevKey.message.status === 'success') {

                        resolve({ request: 'postDevConfigConfirm', message: { status: 'success',
                            data: { 
                                post_devConfig: respPostDevConfig.message.data, 
                                post_devKey: respPostDevConfig.message.data 
                            }}});
                    } else {
                        console.log(respPostDevKey);
    
                        resolve({ request: 'postDevConfigConfirm', message: { status: 'failed', data: undefined }});
                    }
                } else {
                    console.log(respPostDevConfig);

                    resolve({ request: 'postDevConfigConfirm', message: { status: 'failed', data: undefined }});
                }
            }
            else if ( values.request === 'register' ) {
                const respFromNwApiToken = await dataBaseServices.getNetworkApiTokenFromDB();

                if ( respFromNwApiToken.request === 'getNwApiToken' && respFromNwApiToken.message.status === 'failed') {
                    console.log(respFromNwApiToken);

                    resolve({ request: 'register', message: { status: 'failed', data: undefined }});
                } 
                else if ( respFromNwApiToken.request === 'getNwApiToken' && respFromNwApiToken.message.status === 'success' ) {
                    const respFromTenantList = await chirpStackServices.getTenantsListRequest(respFromNwApiToken.message.data[0].api_token);

                    if ( respFromTenantList.request === 'getTenantsList' && respFromTenantList.message.status === 'success' ) {
                        const respFromUserList = await chirpStackServices.getUserListRequest(respFromNwApiToken.message.data[0].api_token);

                        if ( respFromUserList.request === 'getUsersList' && respFromUserList.message.status === 'success' ) {
                            const resultCheckUserName = await checkUserName(values.message.data.user_name, respFromTenantList.message.data);

                            if ( resultCheckUserName.request === 'checkUserName' && resultCheckUserName.message.status === 'success' ) {
                                const resultCheckUserEmail = await checkUserEmail(values.message.data.user_em, respFromUserList.message.data);

                                if ( resultCheckUserEmail.request === 'checkUserEmail' && resultCheckUserEmail.message.status === 'success' ) {
                                    // do nothing
                                } else {
                                    console.log(resultCheckUserEmail);

                                    resolve({ request: 'register', message: { status: 'failed', data: { check_em: "duplicated" }}});
                                }
                            } else {
                                console.log(resultCheckUserName);

                                resolve({ request: 'register', message: { status: 'failed', data: { check_name: "duplicated" }}});
                            }
                        } else {
                            console.log(respFromUserList);

                            resolve({ request: 'register', message: { status: 'failed', data: undefined }});
                        }
                    } else {
                        console.log(respFromTenantList);

                        resolve({ request: 'register', message: { status: 'failed', data: undefined }});
                    }
                }

                const respFromCreateUser = await chirpStackServices.createUser(values.message.data, respFromNwApiToken.message.data[0].api_token);

                if ( respFromCreateUser.request === 'createUser' && respFromCreateUser.message.status === 'success' ) {
                    const respFromCreateTenant = await chirpStackServices.createTenant(respFromCreateUser.message.data, respFromNwApiToken.message.data[0].api_token);

                    if ( respFromCreateTenant.request === 'createTenant' && respFromCreateTenant.message.status === 'success' ) {
                        const respFromCreateTenantUser = await chirpStackServices.createTenantUser(respFromCreateTenant.message.data, respFromNwApiToken.message.data[0].api_token);

                        if ( respFromCreateTenantUser.request === 'createTenantUser' && respFromCreateTenantUser.message.status === 'success' ) {
                            const respFromAddDevProf = await chirpStackServices.addDeviceProfilesRequest(respFromCreateTenant.message.data.tenant_id, respFromNwApiToken.message.data[0].api_token);
                            
                            if ( respFromAddDevProf.request === 'addDevProfs' && respFromAddDevProf.message.status === 'success' ) {
                                const respFromCreateInfluxDbUser = await dataBaseServices.createInfluxDbForUser(values.message.data);

                                if ( respFromCreateInfluxDbUser.request === 'createInfluxForUser' && respFromCreateInfluxDbUser.message.status === 'success' ) {

                                    resolve({ request: 'register', message: { status: 'success', data: undefined }});
                                } else {
                                    console.log(respFromCreateInfluxDbUser);

                                    resolve({ request: 'register', message: { status: 'failed', data: undefined }});
                                }
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
async function checkUserEmail(em, emList) {
    try {
        return new Promise((resolve, reject) => {
            const emailExists = emList.find(emails => emails.email === em);

            if (emailExists) {
                resolve({ request: 'checkUserEmail', message: { status: 'failed', data: undefined }});
            } else {
                resolve({ request: 'checkUserEmail', message: { status: 'success', data: undefined }});
            }
        });
    } catch (error) {
        console.log(error);
    }
}
async function checkUserName(username, nameList) {
    try {
        return new Promise((resolve, reject) => {
            if ( username === 'admin' ) {
                const adminExist = nameList.find(user => user.name === 'ChirpStack');
                
                resolve({ request: 'checkUserName', message: { status: 'failed', data: { tenant_id: adminExist.id }}});
            }

            const userExists = nameList.find(user => user.name === username);

            if (userExists) {
                resolve({ request: 'checkUserName', message: { status: 'failed', data: { tenant_id: userExists.id }}});
            } else {
                resolve({ request: 'checkUserName', message: { status: 'success', data: undefined }});
            }
        });
    } catch (error) {
        console.log(error);
    }
}
function logout() {
    globalUserToken, globalUserId, globalTenantId, 
    globalAppId, globalAppName, globalAppDesc, 
    globalDevId, globalDevName, globalDevDesc
    = null;
}
//---------------------------------------------------------------------//