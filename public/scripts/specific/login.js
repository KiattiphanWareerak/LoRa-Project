//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const input_id = document.getElementById('username');
    const input_pw = document.getElementById('password');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        const req = { request: 'login', message:
        { status: undefined,
            data: { 
                user_em: input_id.value.trim(), 
                user_pw: input_pw.value.trim(), }
        }};

        sender_and_reciver_login(req);
    });
});
//---------------------------------------------------------------------// 
//---------------------------WEB SOCKET ZONE---------------------------//
//---------------------------------------------------------------------//
function sender_and_reciver_login(req) {
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
          if ( messageFromServer.request === 'login' ) {
            input_id.value = '';
            input_pw.value = '';
            window.location.href = 'dashboard.html';
          } 
        } else {
            input_id.value = '';
            input_pw.value = '';
            alert("Login failed.");
        }
    });
}
//---------------------------------------------------------------------//
