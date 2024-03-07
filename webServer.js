//---------------------------------------------------------------------//
//------------------------------WEB SERVER-----------------------------//
//---------------------------------------------------------------------//
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const axios = require('axios');

const app = express();
const server = http.createServer(app);

// Set the port and IP address for the server
const PORT = 3001;
const IP_ADDRESS = '0.0.0.0';

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Add WebSocket support
const wss = new WebSocket.Server({
    server: server,
});

wss.on('connection', (socket) => {
    // Listen for messages from the client
    socket.on('message', (message) => {
        const parseMessage = JSON.parse(message);
        console.log(parseMessage);

        // Forward a message to the service
        axios.post('http://localhost:3002/service', parseMessage)
            .then((response) => {
                // Send a message to the client
                socket.send(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
        });
    });
});

// Start the server
server.listen(PORT, IP_ADDRESS, () => {
    console.log(`Web server is running at http://${IP_ADDRESS}:${PORT}/`);
});
//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
//---------------------------------------------------------------------//

//---------------------------------------------------------------------//
