//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
const nodemailer = require('nodemailer');
const chirpStackService = require('./chirpstack_service.js');
const dataBaseService = require('./database_service.js');
//---------------------------------------------------------------------//
async function authenticatedRequest(message) {
    const respFromUserProfile = await chirpStackService.getUserProfileRequest(message);

    if (respFromUserProfile.user.id === 'error') {
        return { status: 'failed' };
    }

    globalUserToken = message.user_token;
    globalUserId = respFromUserProfile.user.id;

    let tenantId;
    if (respFromUserProfile.tenantsList.length > 0) {
        tenantId = respFromUserProfile.tenantsList[0].tenantId;
    } else {
        const respFromCSTenantId = await dataBaseService.getChirpStackTenantIdRequest();
        tenantId = respFromCSTenantId.rows[0].tenant_id;
        globalUserToken = respFromApiToken.rows[0].cs_token;
    }

    const respFromTennatProfile = await chirpStackService.getTenantProfileRequest(tenantId, message.user_token);
    globalUserName = respFromTennatProfile.tenant.name;

    return {
        status: 'success',
        user_token: message.user_token,
        user_un: respFromTennatProfile.tenant.name,
        user_id: respFromUserProfile.user.id,
        tenant_id: tenantId,
    };
}
//---------------------------------------------------------------------//
async function addApplicationRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromApiToken = await dataBaseService.getApiTokenRequest();

            if (message.app_intg === 'influxDB') {
                const respFromAddApp = await chirpStackService.addApplicationRequest(message);
                const respFromCreateOrgInfluxDb = await dataBaseService.createOrgInfluxDbRequest(message, respFromApiToken);
                const respFromCreateBuckets = await dataBaseService.createBucketInfluxDbRequest(respFromCreateOrgInfluxDb, message.user_un, respFromApiToken);

                const respFromGetUserInf = await dataBaseService.getInfluxDbUserListRequest(respFromApiToken);

                const matchingUser = respFromGetUserInf.users.find(user => user.name === message.user_un);

                if (matchingUser) {
                    console.log(`User ${message.user_un} found! ID: ${matchingUser.id}`);

                    const respFromAddMems = await dataBaseService.addMemberInfluxDbRequest(respFromCreateOrgInfluxDb, matchingUser.id, respFromApiToken);

                    // Setup InfluxDB completed
                    // .....
                    const respFromIntgApp = await chirpStackService.createInfluxDbIntegrationRequest(respFromAddApp.id,
                        respFromCreateOrgInfluxDb.org_name, respFromCreateBuckets.bucket_name,
                        respFromApiToken.rows[0].cs_token, respFromApiToken.rows[0].influx_token);

                    resolve(respFromIntgApp);
                }
            } else {
                const respFromAddApp = await chirpStackService.addApplicationRequest(message);

                resolve(respFromAddApp);
            }
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function addDeviceRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromAddDev = await chirpStackService.addDeviceRequest(message);
            const respFromAddKeyDev = await chirpStackService.addDeviceKeyRequest(message);

            resolve(respFromAddKeyDev);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function deleteApplicationRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromDelApp = await chirpStackService.deleteApplicationRequest(message);

            resolve(respFromDelApp);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function deleteDeviceRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromDelDev = await chirpStackService.deleteDeviceRequest(message);

            resolve(respFromDelDev);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function enqueueDeviceRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromEnqueue = await chirpStackService.enqueueDeviceRequest(message);

            resolve(respFromEnqueue);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function flushQueueRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromFlushQueue = await chirpStackService.flushQueueRequest(message);
            const respFromGetQueue = await chirpStackService.getQueueItemRequest(message);

            resolve(respFromGetQueue);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function getApplicationRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromGetApp = await chirpStackService.getApplicationRequest(message);
            resolve(respFromGetApp);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function getApplicationMenuRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromAppsList = await chirpStackService.getApplicationListRequest(message);
            resolve(respFromAppsList);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function getDashboardMenuRequest(message) {
    try {
        let data = {
            gateways_list: {},
            gateways_summary: {},
            devs_summary: {}
        };

        return new Promise(async (resolve, reject) => {
            const respFromApiToken = await dataBaseService.getApiTokenRequest();
            const respFromTnId = await dataBaseService.getChirpStackTenantIdRequest();

            const respFromAppsList = await chirpStackService.getApplicationListRequest(message);
            data.apps_list = respFromAppsList;

            let index = 0;
            for (const app of respFromAppsList.resultList) {
                const respFromDevList = await chirpStackService.getDeviceListRequest(app.id, message.user_token);

                data.apps_list.resultList[index].totalCount_devs = respFromDevList.totalCount;
                index++;
            }

            const respFromGatewayList = await chirpStackService.getGatewayListRequest(respFromTnId, respFromApiToken);
            data.gateways_list = respFromGatewayList;

            const respFromGetewaysSummary = await chirpStackService.getGatewaySummaryRequest(respFromTnId, respFromApiToken);
            data.gateways_summary = respFromGetewaysSummary;

            const respFromDevicesSummary = await chirpStackService.getDeviceSummaryRequest(message, message.user_token);
            data.devs_summary = respFromDevicesSummary;

            resolve(data);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function getDevicInfoRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromGetDev = await chirpStackService.getDeviceRequest(message);
            const respFromGetDevKey = await chirpStackService.getDeviceKeyRequest(message);
            const respFromGetDevProfile = await chirpStackService.getDeviceProfileListRequest(message);

            let result = {
                get_dev: respFromGetDev, 
                get_devKey: respFromGetDevKey,
                get_devProfiles: respFromGetDevProfile
            }
            resolve(result);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function getDeviceListRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromDevList = await chirpStackService.getDeviceListRequest(message.app_id, message.user_token);
            resolve(respFromDevList);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function getDeviceProfileMenuRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromDevProfList = await chirpStackService.getDeviceProfileListRequest(message);
            resolve(respFromDevProfList);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function getEventRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromDevEvent = await chirpStackService.getDeviceEventRequest(message);
            resolve(respFromDevEvent);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function getFrameRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromDevFrame = await chirpStackService.getDeviceFrameRequest(message);
            resolve(respFromDevFrame);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function getLinkMetricRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromLinkMetric = await chirpStackService.getLinkMetricRequest(message);
            resolve(respFromLinkMetric);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function loginByEmailRequest(message) {
    try {
        const respFromApiToken = await dataBaseService.getApiTokenRequest();
        const respFromUserLogin = await chirpStackService.postLoginUserRequest(message, respFromApiToken);

        if (respFromUserLogin.jwt === 'error') {
            return { status: 'failed' };
        }

        return {
            status: 'success',
            user_token: respFromUserLogin.jwt
        };
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function loginByNameRequest(message) {
    try {
        const respFromApiToken = await dataBaseService.getApiTokenRequest();
        const respFromTenantList = await chirpStackService.getTenantsListRequest(respFromApiToken);
        const resultCheckUserName = await checkUserName(message, respFromTenantList);

        if (resultCheckUserName.id === 'null') {
            return { status: 'failed' };
        }
        const respFromUserInTenant = await chirpStackService.getUserInTenantRequest(resultCheckUserName, respFromApiToken);

        message.user_em = respFromUserInTenant.resultList[0].email;
        const respFromUserLogin = await chirpStackService.postLoginUserRequest(message, respFromApiToken);

        if (respFromUserLogin.jwt === 'error') {
            return { status: 'failed' };
        }

        return {
            status: 'success',
            user_token: respFromUserLogin.jwt
        };
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function registerRequest(message) {
    try {
        let checkUsernameAndEmail = { status: 'failed', check_un: 'null', check_em: 'null' };

        const respFromApiToken = await dataBaseService.getApiTokenRequest();
        const respFromTenantList = await chirpStackService.getTenantsListRequest(respFromApiToken);
        const respFromUserList = await chirpStackService.getUserListRequest(respFromApiToken);
        const resultCheckUserName = await checkUserName(message, respFromTenantList);
        const resultCheckUserEmail = await checkUserEmail(message, respFromUserList);

        if (resultCheckUserName.id != 'null') {
            checkUsernameAndEmail.check_un = 'exist';
        }
        if (resultCheckUserEmail.email != 'null') {
            checkUsernameAndEmail.check_em = 'exist';
        }
        if (checkUsernameAndEmail.check_un === 'exist' || checkUsernameAndEmail.check_em === 'exist') {
            return checkUsernameAndEmail;
        }
        // Username and email can be used to sign up.

        const respFromCreateUser = await chirpStackService.createUserRequest(message, respFromApiToken);
        const respFromCreateTenant = await chirpStackService.createTenantRequest(respFromCreateUser, respFromApiToken);
        const respFromAddUserInTenant = await chirpStackService.addUserInTenantRequest(respFromCreateTenant, respFromApiToken);
        const respFromAddDevProf = await chirpStackService.addDeviceProfileRequest(respFromCreateTenant, respFromApiToken);

        if (respFromCreateUser === 'failed' || respFromCreateTenant === 'failed'
            || respFromAddUserInTenant === 'failed' || respFromAddDevProf === 'failed') {
            checkUsernameAndEmail.check_un = 'failed';
            checkUsernameAndEmail.check_em = 'failed';
            return checkUsernameAndEmail;
        }
        // Setup ChirpStack for user completed

        const respFromCreateUserDb = await dataBaseService.createUserInfluxDbRequest(message, respFromApiToken);
        const respFromUpdatePw = await dataBaseService.updatePasswordInfluxDbRequest(respFromCreateUserDb, message, respFromApiToken);
        // Setup InfluxDBv2 for user completed

        if (respFromCreateUserDb.status === 'failed' || respFromUpdatePw.status === 'failed') {
            checkUsernameAndEmail.check_un = 'failed';
            checkUsernameAndEmail.check_em = 'failed';
            return checkUsernameAndEmail;
        }
        return { status: 'success' };
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function reloadQueueRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromReQueue = await chirpStackService.getQueueItemRequest(message);

            resolve(respFromReQueue);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function updateApplicationRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromUpApp = await chirpStackService.updateApplicationRequest(message);
            resolve(respFromUpApp);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function updateDeviceRequest(message) {
    try {
        return new Promise(async (resolve, reject) => {
            const respFromUpDev = await chirpStackService.updateDeviceRequest(message);
            const respFromUpDevKey = await chirpStackService.updateDeviceKeyRequest(message);

            resolve(respFromUpDevKey);
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
module.exports = {
    authenticatedRequest,
    addApplicationRequest,
    addDeviceRequest,
    deleteApplicationRequest,
    deleteDeviceRequest,
    enqueueDeviceRequest,
    flushQueueRequest,
    getApplicationRequest,
    getApplicationMenuRequest,
    getDevicInfoRequest,
    getDashboardMenuRequest,
    getDeviceListRequest,
    getDeviceProfileMenuRequest,
    getEventRequest,
    getFrameRequest,
    getLinkMetricRequest,
    loginByEmailRequest,
    loginByNameRequest,
    registerRequest,
    reloadQueueRequest,
    updateApplicationRequest,
    updateDeviceRequest
};
//---------------------------------------------------------------------//
//----------------------------COMMON ZONE------------------------------//
//---------------------------------------------------------------------//
async function checkUserEmail(em, emList) {
    try {
        return new Promise((resolve, reject) => {
            const emailExists = emList.resultList.find(emails => emails.email === em.user_em);

            if (emailExists) {
                console.log('Check email:\n', emailExists);
                resolve(emailExists);
            } else {
                console.log('Check email:\nThis email does not exist.');
                resolve({ email: 'null' });
            }
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
async function checkUserName(username, nameList) {
    try {
        return new Promise((resolve, reject) => {
            if (username.user_un === 'admin') {
                const adminExist = nameList.resultList.find(user => user.name === 'ChirpStack');

                console.log('Check name:\n', adminExist);
                resolve(adminExist);
            }

            const userExists = nameList.resultList.find(user => user.name === username.user_un);

            if (userExists) {
                console.log('Check name:\n', userExists);
                resolve(userExists);
            } else {
                console.log('Check name:\nThis username does not exist.');
                resolve({ id: 'null' });
            }
        });
    } catch (error) {
        console.log(error);
    }
}
//---------------------------------------------------------------------//
