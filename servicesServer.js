//---------------------------------------------------------------------//
//----------------------------SERVERS SERVER---------------------------//
//---------------------------------------------------------------------//
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);

// set the service
const checkReq = require('./services/myApp.js');

// Set the port and IP address for the server
const PORT = 3002;
const IP_ADDRESS = '127.0.0.1';

// use body-parser to fecth JSON from req.body
app.use(bodyParser.json());

// Handle requests to /service
app.post('/service', async (req, res) => {
    // Get the message from the request
    const message = req.body;
    console.log(message);

    // Do something with the message
    const result = await checkReq.myApp(message);

    // Send the response
    console.log(result);
    res.send(JSON.stringify(result));
});

// Start the server
server.listen(PORT, IP_ADDRESS, () => {
    console.log(`Service is running at http://${IP_ADDRESS}:${PORT}/`);
    console.log(`Service is running at http://localhost:${PORT}/`);
});
//---------------------------------------------------------------------//
//-------------------------------FUNCTIONS-----------------------------//
//---------------------------------------------------------------------//

//---------------------------------------------------------------------//
