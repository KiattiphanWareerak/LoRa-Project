//---------------------------------------------------------------------//
//----------------------------SERVERS SERVER---------------------------//
//---------------------------------------------------------------------//
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 3333;
const IP_ADDRESS = '0.0.0.0';

const service = express();
service.use(cors());
service.use(bodyParser.json());

const myApp = require('./service/myApp.js');

service.post('/authenticated', async (req, res) => {
    const message = req.body;
    console.log("Receive:\n", message);

    try {
        const result = await myApp.authenticatedRequest(message);

        console.log("Result:\n", result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log("Error:\n", error);
    }
});

service.post('/add-application', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.addApplicationRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/add-device', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.addDeviceRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/del-application', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.deleteApplicationRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/del-device', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.deleteDeviceRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/enqueue-device', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.enqueueDeviceRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/flush-queue', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.flushQueueRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/get-application', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.getApplicationRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/get-device', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.getDevicInfoRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/get-deviceList', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.getDeviceListRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/get-event', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.getEventRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/get-frame', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.getFrameRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/get-linkMetric', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.getLinkMetricRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/get-queue', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.reloadQueueRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/loginByEmail', async (req, res) => {
    const message = req.body;
    console.log("Receive:\n", message);

    try {
        const result = await myApp.loginByEmailRequest(message);

        console.log("Result:\n", result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log("Error:\n", error);
    }
});

service.post('/loginByName', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.loginByNameRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/menu-application', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.getApplicationMenuRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/menu-dashboard', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.getDashboardMenuRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/menu-deviceProfile', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.getDeviceProfileMenuRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/register', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.registerRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/update-application', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.updateApplicationRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.post('/update-device', async (req, res) => {
    const message = req.body;
    console.log(message);

    try {
        const result = await myApp.updateDeviceRequest(message);

        console.log(result);
        res.send(JSON.stringify(result));
    } catch (error) {
        console.log(error);
    }
});

service.listen(PORT, IP_ADDRESS, () => {
    console.log(`Service is running at http://${IP_ADDRESS}:${PORT}/`);
});
//---------------------------------------------------------------------//
