//---------------------------------------------------------------------//
//------------------------------WEB SERVER-----------------------------//
//---------------------------------------------------------------------//
const express = require('express');
const path = require('path');

const PORT = 3111;
const IP_ADDRESS = '0.0.0.0';

const web = express();

web.use(express.static(path.join(__dirname, 'public')));

web.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'htmls', 'index.html'));
});

web.listen(PORT, IP_ADDRESS, () => {
    console.log(`Web appliction is running at http://${IP_ADDRESS}:${PORT}/`);
});
//---------------------------------------------------------------------//
