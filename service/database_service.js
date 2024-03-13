//---------------------------------------------------------------------//
//--------------------------Database Services--------------------------//
//---------------------------------------------------------------------//
const { Client } = require("pg");
const axios = require('axios');

const INFLUX_URL = 'http://202.28.95.234:8086';
//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
//---------------------------------------------------------------------//
async function addMemberInfluxDbRequest(org, usrId, INFLUX_API_TOKEN) {
  try {
    const member = {
      id: usrId,
    };

    const headers = {
      Authorization: `Token ${INFLUX_API_TOKEN.rows[0].influx_token}`,
      'Content-Type': 'application/json',
    };

    return new Promise(async (resolve, reject) => {
      axios.post(`${INFLUX_URL}/api/v2/orgs/${org.resp.id}/owners`, member, { headers })
        .then((response) => {
          console.log('Add member completed.', response.data);

          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          resolve('failed');
        });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------// 
async function createBucketInfluxDbRequest(message, uN, INFLUX_API_TOKEN) {
  try {
    return new Promise(async (resolve, reject) => {
      let name = generateBucketName(uN);

      const bucket = {
        name: name,
        description: 'A bucket holding data from ChirpStack',
        orgID: message.resp.id,
      };
  
      const headers = {
        Authorization: `Token ${INFLUX_API_TOKEN.rows[0].influx_token}`,
        'Content-Type': 'application/json',
      };  

      axios.post(`${INFLUX_URL}/api/v2/buckets`, bucket, { headers })
        .then((response) => {
          console.log('Bucket created:', response.data);

          resolve({ resp: response.data, bucket_name: name });
        })
        .catch((error) => {
          console.log(error);
          resolve('failed');
        });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------// 
async function createOrgInfluxDbRequest(message, INFLUX_API_TOKEN) {
  try {
    return new Promise(async (resolve, reject) => {
      let name = generateOrgName(message.user_un);

      const org = {
        name: name,
        description: 'Organization: ' + message.user_un,
      };
  
      const headers = {
        Authorization: `Token ${INFLUX_API_TOKEN.rows[0].influx_token}`,
        'Content-Type': 'application/json',
      };

      axios.post(`${INFLUX_URL}/api/v2/orgs`, org, { headers })
        .then((response) => {
          console.log('Organization created:', response.data);

          resolve({ resp: response.data, org_name: name });
        })
        .catch((error) => {
          console.log(error);
          resolve('failed');
        });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function createUserInfluxDbRequest(message, INFLUX_API_TOKEN) {
  try {
    const user = {
      name: message.user_un,
      status: 'active',
    };

    const headers = {
      Authorization: `Token ${INFLUX_API_TOKEN.rows[0].influx_token}`,
      'Content-Type': 'application/json',
    };

    return new Promise(async (resolve, reject) => {
      axios.post(`${INFLUX_URL}/api/v2/users`, user, { headers })
        .then((response) => {
          console.log('User created:', response.data);

          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          resolve({status: 'failed'});
        });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function updatePasswordInfluxDbRequest(usrId, message, INFLUX_API_TOKEN) {
  try {
    const password = {
      password: message.user_pw
    };

    const headers = {
      Authorization: `Token ${INFLUX_API_TOKEN.rows[0].influx_token}`,
      'Content-Type': 'application/json',
    };

    return new Promise(async (resolve, reject) => {
      axios.post(`${INFLUX_URL}/api/v2/users/${usrId.id}/password`, password, { headers })
        .then((response) => {
          console.log('Password updated.', response.data);

          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          resolve({status: 'failed', data: undefined});
        });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
async function getApiTokenRequest() {
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

      const result = await client.query(query);

      await client.end();

      console.log('Get api token has been completed.\n', result);
      resolve(result);
    });
  } catch (error) {
    console.log(error);
    resolve('failed');
  }
}
//---------------------------------------------------------------------//
async function getChirpStackTenantIdRequest() {
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

      const result = await client.query(query);

      await client.end();

      console.log('Get chirpstack tenant id has been completed.\n', result);
      resolve(result);
    });
  } catch (error) {
    console.log(error);
    resolve({status: 'failed'});
  }
}
//---------------------------------------------------------------------//
async function getInfluxDbUserListRequest(INFLUX_API_TOKEN) {
  try {
    const headers = {
      Authorization: `Token ${INFLUX_API_TOKEN.rows[0].influx_token}`,
      'Content-Type': 'application/json',
    };

    return new Promise(async (resolve, reject) => {
      axios.get(`${INFLUX_URL}/api/v2/users`, { headers })
        .then((response) => {
          console.log('User list completed.\n', response.data);

          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          resolve('failed');
        });
    });
  } catch (error) {
    console.log(error);
  }
}
//---------------------------------------------------------------------//
module.exports = {
  addMemberInfluxDbRequest,
  createBucketInfluxDbRequest,
  createOrgInfluxDbRequest,
  createUserInfluxDbRequest,
  updatePasswordInfluxDbRequest,
  getApiTokenRequest,
  getChirpStackTenantIdRequest,
  getInfluxDbUserListRequest,
};
//---------------------------------------------------------------------//
//----------------------------COMMON ZONE------------------------------//
//---------------------------------------------------------------------//
function generateOrgName(username) {
  var random32Bit = generateRandom32Bit().toString(16);
  var orgName = 'org-' + random32Bit + '-' + username;
  return orgName;
}
//---------------------------------------------------------------------//
function generateBucketName(username) {
  var random32Bit = generateRandom32Bit().toString(16);
  var bucketName = 'data_device_' + random32Bit + '_' + username;
  return bucketName;
}
//---------------------------------------------------------------------//
function generateRandom32Bit() {
  return Math.floor(Math.random() * 4294967296);
}
//---------------------------------------------------------------------//
