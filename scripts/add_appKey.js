host = 'localhost';
port = '8080';

document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("Btn-2");

    const appKey = document.getElementById("appKey");

    button.addEventListener("click", function () {
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
      window.location.href = 'devices.html';
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
