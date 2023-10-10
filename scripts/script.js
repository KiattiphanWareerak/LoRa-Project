host = 'localhost';
port = '8080';

document.addEventListener("DOMContentLoaded", function () {
    const button_1 = document.getElementById("Btn-1");
    const button_2 = document.getElementById("Btn-2");

    const deviceName = document.getElementById("deviceName");
    const devEUI = document.getElementById("deviceEUI");
    const appKey = document.getElementById("addKey");

    button_1.addEventListener("click", function () {
      const dN = deviceName.value;
      const dE = devEUI.value;

      const isValidName = /^[a-zA-Z0-9\-_]+$/.test(dN);
      const isValidEUI = /^[a-zA-Z0-9\-_]+$/.test(dE);

      if (isValidName && isValidEUI) {
          sendAddDeviceToServer(dN, dE);
      } else {
          alert("Please enter the device name. English letters lowercase - uppercase, numbers, and -/_");
      }
    });

    button_2.addEventListener("click", function () {
      const aK = appKey.value;

      const isValidAppKey = /^[a-zA-Z0-9\-_]+$/.test(aK);

      if (isValidAppKey) {
        sendAppKeyToServer(aK);
      } else {
        alert("Please enter the device name. English letters lowercase - uppercase, numbers, and -/_");
      }
    })
});

//---------------------------------------------------------------------// 
//------------------------------FUNCTIONS------------------------------//
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
        window.location.href = 'add_appKey.html';
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
  
function sendAppKeyToServer(appKey) {
  const socket = new WebSocket('ws://' + host + ':'+ port + '/addAppKey');
  
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
      window.location.href = 'add_appKey.html';
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