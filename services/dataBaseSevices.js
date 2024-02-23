//---------------------------------------------------------------------// 
//--------------------------Database Services--------------------------//
//---------------------------------------------------------------------//
const { Client } = require("pg");
//---------------------------------------------------------------------//
const client = new Client({
  database: 'my_web_db',
  user: 'webapp',
  password: '1q2w3e4r@30',
  host: '202.28.95.234',
  port: 5432,
});
//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
//---------------------------------------------------------------------//
async function getGetewayFromDB() { 
  try {
    return new Promise(async (resolve, reject) => {
      const query = "SELECT * FROM gateway_list";
  
      await client.connect();

      const results = await client.query(query);
  
      await client.end();
  
      console.log(results);

      resolve({ request: 'getGw', message: { 
        status: 'success', 
        data: results.rows }
      });
    });
  } catch (error) {
    resolve({ request: 'getGw', message: { 
      status: 'failed', 
      data: error }
    });
  }
}
//---------------------------------------------------------------------// 
async function getNetworkApiTokenFromDB() { 
  try {
    return new Promise(async (resolve, reject) => {
      const query = "SELECT * FROM network_api_token";
  
      await client.connect();

      const results = await client.query(query);
  
      await client.end();
  
      console.log(results);

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
  getGetewayFromDB,
  getNetworkApiTokenFromDB
};
//---------------------------------------------------------------------//
