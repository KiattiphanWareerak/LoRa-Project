document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("set-app-key-button");

    const appKey = document.getElementById("app-key");

    button.addEventListener("click", function () {
      const aK = appKey.value;

      const isValidAppKey = /^[0-9a-fA-F]{32}$/.test(aK);

      if (isValidAppKey) {
        sendAppKeyToServer(aK);
      } else {
        alert("Please enter the AppKey correctly. The AppKey should be a 128-bit HEX string with exactly 32 characters.");
      }
    })
})

//---------------------------------------------------------------------// 
//-----------------------------WEB SOCKET------------------------------//
//---------------------------------------------------------------------//

const host = 'localhost';
const port = '8080';
//---------------------------------------------------------------------//
//---------------------------------------------------------------------//
function sendAppKeyToServer(appKey) {
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
