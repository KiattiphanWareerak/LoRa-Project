//---------------------------------------------------------------------// 
//----------------------SCRIPT FOR CHIRPSTACK API----------------------//
//--------------------------REQUEST TO SERVER--------------------------//
//---------------------------------------------------------------------// 

//---------------------------------------------------------------------// 
//----------------------------ACTION EVENTS----------------------------//

//---CREATE DEVICE REQUEST---//
document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("add-device-button");

    const devName = document.getElementById("device-name");
    const devEUI = document.getElementById("device-eui");

    button.addEventListener("click", function () {
      const dN = devName.value;
      const dE = devEUI.value;

      const isValidName = /^[a-zA-Z0-9\-_]+$/.test(dN);
      const isValidEUI = /^[0-9a-fA-F]{16}$/.test(dE);

      if (isValidName && isValidEUI) {
        send_createDeviceRequest_to_server(dN, dE);
        devName.value = "";
        devEUI.value = "";
      } else if (isValidName && !isValidEUI) {
        alert("Device EUI should be a 64-bit HEX string with exactly 16 characters.");
        devEUI.value = "";
      } else if (!isValidName && isValidEUI) {
        alert("Device Name should be English letters (lowercase/uppercase), numbers, '-', and '_'.");
        devName.value = "";
      } else {
        alert("Device Name should be English letters (lowercase/uppercase), numbers, '-', and '_.'\n" +
        "Device EUI should be a 64-bit HEX string with exactly 16 characters.");
        devName.value = "";
        devEUI.value = "";
      }
    });
});
//---------------------------------------------------------------------// 
//---CREATE DEVICE KEY REQUEST (OTAA KEY)---//
document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("set-app-key-button");

    const devKey = document.getElementById("app-key");

    button.addEventListener("click", function () {
      const aK = devKey.value;

      const isValidAppKey = /^[0-9a-fA-F]{32}$/.test(aK);

      if (isValidAppKey) {
        send_CreateDeviceKeyRequest_to_server(aK);
      } else {
        alert("Please enter the AppKey correctly. The AppKey should be a 128-bit HEX string with exactly 32 characters.");
      }
    });
});
//---------------------------------------------------------------------//
//---LIST DEVICES REQUEST---//
document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("list-device-button");

  button.addEventListener("click", function () {
    send_listDeviceRequest_to_server();
  });
});
//---------------------------------------------------------------------//


//---------------------------------------------------------------------// 
//-----------------------------WEB SOCKET------------------------------//

const host = 'localhost';
const port = '8080';
//---------------------------------------------------------------------//
function send_createDeviceRequest_to_server(devName, devEUI) {
    const socket = new WebSocket('ws://' + host + ':'+ port + '/createDeviceRequest');
  
    socket.addEventListener('open', (event) => {
      const data = {
        devName: devName,
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
function send_createDeviceKeyRequest_to_server(devKey) {
    const socket = new WebSocket('ws://' + host + ':'+ port + '/createDeviceKeyRequest');
    
    socket.addEventListener('open', (event) => {
      const data = {
        devKey: devKey,
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
function send_listDeviceRequest_to_server() {
  const socket = new WebSocket('ws://' + host + ':'+ port + '/listDeviceRequest');
  
  socket.addEventListener('open', (event) => {
    const data = {
      appID: "c735b5b4-8130-454b-abf5-26021f5327f0",
    };
    socket.send(JSON.stringify(data));
  });

  socket.addEventListener('message', (event) => {
    const response = JSON.parse(event.data);
    console.log('Received message for server:', response);

    if (response.status === 'success') {
      alert("Success!!");

      let devices = response.devices;
      displayListDevice(devices);
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

//---------------------------------------------------------------------// 
//----------------------------FUNCTIONS--------------------------------//

function displayListDevice(devices) {
  const listDeviceDiv = document.getElementById('list-device');
  
  // Clear previous content
  listDeviceDiv.innerHTML = '';

  devices.forEach(device => {
      let devEUI = device.devEUI;
      let devName = device.devName;

      let deviceDiv = document.createElement('div');
      deviceDiv.textContent = `DevEUI: ${devEUI}, Device Name: ${devName}`;

      listDeviceDiv.appendChild(deviceDiv);
  });
}
//---------------------------------------------------------------------//