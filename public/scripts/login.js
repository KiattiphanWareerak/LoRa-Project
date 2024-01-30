//---------------------------------------------------------------------// 
//------------------------------EVENTS---------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://localhost:3001');

    const loginForm = document.getElementById('login-form');
    const input_id = document.getElementById('username');
    const input_pw = document.getElementById('password');

    socket.addEventListener('open', () => {
        console.log('WebSocket connection established with WebServer');

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            if (input_id.value == 'admin' && input_pw.value == 'admin') {
                const message = { request: 'login', message:
                { status: undefined,
                    data: { user_id: input_id.value, user_pw: input_pw.value }
                }};

                socket.send(JSON.stringify(message));
            } else {
                input_id.value = '';
                input_pw.value = '';
                alert('Only admins.');
            }
        });
    });

    socket.addEventListener('message', (event) => {
        try {
            const messageFromServer = JSON.parse(event.data);
            console.log('Message from server:', messageFromServer);

            if (messageFromServer.request === 'login') {
                if (messageFromServer.message.status === 'success') {
                    input_id.value = '';
                    input_pw.value = '';
                    window.location.href = 'dashboard.html';
                } else {
                    input_id.value = '';
                    input_pw.value = '';
                    alert('Login Failed.');
                }
            } else {
                alert('Login Error.');
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });
});
//---------------------------------------------------------------------// 
