//---------------------------------------------------------------------// 
//---------------------------WEB SOCKET ZONE---------------------------//
//---------------------------------------------------------------------//
const socket = new WebSocket('ws://localhost:3001');

socket.addEventListener('message', (event) => {
    const messageFromServer = JSON.parse(event.data);
    console.log('Message from server:', messageFromServer);

    logIsSucc(messageFromServer);
});
  
socket.addEventListener('error', (event) => {
    console.log('WebSocket error:', event);
});
  
socket.addEventListener('close', (event) => {
    console.log('WebSocket closed:', event);
});
//---------------------------------------------------------------------// 
//----------------------------EVENT ZONE-------------------------------//
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const input_id = document.getElementById('username');
    const input_pw = document.getElementById('password');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if ( isEmail(input_id.value) ) {
            const req = { request: 'loginByEmail', message: 
            { status: undefined,
                data: { 
                    user_em: input_id.value.trim(), 
                    user_pw: input_pw.value.trim(), }
            }};
            sendRequset(req);
        } else {
            const req = { request: 'loginByUname', message:
            { status: undefined,
                data: { 
                    user_un: input_id.value.trim(), 
                    user_pw: input_pw.value.trim(), }
            }};
            sendRequset(req);
        }
    });
});
//---------------------------------------------------------------------//
//----------------------------COMMON ZONE------------------------------//
//---------------------------------------------------------------------//
function isEmail(id) {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(id);;
}
function logIsSucc(resp) {
    if ( resp.request === 'loginByEmail' && resp.message.status === 'success' 
    || resp.request === 'loginByUname' && resp.message.status === 'success' ) {
        socket.close();
        window.location.href = 'dashboard.html';
    } else {
        input_id.value = '';
        input_pw.value = '';
        alert("Login failed.");
    }
}
function sendRequset(data) {
    socket.addEventListener('open', () => {
      console.log('WebSocket connection established with WebServer');

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
      } else {
        console.log('WebSocket not ready, message not sent!');
      }
    });
}
//---------------------------------------------------------------------//
