//---------------------------------------------------------------------//
//--------------------------Database Services--------------------------//
//---------------------------------------------------------------------//
const { Client } = require("pg");
//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
//---------------------------------------------------------------------//
getCSTenantIdFromDB();
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
async function getNetworkApiTokenFromDB() { 
  try {
    const client = new Client({
      database: 'my_web_db',
      user: 'webapp',
      password: '1q2w3e4r@30',
      host: '202.28.95.234',
      port: 5432,
    });

    return new Promise(async (resolve, reject) => {
      const query = "SELECT * FROM network_api_token";
  
      await client.connect();

      const results = await client.query(query);
  
      await client.end();

      resolve({ request: 'getNwApiToken', message: { 
        status: 'success', 
        data: results.rows }
      });
    });
  } catch (error) {
    resolve({ request: 'getNwApiToken', message: {
      status: 'failed', 
      data: error }
    });
  }
}
//---------------------------------------------------------------------// 
module.exports = {
  getCSTenantIdFromDB,
  getNetworkApiTokenFromDB
};
//---------------------------------------------------------------------//
