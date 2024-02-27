//---------------------------------------------------------------------//
//--------------------------Database Services--------------------------//
//---------------------------------------------------------------------//
const { Client } = require("pg");
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
//---------------------------------------------------------------------//
let items = {
  user_name: "testApi",
  user_pw: "coe30",
}
createInfluxDbForUser(items);
async function createInfluxDbForUser(items) {
  try {
    // URL ของ InfluxDB
    const url = 'http://202.28.95.234:8086';

    // Token ของ InfluxDB
    const token = 'd-NzVHUQujTiPEKdtOU9qvJngWtbbeN2GuaHN2-hnNj___WlktEBjHBBJ6nv4jfOx7UwXEarMxobzs5XO9H6fA==';
    
    // สร้าง Client
    const client = new InfluxDB({ url, token });

    return new Promise(async (resolve, reject) => {
      // สร้าง Organization
      const org = await client..orgs.create('org-' + items.user_name);
      
      // แสดงข้อมูล Organization
      console.log('Organization:', org);
      
      // สร้าง Bucket
      const bucket = await client.buckets.create('db-' + items.user_name, {
        orgID: org.id,
      });
      
      // แสดงข้อมูล Bucket
      console.log('Bucket:', bucket);
      
      // สร้าง User
      const user = await client.users.create({
        orgID: org.id,
        username: items.user_name,
        password: items.user_pw,
        permissions: {
          orgs: [
            {
              id: org.id,
              role: 'owner',
            },
          ],
        },
      });
      
      // แสดงข้อมูล User
      console.log('User:', user);
      
      // ปิด Client
      client.close();

      resolve({ request: 'createInfluxForUser', message: { 
        status: 'success', 
        data: user }
      });
    });
  } catch (error) {
    resolve({ request: 'createInfluxForUser', message: {
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
  createInfluxDbForUser,
  getCSTenantIdFromDB,
  getNetworkApiTokenFromDB
};
//---------------------------------------------------------------------//
