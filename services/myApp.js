//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
// Set services
const chirpStackServices = require('./chirpStackServices.js');
const dataBaseServices = require('./dataBaseServices.js');
//---------------------------------------------------------------------//
//Set values stored
let globalUserToken, globalUserId, globalTenantId, globalUserName;
let globalAppId, globalAppName, globalAppDesc, globalDevId, globalDevName, globalDevDesc;
//---------------------------------------------------------------------//
async function myApp(values) {
    try {
        return new Promise(async (resolve, reject) => {
            if (values.request === 'addApp') {
                if (values.message.data.app_intg === true) {
                    const respFromAddApp = await chirpStackServices.addApplicationRequest(values.message.data,
                        globalUserToken, globalTenantId);

                    if (respFromAddApp.request === 'addApp' && respFromAddApp.message.status === 'success') {
                        const respFromCreateOrgInfluxDb = await dataBaseServices.createOrgInfluxDb(globalUserName, respFromApiToken.message.data[0].influx_token);

                        if (respFromCreateOrgInfluxDb.request === 'postOrg' && respFromCreateOrgInfluxDb.message.status === 'success') {
                            const respFromCreateBuckets = await dataBaseServices.createBucketInfluxDb(respFromCreateOrgInfluxDb.message.data, globalUserName,
                                respFromApiToken.message.data[0].influx_token);

                            if (respFromCreateBuckets.request === 'postBucket' && respFromCreateBuckets.message.status === 'success') {
                                const respFromGetUserInf = await dataBaseServices.getInfluxDbUser();

                                const matchingUser = respFromGetUserInf.message.data.users.find(user => user.name === globalUserName);

                                if (matchingUser) {
                                    console.log(`User ${globalUserName} found! ID: ${matchingUser.id}`);

                                    const respFromAddMems = await dataBaseServices.addMemberInfluxDb(respFromCreateOrgInfluxDb.message.data,
                                        matchingUser.id, respFromApiToken.message.data[0].influx_token);
                                    const respFromAddRole = await dataBaseServices.addRoleInfluxDb(respFromCreateOrgInfluxDb.message.data, matchingUser.id,
                                        respFromApiToken.message.data[0].influx_token);

                                    if (respFromAddMems.request === 'postAddMember' && respFromAddMems.message.status === 'success'
                                        && respFromAddRole.request === 'postAddRole' && respFromAddRole.message.status === 'success') {
                                        // Setup InfluxDB completed
                                        // ...         
                                        const respFromIntgApp = await chirpStackServices.createInfluxDbIntegrationRequest(respFromAddApp.message.data.id,
                                            respFromCreateOrgInfluxDb.org_name, respFromCreateBuckets.bucket_name,
                                            respFromApiToken.message.data[0].cs_token, respFromApiToken.message.data[0].influx_token);

                                        if (respFromIntgApp.request === 'intgApp' && respFromIntgApp.message.status === 'success') {
                                            // finished
                                            // ........
                                            resolve({ request: 'addApp', message: { status: 'success', data: undefined } });
                                        } else {
                                            resolve({ request: 'addApp', message: { status: 'failed', data: undefined } });
                                        }
                                    } else {
                                        resolve({ request: 'addApp', message: { status: 'failed', data: undefined } });
                                        return;
                                    }
                                } else {
                                    console.log(`User ${globalUserName} not found.`);
                                }
                            } else {
                                resolve({ request: 'addApp', message: { status: 'failed', data: undefined } });
                                return;
                            }
                        } else {
                            resolve({ request: 'addApp', message: { status: 'failed', data: undefined } });
                            return;
                        }
                    } else {
                        resolve({ request: 'addApp', message: { status: 'failed', data: undefined } });
                    }
                } else {
                    const respFromAddApp = await chirpStackServices.addApplicationRequest(values.message.data,
                        globalUserToken, globalTenantId);

                    if (respFromAddApp.request === 'addApp' && respFromAddApp.message.status === 'success') {
                        resolve({ request: 'addApp', message: { status: 'success', data: undefined } });
                    } else {
                        resolve({ request: 'addApp', message: { status: 'failed', data: undefined } });
                    }
                }
            }
            else if (values.request === 'addDev') {
                const respFromAddDev = await chirpStackServices.addDeviceRequest(values.message.data,
                    globalUserToken, globalAppId);

                if (respFromAddDev.request === 'addDev' && respFromAddDev.message.status === 'success') {
                    const respFromCreateDevKey = await chirpStackServices.createDeviceKeyRequest(respFromAddDev.message.data, globalUserToken);

                    if (respFromCreateDevKey.request === 'createDevKey' && respFromCreateDevKey.message.status === 'success') {
                        resolve({ request: 'addDev', message: { status: 'success', data: undefined } });
                    } else {
                        resolve({ request: 'addDev', message: { status: 'failed', data: undefined } });
                    }
                } else {
                    resolve({ request: 'addDev', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'appConfig') {
                const respFromAppConfig = await chirpStackServices.applicationConfigurationsRequest(values.message.data,
                    globalUserToken, globalTenantId, globalAppId);

                if (respFromAppConfig.request === 'appConfig' && respFromAppConfig.message.status === 'success') {
                    globalAppName = values.message.data.app_name;

                    resolve({ request: 'appConfig', message: { status: 'success', data: undefined } });
                } else {
                    resolve({ request: 'appConfig', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'delApp') {
                const respFromDelApp = await chirpStackServices.deleteApplicationRequest(values.message.data,
                    globalUserToken);

                if (respFromDelApp.request === 'delApp' && respFromDelApp.message.status === 'success') {
                    resolve({ request: 'delApp', message: { status: 'success', data: undefined } });
                } else {
                    resolve({ request: 'delApp', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'delDev') {
                const respFromDelDev = await chirpStackServices.deleteDeviceRequest(values.message.data,
                    globalUserToken);

                if (respFromDelDev.request === 'delDev' && respFromDelDev.message.status === 'success') {
                    resolve({ request: 'delDev', message: { status: 'success', data: undefined } });
                } else {
                    resolve({ request: 'delDev', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'dispApp') {
                const respFromAppsList = await chirpStackServices.applicationsListRequest(globalTenantId, globalUserToken);

                if (respFromAppsList.request === 'appsList' && respFromAppsList.message.status === 'success') {
                    resolve({ request: 'dispApp', message: { status: 'success', data: { app_list: respFromAppsList.message.data } } });
                } else {
                    resolve({ request: 'dispApp', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'dispDev') {
                const respFromDevsList = await chirpStackServices.devicesListRequest(globalAppId, globalUserToken);

                if (respFromDevsList.request === 'dispDev' && respFromDevsList.message.status === 'success') {
                    respFromDevsList.message.data.app_name = globalAppName;

                    resolve({ request: 'dispDev', message: { status: 'success', data: respFromDevsList.message.data } });
                } else {
                    resolve({ request: 'dispDev', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'dispDevProfiles') {
                const respFromDevProfList = await chirpStackServices.deviceProfilesListRequest(globalTenantId, globalUserToken);

                if (respFromDevProfList.request === 'dispDevProfiles' && respFromDevProfList.message.status === 'success') {
                    resolve({ request: 'dispDevProfiles', message: { status: 'success', data: { dev_profiles: respFromDevProfList.message.data } } });
                } else {
                    resolve({ request: 'dispDevProfiles', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'dispMainDash') {
                const respFromApiToken = await dataBaseServices.getApiTokenFromDB();

                if (respFromApiToken.request === 'getApiToken' && respFromApiToken.message.status === 'success') {
                    const respFromTnId = await dataBaseServices.getCSTenantIdFromDB();

                    if (respFromTnId.request === 'getCSTenantId' && respFromTnId.message.status === 'success') {
                        const respFromMainDash = await chirpStackServices.getMainDashboard(globalTenantId, respFromTnId.message.data[0].tenant_id,
                            respFromApiToken.message.data[0].cs_token);

                        if (respFromMainDash.request === 'dispMainDash' && respFromMainDash.message.status === 'success') {
                            resolve({ request: 'dispMainDash', message: { status: 'success', data: respFromMainDash.message.data } });
                        } else {
                            resolve({ request: 'dispMainDash', message: { status: 'failed', data: undefined } });
                        }
                    } else {
                        resolve({ request: 'dispMainDash', message: { status: 'failed', data: undefined } });
                    }
                } else {
                    resolve({ request: 'dispMainDash', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'enterAppId') {
                const respFromEnterAppId = await chirpStackServices.enterApplicationRequest(values.message.data, globalUserToken);

                if (respFromEnterAppId.request === 'enterAppId' && respFromEnterAppId.message.status === 'success') {
                    globalAppId = values.message.data.app_id;
                    globalAppName = values.message.data.app_name;

                    respFromEnterAppId.message.data.app_name = globalAppName;

                    resolve({ request: 'enterAppId', message: { status: 'success', data: respFromEnterAppId.message.data } });
                } else {
                    resolve({ request: 'enterAppId', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'enterDevId') {
                let data = {};
                let data_timestamp = { timeAgo: values.message.data.timeAgo, aggregation: values.message.data.aggregation };

                const respGetLinkMetric = await chirpStackServices.getLinkMetricsRequest(values.message.data.dev_id, globalUserToken, data_timestamp);

                if (respGetLinkMetric.request === 'getLinkMetrics' && respGetLinkMetric.message.status === 'success') {
                    const respGetDevConfig = await chirpStackServices.getDeviceConfigurationRequest(values.message.data.dev_id, globalUserToken);

                    if (respGetDevConfig.request === 'getDevice' && respGetDevConfig.message.status === 'success') {
                        globalDevId = values.message.data.dev_id;
                        globalDevName = values.message.data.dev_name;

                        data.dev_linkMetrics = respGetLinkMetric.message.data;
                        data.dev_config = respGetDevConfig.message.data;
                        data.app_name = globalAppName;

                        resolve({ request: 'enterDevId', message: { status: 'success', data: data } });
                    } else {
                        resolve({ request: 'enterDevId', message: { status: 'failed', data: undefined } });
                    }
                } else {
                    resolve({ request: 'enterDevId', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'enqueueDev') {
                const respFromEnqueue = await chirpStackServices.enqueueDeviceRequest(values.message.data, globalDevId, globalUserToken);

                if (respFromEnqueue.request === 'enqueueDev' && respFromEnqueue.message.status === 'success') {
                    resolve({ request: 'enqueueDev', message: { status: 'success', data: respFromEnqueue.message.data } });
                } else {
                    resolve({ request: 'enqueueDev', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'flushQueueDev') {
                const respFromEnqueue = await chirpStackServices.flushQueueDeviceRequest(globalDevId, globalUserToken);

                if (respFromEnqueue.request === 'flushQueueDev' && respFromEnqueue.message.status === 'success') {
                    resolve({ request: 'flushQueueDev', message: { status: 'success', data: undefined } });
                } else {
                    resolve({ request: 'flushQueueDev', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'getApp') {
                const respFromGetApp = await chirpStackServices.getApplicationRequest(globalAppId, globalUserToken);

                if (respFromGetApp.request === 'getApp' && respFromGetApp.message.status === 'success') {

                    resolve({ request: 'getApp', message: { status: 'success', data: respFromGetApp.message.data } });
                } else {
                    resolve({ request: 'getApp', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'getDashDev') {
                let data = {};

                const respGetLinkMetric = await chirpStackServices.getLinkMetricsRequest(globalDevId, globalUserToken, values.message.data);

                if (respGetLinkMetric.request === 'getLinkMetrics' && respGetLinkMetric.message.status === 'success') {
                    const respGetDevConfig = await chirpStackServices.getDeviceConfigurationRequest(globalDevId, globalUserToken);

                    if (respGetDevConfig.request === 'getDevice' && respGetDevConfig.message.status === 'success') {
                        data.dev_linkMetrics = respGetLinkMetric.message.data;
                        data.dev_config = respGetDevConfig.message.data;
                        data.app_name = globalAppName;

                        resolve({ request: 'getDashDev', message: { status: 'success', data: data } });
                    } else {
                        resolve({ request: 'getDashDev', message: { status: 'failed', data: undefined } });
                    }
                } else {
                    resolve({ request: 'getDashDev', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'getDevEvents') {
                let data = {};

                const respGetDevEvents = await chirpStackServices.getDeviceEventsRequest(globalDevId, globalUserToken);

                if (respGetDevEvents.request === 'getDevEvents' && respGetDevEvents.message.status === 'success') {
                    data.dev_events = respGetDevEvents.message.data;
                    data.app_name = globalAppName;
                    data.dev_name = globalDevName;

                    resolve({ request: 'getDevEvents', message: { status: 'success', data: data } });
                } else {
                    resolve({ request: 'getDevEvents', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'getDevFrames') {
                let data = {};

                const respGetDevFrames = await chirpStackServices.getDeviceFramesRequest(globalDevId, globalUserToken);

                if (respGetDevFrames.request === 'getDevFrames' && respGetDevFrames.message.status === 'success') {
                    data.dev_frames = respGetDevFrames.message.data;
                    data.app_name = globalAppName;
                    data.dev_name = globalDevName;

                    resolve({ request: 'getDevFrames', message: { status: 'success', data: data } });
                } else {
                    resolve({ request: 'getDevFrames', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'getDevInfo') {
                let data = {};

                const respGetDevConfig = await chirpStackServices.getDeviceConfigurationRequest(globalDevId, globalUserToken);

                if (respGetDevConfig.request === 'getDevice' && respGetDevConfig.message.status === 'success') {
                    const respDevProfileList = await chirpStackServices.deviceProfilesListRequest(globalTenantId, globalUserToken);

                    if (respDevProfileList.request === 'dispDevProfiles' && respDevProfileList.message.status === 'success') {
                        const respGetDevKey = await chirpStackServices.getDeviceKeyRequest(globalDevId, globalUserToken);

                        if (respGetDevKey.request === 'getDevKey' && respGetDevKey.message.status === 'success') {
                            const respGetDevActivation = await chirpStackServices.getDeviceActivationRequest(globalDevId, globalUserToken);

                            if (respGetDevActivation.request === 'getDevActivation' && respGetDevActivation.message.status === 'success') {
                                data.dev_config = respGetDevConfig.message.data;
                                data.dev_profilesList = respDevProfileList.message.data;
                                data.dev_key = respGetDevKey.message.data;
                                data.dev_activation = respGetDevActivation.message.data;
                                data.app_name = globalAppName;

                                resolve({ request: 'getDevInfo', message: { status: 'success', data: data } });
                            } else {
                                resolve({ request: 'getDevInfo', message: { status: 'failed', data: undefined } });
                            }
                        } else {
                            resolve({ request: 'getDevInfo', message: { status: 'failed', data: undefined } });
                        }
                    } else {
                        resolve({ request: 'getDevInfo', message: { status: 'failed', data: undefined } });
                    }
                } else {
                    resolve({ request: 'getDevInfo', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'getDevQueues') {
                let data = {};

                const respGetDevQueue = await chirpStackServices.getQueueItemsRequest(globalDevId, globalUserToken);

                if (respGetDevQueue.request === 'getDevQueues' && respGetDevQueue.message.status === 'success') {
                    data.dev_queues = respGetDevQueue.message.data;
                    data.app_name = globalAppName;
                    data.dev_name = globalDevName;

                    resolve({ request: 'getDevQueues', message: { status: 'success', data: data } });
                } else {
                    resolve({ request: 'getDevQueues', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'loginByEmail') {
                const respFromApiToken = await dataBaseServices.getApiTokenFromDB();

                if (respFromApiToken.request === 'getApiToken' && respFromApiToken.message.status === 'success') {
                    const respFromLoginUser = await chirpStackServices.loginUserRequest(values.message.data, respFromApiToken.message.data[0].cs_token);

                    if (respFromLoginUser.request === 'loginUser' && respFromLoginUser.message.status === 'success') {
                        globalUserToken = respFromLoginUser.message.data.jwt;

                        const respFromProfileUser = await chirpStackServices.profileUserRequest(globalUserToken);

                        if (respFromProfileUser.request === 'profileUser' && respFromProfileUser.message.status === 'success') {
                            globalUserId = respFromProfileUser.message.data.user_profile.user.id;

                            if (respFromProfileUser.message.data.user_profile.tenantsList.length > 0) {
                                globalTenantId = respFromProfileUser.message.data.user_profile.tenantsList[0].tenantId;

                            } else {
                                globalUserToken = respFromApiToken.message.data[0].cs_token;
                                globalTenantId = await dataBaseServices.getCSTenantIdFromDB();
                            }
                            const respFromGetTenant = await chirpStackServices.getTenantProfileRequest(globalTenantId, respFromApiToken.message.data[0].cs_token);
                            globalUserName = respFromGetTenant.message.data.tenant.name

                            console.log("USER NAME: ", globalUserName);
                            console.log("USER ID: ", globalUserId);
                            console.log("USER TENANT ID: ", globalTenantId);
                            console.log("USER TOKEN: ", globalUserToken);

                            resolve({ request: 'loginByEmail', message: { status: 'success', data: undefined } });
                        } else {
                            resolve({ request: 'loginByEmail', message: { status: 'failed', data: undefined } });
                        }
                    } else {
                        resolve({ request: 'loginByEmail', message: { status: 'failed', data: undefined } });
                    }
                } else {
                    resolve({ request: 'loginByEmail', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'loginByUname') {
                let data = {
                    user_em: undefined,
                    user_pw: values.message.data.user_pw
                }
                const respFromApiToken = await dataBaseServices.getApiTokenFromDB();

                if (respFromApiToken.request === 'getApiToken' && respFromApiToken.message.status === 'failed') {
                    resolve({ request: 'register', message: { status: 'failed', data: undefined } });
                }
                else if (respFromApiToken.request === 'getApiToken' && respFromApiToken.message.status === 'success') {
                    const respFromTenantList = await chirpStackServices.getTenantsListRequest(respFromApiToken.message.data[0].cs_token);

                    if (respFromTenantList.request === 'getTenantsList' && respFromTenantList.message.status === 'success') {
                        const resultCheckUserName = await checkUserName(values.message.data.user_un, respFromTenantList.message.data);

                        if (resultCheckUserName.request === 'checkUserName' && resultCheckUserName.message.status === 'failed') {
                            const respFromUserInTenant = await chirpStackServices.getUserInTenantRequest(resultCheckUserName.message.data.tenant_id, respFromApiToken.message.data[0].cs_token);

                            if (respFromUserInTenant.request === 'getUserInTn' && respFromUserInTenant.message.status === 'success') {
                                data.user_em = respFromUserInTenant.message.data[0].email;
                            } else {
                                resolve({ request: 'loginByUname', message: { status: 'failed', data: undefined } });
                            }
                        } else {
                            resolve({ request: 'loginByUname', message: { status: 'failed', data: undefined } });
                        }
                    } else {
                        resolve({ request: 'loginByUname', message: { status: 'failed', data: undefined } });
                    }
                }

                const respFromLoginUser = await chirpStackServices.loginUserRequest(data, respFromApiToken.message.data[0].cs_token);

                if (respFromLoginUser.request === 'loginUser' && respFromLoginUser.message.status === 'success') {
                    globalUserToken = respFromLoginUser.message.data.jwt;

                    const respFromProfileUser = await chirpStackServices.profileUserRequest(globalUserToken);

                    if (respFromProfileUser.request === 'profileUser' && respFromProfileUser.message.status === 'success') {
                        globalUserId = respFromProfileUser.message.data.user_profile.user.id;

                        if (respFromProfileUser.message.data.user_profile.tenantsList.length > 0) {
                            globalTenantId = respFromProfileUser.message.data.user_profile.tenantsList[0].tenantId;
                        } else {
                            globalUserToken = respFromApiToken.message.data[0].cs_token;
                            globalTenantId = "52f14cd4-c6f1-4fbd-8f87-4025e1d49242";
                        }
                        const respFromGetTenant = await chirpStackServices.getTenantProfileRequest(globalTenantId, respFromApiToken.message.data[0].cs_token);
                        globalUserName = respFromGetTenant.message.data.tenant.name

                        console.log("USER NAME: ", globalUserName);
                        console.log("USER ID: ", globalUserId);
                        console.log("USER TENANT ID: ", globalTenantId);
                        console.log("USER TOKEN: ", globalUserToken);

                        resolve({ request: 'loginByUname', message: { status: 'success', data: undefined } });
                    } else {
                        resolve({ request: 'loginByUname', message: { status: 'failed', data: undefined } });
                    }
                } else {
                    resolve({ request: 'loginByUname', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'logout') {
                logout();

                resolve({ request: 'logout', message: { status: 'success', data: undefined } });
            }
            else if (values.request === 'postDevConfigConfirm') {
                const respPostDevConfig = await chirpStackServices.postDeviceConfigurationRequest(values.message.data, globalAppId, globalUserToken);

                if (respPostDevConfig.request === 'postDev' && respPostDevConfig.message.status === 'success') {
                    const respPostDevKey = await chirpStackServices.postDeviceKeyRequest(values.message.data, globalUserToken);

                    if (respPostDevKey.request === 'postDevKey' && respPostDevKey.message.status === 'success') {

                        resolve({
                            request: 'postDevConfigConfirm', message: {
                                status: 'success',
                                data: {
                                    post_devConfig: respPostDevConfig.message.data,
                                    post_devKey: respPostDevConfig.message.data
                                }
                            }
                        });
                    } else {
                        resolve({ request: 'postDevConfigConfirm', message: { status: 'failed', data: undefined } });
                    }
                } else {
                    resolve({ request: 'postDevConfigConfirm', message: { status: 'failed', data: undefined } });
                }
            }
            else if (values.request === 'register') {
                const respFromApiToken = await dataBaseServices.getApiTokenFromDB();

                if (respFromApiToken.request === 'getApiToken' && respFromApiToken.message.status === 'failed') {
                    resolve({ request: 'register', message: { status: 'failed', data: undefined } });
                    return;
                }
                else if (respFromApiToken.request === 'getApiToken' && respFromApiToken.message.status === 'success') {
                    const respFromTenantList = await chirpStackServices.getTenantsListRequest(respFromApiToken.message.data[0].cs_token);
                    const respFromUserList = await chirpStackServices.getUsersListRequest(respFromApiToken.message.data[0].cs_token);

                    if (respFromTenantList.request === 'getTenantsList' && respFromTenantList.message.status === 'success'
                        && respFromUserList.request === 'getUsersList' && respFromUserList.message.status === 'success') {
                        const resultCheckUserName = await checkUserName(values.message.data.user_un, respFromTenantList.message.data);

                        if (resultCheckUserName.request === 'checkUserName' && resultCheckUserName.message.status === 'success') {
                            const resultCheckUserEmail = await checkUserEmail(values.message.data.user_em, respFromUserList.message.data);

                            if (resultCheckUserEmail.request === 'checkUserEmail' && resultCheckUserEmail.message.status === 'success') {
                                // Username and email can be used to sign up.
                                // do nothing
                            } else {
                                resolve({ request: 'register', message: { status: 'failed', data: { check_em: true } } });
                                return;
                            }
                        } else {
                            resolve({ request: 'register', message: { status: 'failed', data: { check_un: true } } });
                            return;
                        }
                    } else {
                        resolve({ request: 'register', message: { status: 'failed', data: undefined } });
                        return;
                    }
                }

                const respFromCreateUser = await chirpStackServices.createUser(values.message.data, respFromApiToken.message.data[0].cs_token);

                if (respFromCreateUser.request === 'createUser' && respFromCreateUser.message.status === 'success') {
                    const respFromCreateTenant = await chirpStackServices.createTenant(respFromCreateUser.message.data, respFromApiToken.message.data[0].cs_token);

                    if (respFromCreateTenant.request === 'createTenant' && respFromCreateTenant.message.status === 'success') {
                        tenant_id = respFromCreateTenant.message.data.tenant_id;
                        const respFromCreateTenantUser = await chirpStackServices.createTenantUser(respFromCreateTenant.message.data, respFromApiToken.message.data[0].cs_token);

                        if (respFromCreateTenantUser.request === 'createTenantUser' && respFromCreateTenantUser.message.status === 'success') {
                            const respFromAddDevProf = await chirpStackServices.addDeviceProfilesRequest(respFromCreateTenant.message.data.tenant_id, respFromApiToken.message.data[0].cs_token);

                            if (respFromAddDevProf.request === 'addDevProfs' && respFromAddDevProf.message.status === 'success') {
                                // Setup ChirpStack for user completed
                                // do nothing
                            } else {
                                resolve({ request: 'register', message: { status: 'failed', data: undefined } });
                                return;
                            }
                        } else {
                            resolve({ request: 'register', message: { status: 'failed', data: undefined } });
                            return;
                        }
                    } else {
                        resolve({ request: 'register', message: { status: 'failed', data: undefined } });
                        return;
                    }
                } else {
                    resolve({ request: 'register', message: { status: 'failed', data: undefined } });
                    return;
                }

                const respFromCreateUserDb = await dataBaseServices.createUserInfluxDb(values.message.data,
                    respFromApiToken.message.data[0].influx_token);

                if (respFromCreateUserDb.request === 'postCreateUser' && respFromCreateUserDb.message.status === 'success') {
                    const respFromUpdatePw = await dataBaseServices.updatePasswordInfluxDb(respFromCreateUserDb.message.data, values.message.data,
                        respFromApiToken.message.data[0].influx_token);

                    if (respFromUpdatePw.request === 'postUpPw' && respFromUpdatePw.message.status === 'success') {

                        resolve({ request: 'register', message: { status: 'success', data: undefined } });
                    } else {
                        resolve({ request: 'register', message: { status: 'failed', data: undefined } });
                        return;
                    }
                } else {
                    resolve({ request: 'register', message: { status: 'failed', data: undefined } });
                    return;
                }
            }
            else {
                resolve({ request: 'unknow', message: { status: 'failed', data: 'Unknow request from Client.' } });
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
                resolve({ request: 'checkUserEmail', message: { status: 'failed', data: undefined } });
            } else {
                resolve({ request: 'checkUserEmail', message: { status: 'success', data: undefined } });
            }
        });
    } catch (error) {
        console.log(error);
    }
}
async function checkUserName(username, nameList) {
    try {
        return new Promise((resolve, reject) => {
            if (username === 'admin') {
                const adminExist = nameList.find(user => user.name === 'ChirpStack');

                resolve({ request: 'checkUserName', message: { status: 'failed', data: { tenant_id: adminExist.id } } });
            }

            const userExists = nameList.find(user => user.name === username);

            if (userExists) {
                resolve({ request: 'checkUserName', message: { status: 'failed', data: { tenant_id: userExists.id } } });
            } else {
                resolve({ request: 'checkUserName', message: { status: 'success', data: undefined } });
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