//---------------------------------------------------------------------// 
//------------------------------EVENTS---------------------------------// 
//---------------------------------------------------------------------//
const apiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjaGlycHN0YWNrIiwiaXNzIjoiY2hpcnBzdGFjayIsInN1YiI6Ijc3M2Y5OGQwLTk5YTMtNDVjMS1hY2JhLThhOTQzYzdiODFiZiIsInR5cCI6ImtleSJ9.FiCRWLwVlG9mm5_KqUm52afDzMZRJ5qc4jQJz4waxZI";

document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://localhost:3001');

    const loginForm = document.getElementById('login-form');
    const input_id = document.getElementById('username');
    const input_pw = document.getElementById('password');

    socket.addEventListener('open', () => {
        console.log('WebSocket connection established with WebServer');

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const message = { request: 'loginUser', message:
            { status: undefined,
                data: { 
                    user_em: input_id.value.trim(), 
                    user_pw: input_pw.value.trim(), }
            }};

            socket.send(JSON.stringify(message));
        });
    });

    socket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

        if (messageFromServer.request === 'loginUser' && messageFromServer.message.status === 'success') {
            input_id.value = '';
            input_pw.value = '';
            window.location.href = 'dashboard.html';
        } else {
            input_id.value = '';
            input_pw.value = '';
            alert("Login failed.");
        }
    });
});
//---------------------------------------------------------------------// 
