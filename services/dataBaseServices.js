//---------------------------------------------------------------------//
//--------------------------Database Services--------------------------//
//---------------------------------------------------------------------//
const { Client } = require("pg");
const axios = require('axios');

const INFLUX_URL = 'http://202.28.95.234:8086';
//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
//---------------------------------------------------------------------//
async function createOrgInfluxDb(uN, INFLUX_API_TOKEN) {
  try {
    const org = {
      name: generateOrgName(uN),
      description: 'Organization: ' + uN,
    };

    const headers = {
      Authorization: `Token ${INFLUX_API_TOKEN}`,
      'Content-Type': 'application/json',
    };

    return new Promise(async (resolve, reject) => {
      axios.post(`${INFLUX_URL}/api/v2/orgs`, org, { headers })
        .then((response) => {
          console.log('Organization created:', response.data);
          
          resolve({ request: 'postOrg', message: { status: 'success', data: response.data , org_name: org.name}});
        })
        .catch((error) => {
          resolve({ request: 'postOrg', message: { status: 'failed', data: error }});
        });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function createBucketInfluxDb(org, uN, INFLUX_API_TOKEN) {
  try {
    const bucket = {
      name: generateBucketName(uN),
      description: 'A bucket holding data from ChirpStack',
      orgID: org.id,
    };
    
    const headers = {
      Authorization: `Token ${INFLUX_API_TOKEN}`,
      'Content-Type': 'application/json',
    };

    return new Promise(async (resolve, reject) => {
      axios.post(`${INFLUX_URL}/api/v2/buckets`, bucket, { headers })
        .then((response) => {
          console.log('Bucket created:', response.data);

          resolve({ request: 'postBucket', message: { status: 'success', data: response.data, bucket_name: bucket.name }});
        })
        .catch((error) => {
          resolve({ request: 'postBucket', message: { status: 'failed', data: error }});
        });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------// 
async function createUserInfluxDb(items, INFLUX_API_TOKEN) {
  try {
    const user = {
      name: items.user_un,
      status: 'active',
    };
    
    const headers = {
      Authorization: `Token ${INFLUX_API_TOKEN}`,
      'Content-Type': 'application/json',
    };

    return new Promise(async (resolve, reject) => {
      axios.post(`${INFLUX_URL}/api/v2/users`, user, { headers })
        .then((response) => {
          console.log('User created:', response.data);

          resolve({ request: 'postCreateUser', message: { status: 'success', data: response.data }});
        })
        .catch((error) => {
          resolve({ request: 'postCreateUser', message: { status: 'failed', data: error }});
        });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function updatePasswordInfluxDb(usr, items, INFLUX_API_TOKEN) {
  try {
    const password = {
      password: items.user_pw
    };
    
    const headers = {
      Authorization: `Token ${INFLUX_API_TOKEN}`,
      'Content-Type': 'application/json',
    };
    
    return new Promise(async (resolve, reject) => {
      axios.post(`${INFLUX_URL}/api/v2/users/${usr.id}/password`, password, { headers })
        .then((response) => {
          console.log('Password updated.', response.data);

          resolve({ request: 'postUpPw', message: { status: 'success', data: response.data }});
        })
        .catch((error) => {
          resolve({ request: 'postUpPw', message: { status: 'failed', data: error }});
        });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function addMemberInfluxDb(org, usrId, INFLUX_API_TOKEN) {
  try {
    const member = {
      id: usrId,
    };
    
    const headers = {
      Authorization: `Token ${INFLUX_API_TOKEN}`,
      'Content-Type': 'application/json',
    };

    return new Promise(async (resolve, reject) => {
      axios.post(`${INFLUX_URL}/api/v2/orgs/${org.id}/owners`, member, { headers })
        .then((response) => {
          console.log('Add member completed.', response.data);

          resolve({ request: 'postAddMember', message: { status: 'success', data: response.data }});
        })
        .catch((error) => {
          resolve({ request: 'postAddMember', message: { status: 'failed', data: error }});
        });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------// 
async function addRoleInfluxDb(org, usrId, INFLUX_API_TOKEN) {
  try {
    const owner = {
      id: usrId,
    };
    
    const headers = {
      Authorization: `Token ${INFLUX_API_TOKEN}`,
      'Content-Type': 'application/json',
    };

    return new Promise(async (resolve, reject) => {
      axios.post(`${INFLUX_URL}/api/v2/orgs/${org.id}/owners`, owner, { headers })
        .then((response) => {
          console.log('Add role completed.', response.data);

          resolve({ request: 'postAddRole', message: { status: 'success', data: response.data }});
        })
        .catch((error) => {
          resolve({ request: 'postAddRole', message: { status: 'failed', data: error }});
        });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------// 
async function getInfluxDbUser(INFLUX_API_TOKEN) {
  try {
    const headers = {
      Authorization: `Token ${INFLUX_API_TOKEN}`,
      'Content-Type': 'application/json',
    };

    return new Promise(async (resolve, reject) => {
      axios.get(`${INFLUX_URL}/api/v2/users`, { headers })
        .then((response) => {
          console.log('User list completed.\n', response.data);

          resolve({ request: 'getInfluxUser', message: { status: 'success', data: response.data }});
        })
        .catch((error) => {
          resolve({ request: 'getInfluxUser', message: { status: 'failed', data: error }});
        });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------// 
async function getApiTokenFromDB() { 
  try {
    const client = new Client({
      database: 'my_web_db',
      user: 'webapp',
      password: '1q2w3e4r@30',
      host: '202.28.95.234',
      port: 5432,
    });

    return new Promise(async (resolve, reject) => {
      const query = "SELECT * FROM api_tokens";
  
      await client.connect();

      const results = await client.query(query);
  
      await client.end();

      resolve({ request: 'getApiToken', message: { 
        status: 'success', 
        data: results.rows }
      });
    });
  } catch (error) {
    resolve({ request: 'getApiToken', message: {
      status: 'failed', 
      data: error }
    });
  }
}
//---------------------------------------------------------------------// 
async function getCSTenantIdFromDB() {
  try {
    const client = new Client({
      database: 'my_web_db',
      user: 'webapp',
      password: '1q2w3e4r@30',
      host: '202.28.95.234',
      port: 5432,
    });

    return new Promise(async (resolve, reject) => {
      const query = "SELECT * FROM chirpstack_tenant_id";
  
      await client.connect();

      const results = await client.query(query);
  
      await client.end();

      resolve({ request: 'getCSTenantId', message: { 
        status: 'success', 
        data: results.rows }
      });
    });
  } catch (error) {
    resolve({ request: 'getCSTenantId', message: { 
      status: 'failed', 
      data: error }
    });
  }
}
//---------------------------------------------------------------------// 
module.exports = {
  createOrgInfluxDb,
  createBucketInfluxDb,
  createUserInfluxDb,
  updatePasswordInfluxDb,
  addMemberInfluxDb,
  addRoleInfluxDb,
  getApiTokenFromDB,
  getCSTenantIdFromDB,
  getInfluxDbUser
};
//---------------------------------------------------------------------//
//----------------------------COMMON ZONE------------------------------//
//---------------------------------------------------------------------//
function generateOrgName(username) {
  var random16Bit = generateRandom16Bit().toString(16);
  var orgName = 'org-' + random16Bit + '-' + username;
  return orgName;
}
function generateBucketName(username) {
  var random16Bit = generateRandom16Bit().toString(16);
  var bucketName = 'data_device_' + random16Bit + '_' + username;
  return bucketName;
}
function generateRandom16Bit() {
  return Math.floor(Math.random() * 65536);
}
//---------------------------------------------------------------------//
