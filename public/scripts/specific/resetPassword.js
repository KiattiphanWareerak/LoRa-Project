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

    if ( messageFromServer.request === 'forgotPassword' && messageFromServer.message.status === 'sucess') {
        alert("Password reset email sent successfully.");
    } else {
        alert("Password reset email sent failed.");
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
    const resetPwButton = document.getElementById("resetConfirm");

    resetPwButton.addEventListener("click", () => {
        const input_em = document.getElementById("email");

        const req = {
            request: 'forgotPassword', message:
            {
                status: undefined,
                data: {
                    user_em: input_em.value.trim(),
                }
            }
        };
        sendRequest(req);
    })
});
//---------------------------------------------------------------------//

