//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    //---------------------------SENDER ZONE---------------------------//
    const socket = new WebSocket('ws://localhost:3001');

    const loginForm = document.getElementById('login-form');
    const input_id = document.getElementById('username');
    const input_pw = document.getElementById('password');

    socket.addEventListener('open', () => {
        console.log('WebSocket connection established with WebServer');

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const message = { request: 'login', message:
            { status: undefined,
                data: { 
                    user_em: input_id.value.trim(), 
                    user_pw: input_pw.value.trim(), }
            }};

            socket.send(JSON.stringify(message));
        });
    });
    //-------------------------RECEIVER ZONE-------------------------//
    socket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

        if (messageFromServer.request === 'login') {
            if (messageFromServer.message.status === 'success') {
                alert("Welcome to LoRa Managment Web Application by COE2023-08!");
                input_id.value = '';
                input_pw.value = '';
                window.location.href = 'dashboard.html';
            } else {
                input_id.value = '';
                input_pw.value = '';
                alert("Login failed.");
            }
        } else {
            alert("Error 505");
        }
    });
});
//---------------------------------------------------------------------// 
