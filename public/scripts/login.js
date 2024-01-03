//---------------------------------------------------------------------// 
//------------------------------EVENTS---------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('ws://localhost:3000');

    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const input_id = document.getElementById('username');
        const input_pw = document.getElementById('password');

        const user_id = input_id.value;
        const user_pw = input_pw.value;
        
        if (user_id == 'admin' && user_pw == 'admin') {
            const message = { status: 'login', data: {
                user_id: user_id, user_pw: user_pw
            } };

            socket.send(JSON.stringify(message));
        } else {
            input_id.value = '';
            input_pw.value = '';
    
            return alert('Only admins.');
        }
    });

    socket.addEventListener('message', (event) => {
        try {
            const messageFromServer = JSON.parse(event.data);
            console.log('Message from server:', messageFromServer);

            if (messageFromServer.status === 'loginSuccess') {
                window.location.href = 'applications.html';
            } else {
                input_id = '';
                input_pw = '';
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    });    
});
//---------------------------------------------------------------------// 
