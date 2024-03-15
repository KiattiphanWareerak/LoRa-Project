# Welcome to LoRa Communication Management Web Application
This project is to develop a web application to manage connections between LoRa devices in the network using the ChirpStack API.

# Getting Started
1. Install Node.JS on your computer.
2. Clone this repository.
```
git clone https://github.com/KiattiphanWareerak/LoRa-Project.git
```
3. Open the terminal in LoRa-Project directory.
4. Run the Web server. (public_server.js)
```
npm run start-web
```
5. Run the Service server. (service_server.js)
```
npm run start-service
```
6. Open your browser and enter ```<Web Server IP Address>:3111```or ```localhost:3111``` if you run in localhost.

# Warning
Before using the web application, please change the IP Address of ChirpStack, PostgreSQL, InfluxDBv2 and Service Endpoint first.
(and check your API TOKEN: ChirpStack, InfluxDBv2)

ChirpStack (chirpstack_service.js):
```
const serverChirpStack = 'CHIRPSTACK IP ADDRESS';
```

InfluxDBv2 (database_service.js):
```
const INFLUX_URL = 'INFLUXDB IP ADDRESS';
```

Postgres (database_service.js):
```
const POSTGRES_DATABASE = 'YOUR DATABASE';
const POSTGRES_USER = 'YOUR USER';
const POSTGRES_PASSWORD = 'YOUR PASSWORD';
const POSTGRES_HOST = 'YOU IP ADDRESS';
const POSTGRES_PORT = <YOUR PORT>;
```

Don't forget to create table ```api_token``` and ```chirpstack_tenant_id```
```
                List of relations
 Schema |         Name         | Type  |  Owner
--------+----------------------+-------+----------
 public | api_tokens           | table | postgres
 public | chirpstack_tenant_id | table | postgres
(2 rows)

                 Table "public.api_tokens"
   Column    |          Type          | Collation | Nullable | Default
--------------+------------------------+-----------+-------------------
 cs_token    | character varying(255) |           | not null |
 influx_token| character varying(255) |           | not null | 
Indexes:
    "network_api_token_api_token_key" UNIQUE CONSTRAINT, btree (cs_token)

                Table "public.chirpstack_tenant_id"
  Column   |         Type          | Collation | Nullable | Default
-----------+-----------------------+-----------+----------+---------
 tenant_id | character varying(36) |           | not null |
Indexes:
    "chirpstack_tenant_id_pkey" PRIMARY KEY, btree (tenant_id)
```

Service Endpoint(./public/scripts/serviceEndpoint.js):
```
const SERVICE_IP_ADDRESS = "SERVICE SERVER IP ADDRESS";
const SERVICE_PORT = "3333";
```

# Example output
Web server:
```
PS C:\LoRa-Project> npm run start-web    

> lora-web-application@1.0.0 start-web
> node public_server.js

Web appliction is running at http://0.0.0.0:3111/
```
Service server:
```
PS C:\LoRa-Project> npm run start-service

> lora-web-application@1.0.0 start-service
> node service_server.js

Service is running at http://0.0.0.0:3333/
```

# Requirement
```
"@chirpstack/chirpstack-api": "^4.6.0"
"@influxdata/influxdb-client": "^1.33.2"
"axios": "^1.6.7"
"cors": "^2.8.5"
"express": "^4.18.3"
"nodemailer": "^6.9.12"
"pg": "^8.11.3"
```