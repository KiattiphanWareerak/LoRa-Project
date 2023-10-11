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
        sendAddDeviceToServer(dN, dE);
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
//-----------------------------WEB SOCKET------------------------------//
//---------------------------------------------------------------------//

const host = 'localhost';
const port = '8080';
//---------------------------------------------------------------------//
//---------------------------------------------------------------------//
function sendAddDeviceToServer(deviceName, devEUI) {
    const socket = new WebSocket('ws://' + host + ':'+ port + '/addDevice');
  
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