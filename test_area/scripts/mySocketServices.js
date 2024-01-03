
//---------------------------------------------------------------------// 
//-----------------------------WEB SOCKET------------------------------//
const host = 'localhost';
const port = '8080';

let appliaction_ID;
//---------------------------------------------------------------------// 
//----------------------------FUNCTIONS--------------------------------//
//---------------------REQUEST TO SERVER SERVICES----------------------//
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
let resp_listApplicationsReq;

export function send_listApplicationsRequest_to_server(tID, callback) {
  const socket = new WebSocket('ws://' + host + ':'+ port + '/listApplicationsRequest');
  
  socket.addEventListener('open', (event) => {
    socket.send(JSON.stringify(tID));
  });

  socket.addEventListener('message', (event) => {
    const response = JSON.parse(event.data);
    console.log('Received message for server:', response);

    if (response.status === 'success') {
      resp_listApplicationsReq = response.resp_listApplicationsReq;

      callback(null, resp_listApplicationsReq);
    } else {
      alert('An error occurred: ' + response.message);
      callback(err, null);
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
export function send_listDevicesRequest_to_server(appID, callback) {
  const socket = new WebSocket('ws://' + host + ':'+ port + '/listDevicesRequest');

  socket.addEventListener('open', (event) => {
    console.log('1');
    appliaction_ID = [ { app_id: appID } ];

    socket.send(JSON.stringify(appliaction_ID));
  });

  socket.addEventListener('message', (event) => {
    console.log('7');
    const response = JSON.parse(event.data);
    console.log('Received message for server:', response);

    if (response.status === 'success') {
      let resp_listDevicesReq = response.resp_listDevicesReq;
      console.log('8');
      callback(null, resp_listDevicesReq);
    } else {
      console.log('9');
      alert('An error occurred: ' + response.message);
      callback(err, null);
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