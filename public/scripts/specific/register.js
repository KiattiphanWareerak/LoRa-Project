//---------------------------------------------------------------------// 
//---------------------------WEB SOCKET ZONE---------------------------//
//---------------------------------------------------------------------//
const registerSocket = new WebSocket('ws://202.28.95.234:3001');

registerSocket.addEventListener('open', () => {
    console.log('WebSocket connection established with WebServer');
});

registerSocket.addEventListener('message', (event) => {
    const messageFromServer = JSON.parse(event.data);
    console.log('Message from server:', messageFromServer);

    const input_un = document.getElementById('user-name');
    const input_em = document.getElementById('email');
    const input_pw = document.getElementById('password');
    const input_pw_cf = document.getElementById('confirm-password');

    if (messageFromServer.request === 'register') {
        if (messageFromServer.message.status === 'failed') {
            if (messageFromServer.message.data.check_un === true) {
                alert("Username is already in use.");
                input_un.value = '';
                input_pw.value = '';
                input_pw_cf.value = '';
                return;
            } else if (messageFromServer.message.data.check_em === true) {
                alert("Email is already in use.");
                input_em.value = '';
                input_pw.value = '';
                input_pw_cf.value = '';
                return;
            }

            alert("Registration failed.");
            input_pw.value = '';
            input_pw_cf.value = '';
        } else {
            alert("Registration Successful!");
            input_un.value = '';
            input_em.value = '';
            input_pw.value = '';
            input_pw_cf.value = '';
            registerSocket.close();
            window.location.href = 'index.html';
        }
    }
});

registerSocket.addEventListener('error', (event) => {
    console.log('WebSocket error:', event);
});

registerSocket.addEventListener('close', (event) => {
    console.log('WebSocket closed:', event);
});

function sendRequest(data) {
    if (registerSocket.readyState === WebSocket.OPEN) {
        registerSocket.send(JSON.stringify(data));
    } else {
        console.log('WebSocket not ready, message not sent!');
    }
}
//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registration-form');
    const input_un = document.getElementById('user-name');
    const input_em = document.getElementById('email');
    const input_pw = document.getElementById('password');
    const input_pw_cf = document.getElementById('confirm-password');

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const usernamePattern = /^[a-zA-Z0-9_]{3,}$/;
        if (!usernamePattern.test(input_un.value)) {
            alert('Please enter a valid username.\n\nUsername must be at least 3 characters long and can only contain upper-case letters, lower-case letters, numbers, and underscores (_).');

            event.preventDefault();
            return;
        }

        const passwordPattern = /^[a-zA-Z0-9_@]{8,}$/;

        if (!passwordPattern.test(input_pw.value)) {
            alert('Please enter a strong password.\n\nPassword must be at least 8 characters long and can only contain upper-case letters, lower-case letters, numbers, underscores (_), and @ symbol.');

            event.preventDefault();
            return;
        }
        if (input_pw.value !== input_pw_cf.value) {
            alert('Passwords do not match.');

            event.preventDefault();
            return;
        }

        // All checks passed, proceed with sending data
        const req = {
            request: 'register', message: {
                status: undefined,
                data: {
                    user_un: input_un.value.trim(),
                    user_em: input_em.value.trim(),
                    user_pw: input_pw.value.trim()
                }
            }
        };

        sendRequest(req);
    });

    const backButton = document.getElementById("backButton");

    backButton.addEventListener("click", () => {
        window.location.href = "index.html";
    });
});
//---------------------------------------------------------------------//
