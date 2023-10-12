//---------------------------------------------------------------------// 
//----------------------SCRIPT FOR CHIRPSTACK API----------------------//
//---------------------------------------------------------------------//

//---------------------------------------------------------------------// 
//----------------------------ACTION EVENTS----------------------------//

//---ADD DEVICE---//
document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("add-device-button");

    const deviceName = document.getElementById("device-name");
    const devEUI = document.getElementById("device-eui");

    button.addEventListener("click", function () {
      const dN = deviceName.value;
      const dE = devEUI.value;

      const isValidName = /^[a-zA-Z0-9\-_]+$/.test(dN);
      const isValidEUI = /^[0-9a-fA-F]{16}$/.test(dE);

      if (isValidName && isValidEUI) {
        sendNewDeviceToServer(dN, dE);
        deviceName.value = "";
        devEUI.value = "";
      } else if (isValidName && !isValidEUI) {
        alert("Device EUI should be a 64-bit HEX string with exactly 16 characters.");
        devEUI.value = "";
      } else if (!isValidName && isValidEUI) {
        alert("Device Name should be English letters (lowercase/uppercase), numbers, '-', and '_'.");
        deviceName.value = "";
      } else {
        alert("Device Name should be English letters (lowercase/uppercase), numbers, '-', and '_.'\n" +
        "Device EUI should be a 64-bit HEX string with exactly 16 characters.");
        deviceName.value = "";
        devEUI.value = "";
      }
    });
});
//---------------------------------------------------------------------// 

//---CREATE OTAA KEY---//
document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("set-app-key-button");

    const appKey = document.getElementById("app-key");

    button.addEventListener("click", function () {
      const aK = appKey.value;

      const isValidAppKey = /^[0-9a-fA-F]{32}$/.test(aK);

      if (isValidAppKey) {
        sendCreateAppKeyToServer(aK);
      } else {
        alert("Please enter the AppKey correctly. The AppKey should be a 128-bit HEX string with exactly 32 characters.");
      }
    })
})

//---------------------------------------------------------------------// 
//-----------------------------WEB SOCKET------------------------------//

const host = 'localhost';
const port = '8080';

//---------------------------------------------------------------------//
function sendNewDeviceToServer(deviceName, devEUI) {
    const socket = new WebSocket('ws://' + host + ':'+ port + '/newDevice');
  
    socket.addEventListener('open', (event) => {
      const data = {
        deviceName: deviceName,
        devEUI: devEUI,
      };
      socket.send(JSON.stringify(data));
    });
  
    socket.addEventListener('message', (event) => {
      const response = JSON.parse(event.data);
      console.log('Received message for server:', response);

      if (response.status === 'success') {
        alert("Success!!");
        window.location.href = 'createAppKey.html';
      } else {
        alert('An error occurred: ' + response.message);
      }
    });
  
    socket.addEventListener('close', (event) => {
      console.log('Close connection to server.');
    });
  
    socket.addEventListener('error', (event) => {
      console.error('Error connecting to the server.', event.error);
    });
}
//---------------------------------------------------------------------//

function sendCreateAppKeyToServer(appKey) {
    const socket = new WebSocket('ws://' + host + ':'+ port + '/createAppKey');
    
    socket.addEventListener('open', (event) => {
      const data = {
        appKey: appKey,
      };
      socket.send(JSON.stringify(data));
    });
  
    socket.addEventListener('message', (event) => {
      const response = JSON.parse(event.data);
      console.log('Received message for server:', response);
  
      if (response.status === 'success') {
        window.location.href = 'dashboard.html';
      } else {
        alert('An error occurred: ' + response.message);
      }
    });
  
    socket.addEventListener('close', (event) => {
      console.log('Close connection to server.');
    });
  
    socket.addEventListener('error', (event) => {
      console.error('Error connecting to the server.', event.error);
    });
  }
//---------------------------------------------------------------------//
