//---------------------------------------------------------------------// 
//---------------------------WEB SOCKET ZONE---------------------------//
//---------------------------------------------------------------------//
const loginSocket = new WebSocket('ws://localhost:3001');

loginSocket.addEventListener('open', () => {
    console.log('WebSocket connection established with WebServer');
});

loginSocket.addEventListener('message', (event) => {
    const messageFromServer = JSON.parse(event.data);
    console.log('Message from server:', messageFromServer);

    if (messageFromServer.request === 'loginByEmail' && messageFromServer.message.status === 'success'
        || messageFromServer.request === 'loginByUname' && messageFromServer.message.status === 'success') {
        loginSocket.close();
        window.location.href = 'dashboard.html';
    } else {
        const input_id = document.getElementById('username');
        const input_pw = document.getElementById('password');
        input_id.value = '';
        input_pw.value = '';
        alert("Login failed.");
    }
});

loginSocket.addEventListener('error', (event) => {
    console.log('WebSocket error:', event);
});

loginSocket.addEventListener('close', (event) => {
    console.log('WebSocket closed:', event);
});

function sendRequest(data) {
    if (loginSocket.readyState === WebSocket.OPEN) {
        loginSocket.send(JSON.stringify(data));
    } else {
        console.log('WebSocket not ready, message not sent!');
    }
}
//---------------------------------------------------------------------// 
//----------------------------EVENT ZONE-------------------------------//
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const input_id = document.getElementById('username');
    const input_pw = document.getElementById('password');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        if (isEmail(input_id.value)) {
            const req = {
                request: 'loginByEmail', message:
                {
                    status: undefined,
                    data: {
                        user_em: input_id.value.trim(),
                        user_pw: input_pw.value.trim(),
                    }
                }
            };
            sendRequest(req);
        } else {
            const req = {
                request: 'loginByUname', message:
                {
                    status: undefined,
                    data: {
                        user_un: input_id.value.trim(),
                        user_pw: input_pw.value.trim(),
                    }
                }
            };
            sendRequest(req);
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
//---------------------------------------------------------------------//
