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
        
        // Check if user-name follows the specified pattern
        const usernamePattern = /^[a-zA-Z0-9_]{3,}$/;
        if (!usernamePattern.test(input_un.value)) {
            alert('Invalid username format. Please use only letters, numbers, underscores (_) and be at least 3 characters long.');
            return;
        } 

        // Check if password and confirm password match
        if (input_pw.value !== input_pw_cf.value) {
            alert("Passwords don't match");
            return;
        }

        const req = { request: 'register', message: { 
            status: undefined,
            data: { user_name: input_un.value.trim(),
                user_em: input_em.value.trim(),
                user_pw: input_pw.value.trim() }
        }};

        sender_and_reciver_register(req);
    });
});
//---------------------------------------------------------------------// 
//---------------------------WEB SOCKET ZONE---------------------------//
//---------------------------------------------------------------------//
function sender_and_reciver_register(req) {
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
          if ( messageFromServer.request === 'register' ) {
            alert("Registration Successful!");
            input_un.value = '';
            input_em.value = '';
            input_pw.value = '';
            input_pw_cf.value = '';
            window.location.href = 'index.html';
          } 
        } else {
            alert("Registration failed.");
            input_pw.value = '';
            input_pw_cf.value = '';
        }
    });
}
//---------------------------------------------------------------------//
