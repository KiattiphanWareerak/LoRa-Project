const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Set myApp
const checkReq = require('./myApp');

// Set the port and IP address for the server
const PORT = 3000;
const IP_ADDRESS = '127.0.0.1';

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// WebSocket handling
wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
    
    // Handle WebSocket messages
    ws.on('message', (message) => {
        let parseMessage = JSON.parse(message);
        console.log('Received message:');
        console.log(parseMessage);

        let resp = checkReq.myApp(parseMessage);
        console.log('Received response:');
        console.log(resp);
        ws.send(JSON.stringify(resp));
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
