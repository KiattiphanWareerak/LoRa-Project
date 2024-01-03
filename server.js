const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Set api services
// const chirpStackServices = require('./chirpStackServices.js');
const dataBaseServices = require('./dataBaseSevices.js');
const testApiService = require('./testApiServices.js');

// Set the port and IP address for the server
const PORT = 3000;
const IP_ADDRESS = '127.0.0.1';

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

//
let globalTenantId;
let globalAppId, globalAppName;
let globalDevId, globalDevName;

// WebSocket handling
wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
    
    // Handle WebSocket messages
    ws.on('message', (message) => {
        let parseMessage = JSON.parse(message);
        console.log('Received message:');
        console.log(parseMessage);

        if ( parseMessage.status === 'login' ) {
            const resp = dataBaseServices.loginRequest(parseMessage.message);

            if ( resp.status === 'loginSuccess' ) {
                tenant_id = '0000-0000-0000-0001';
                globalTenantId = tenant_id;
                ws.send(JSON.stringify(resp));
            }
        } else if (parseMessage.status === 'displayApplications') {
            const resp = testApiService.applicationsListRequest(globalTenantId);
            const parseResp = resp;
            
            if ( parseResp.status === 'appsListSuccess') {
                ws.send(JSON.stringify(parseResp));
            }
        } else if (parseMessage.status === 'displayRefreshDevices') {
            let data = { app_id: globalAppId, app_name: globalAppName };
            const resp = testApiService.devicesListRequest(data);
            const parseResp = resp;

            if ( parseResp.status === 'devsListSuccess') {
                ws.send(JSON.stringify(parseResp));
            }
        } else if (parseMessage.status === 'appIdClickRequest') {
            const resp = testApiService.devicesListRequest(parseMessage.message);
            const parseResp = resp;
        
            if ( parseResp.status === 'devsListSuccess') {
                globalAppId = parseMessage.message.app_id;
                globalAppName = parseMessage.message.app_name;
                ws.send(JSON.stringify(parseResp));
            }
        } else if (parseMessage.status === 'displayRefreshDashDevice') {
            let data = { message: { dev_id: globalDevId, dev_name: globalDevName},
            app_id: globalAppId, app_name: globalAppName};
            const resp = testApiService.dashboardDeviceRequest(data.message, data.app_id, 
                data.app_name);
            const parseResp = resp;

            if ( parseResp.status === 'dashDeviceSuccess') {
                ws.send(JSON.stringify(parseResp));
            }
        } else if (parseMessage.status === 'devNameClickRequest') {
            const resp = testApiService.dashboardDeviceRequest(parseMessage.message,
                globalAppId, globalAppName);
            const parseResp = resp;

            if ( parseResp.status === 'dashDeviceSuccess') {
                globalDevId = parseMessage.message.dev_id;
                globalDevName = parseMessage.message.dev_name;
                ws.send(JSON.stringify(parseResp));
            }
        }
        else {
            console.log('Error, pls try again.');
        }
    });

    // Send a welcome message to the client
    const message = { status: 'success', data: 'Welcome to the server!' };
    ws.send(JSON.stringify(message));
});

// Start the server
server.listen(PORT, IP_ADDRESS, () => {
    console.log(`Server is running at http://${IP_ADDRESS}:${PORT}/`);
    console.log(`Server is running at http://localhost:${PORT}/`);
});
