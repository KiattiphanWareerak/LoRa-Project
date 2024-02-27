//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    //---------------------------SENDER ZONE---------------------------//
    const socket = new WebSocket('ws://localhost:3001');

    const registerForm = document.getElementById('registration-form');
    const input_un = document.getElementById('user-name');
    const input_em = document.getElementById('email');
    const input_pw = document.getElementById('password');
    const input_pw_cf = document.getElementById('confirm-password');

    socket.addEventListener('open', () => {
        console.log('WebSocket connection established with WebServer');

        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const usernamePattern = /^[a-zA-Z0-9_]{3,}$/;
            if (!usernamePattern.test(input_un.value)) {
                alert('Please enter a valid username.\n\nUsername must be at least 3 characters long and can only contain upper-case letters, lower-case letters, numbers, and underscores (_).');

                event.preventDefault();
                return; // Stop further execution
            } 

            const passwordPattern = /^[a-zA-Z0-9_@]{8,}$/;
            if (input_pw.value.length < 5) {
            alert('Password must be at least 5 characters long.');

            event.preventDefault();
            return;
            }
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
            const req = { request: 'register', message: { 
                status: undefined,
                data: { user_un: input_un.value.trim(),
                    user_em: input_em.value.trim(),
                    user_pw: input_pw.value.trim() }
            }};

            socket.send(JSON.stringify(req));
        });
    });
    //-------------------------RECEIVER ZONE-------------------------//
    socket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

        if (messageFromServer.request === 'register') {
            if (messageFromServer.message.status === 'failed') {
                if ( messageFromServer.message.data.check_un === true ) {
                    alert("Username is already in use.");
                    input_un.value = '';
                    input_pw.value = '';
                    input_pw_cf.value = '';
                    return;
                } else if ( messageFromServer.message.data.check_em === true ) {
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
                window.location.href = 'index.html';
            }
        } else {
            alert("Error 505.");
        }
    });
});
//---------------------------------------------------------------------//
