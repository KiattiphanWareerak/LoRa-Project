//---------------------------------------------------------------------// 
//------------------------------EVENTS---------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
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
            
            // Check if user-name follows the specified pattern
            const usernamePattern = /^[a-zA-Z0-9_]{3,}$/; // Regex pattern
            if (!usernamePattern.test(input_un.value)) {
                alert('Invalid username format. Please use only letters, numbers, or underscores (_) for the username.\nThe username should start with an uppercase letter and be at least 3 characters long.');
                return; // Stop further execution
            } 

            // Check if password and confirm password match
            if (input_pw.value !== input_pw_cf.value) {
                alert("Passwords don't match");
                return; // Stop further execution
            }

            // All checks passed, proceed with sending data
            const messageToServer = { request: 'register', message: { 
                status: undefined,
                data: { user_name: input_un.value.trim(),
                    user_em: input_em.value.trim(),
                    user_pw: input_pw.value.trim() }
            }};

            socket.send(JSON.stringify(messageToServer));
        });
    });

    socket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

        if (messageFromServer.message.status === 'failed') {
            alert("Registration failed.");
            input_un.value = '';
            input_em.value = '';
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
    });
});
//---------------------------------------------------------------------//
