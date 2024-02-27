//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    //-----SENDER ZONE-----//
    const socket = new WebSocket('ws://localhost:3001');

    const loginForm = document.getElementById('login-form');
    const input_id = document.getElementById('username');
    const input_pw = document.getElementById('password');

    const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmail = emailRegex.test(input_id.value);

    socket.addEventListener('open', () => {
        console.log('WebSocket connection established with WebServer');

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            if (isEmail) {
                const req = { request: 'loginByEmail', message:
                { status: undefined,
                    data: { 
                        user_em: input_id.value.trim(), 
                        user_pw: input_pw.value.trim(), }
                }};

                socket.send(JSON.stringify(req));
            } else {
                const req = { request: 'loginByUname', message:
                { status: undefined,
                    data: { 
                        user_un: input_id.value.trim(), 
                        user_pw: input_pw.value.trim(), }
                }};
                
                socket.send(JSON.stringify(req));
            }
        });
    });
    //----RECEIVER ZONE----//
    socket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

        if ( messageFromServer.request === 'loginByEmail' && messageFromServer.message.status === 'success' ) {
            input_id.value = '';
            input_pw.value = '';
            window.location.href = 'dashboard.html';
        } else if ( messageFromServer.request === 'loginByUname' && messageFromServer.message.status === 'success' ) {
            input_id.value = '';
            input_pw.value = '';
            window.location.href = 'dashboard.html';
        } else {
            input_id.value = '';
            input_pw.value = '';
            alert("Login failed.\nThere are no users on our ChirpStack.");
        }
    });
});
//---------------------------------------------------------------------//
