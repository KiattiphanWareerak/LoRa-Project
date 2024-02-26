//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//

//---------------------------------------------------------------------//
//---------------------------WEB SOCKET ZONE---------------------------//
//---------------------------------------------------------------------//
function sender_and_reciver_device_profiles(req) {
  const socket = new WebSocket('ws://localhost:3001');
  //-----SENDER-----//
  socket.addEventListener('open', () => {
    console.log('WebSocket connection established with WebServer');

    socket.send(JSON.stringify(req));
  });
  //-----RECEIVER-----//
  socket.addEventListener('message', (event) => {
      const messageFromServer = JSON.parse(event.data);
      console.log('Message from server:', messageFromServer);

      if ( messageFromServer.message.status === 'success' ) {
        if ( messageFromServer.request === '' ) {
        } 

      } else {
        alert("Error: Request-" + messageFromServer.request + "-Status-"  + messageFromServer.message.status + 
        "\n-Data-" + messageFromServer.message.data);
      }
  });
}
//---------------------------------------------------------------------// 
//---------------------------DISPLAYS ZONE-----------------------------// 
//---------------------------------------------------------------------// 

//---------------------------------------------------------------------//
//----------------------------COMMON ZONE------------------------------// 
//---------------------------------------------------------------------// 

//---------------------------------------------------------------------// 
