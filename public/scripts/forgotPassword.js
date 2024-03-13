//---------------------------------------------------------------------// 
//----------------------------EVENT ZONE-------------------------------//
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const forgotSocket = new WebSocket('ws://localhost:3001');

    forgotSocket.addEventListener('open', () => {
        console.log('WebSocket connection established with WebServer from forgot password');

        const forgotPwForm = document.getElementById("forgot-password-form");

        forgotPwForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const input_em = document.getElementById("email").value.trim();

            const req = {
                request: 'forgotPassword',
                message: {
                    status: undefined,
                    data: {
                        user_em: input_em
                    }
                }
            };

            forgotSocket.send(JSON.stringify(req));
            alert("Plese wait...");
        });

        const backButton = document.getElementById("backButton");

        backButton.addEventListener("click", () => {
            window.location.href = "../htmls/index.html";
        });
    });

    forgotSocket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

        if (messageFromServer.request === 'forgotPassword' && messageFromServer.message.status === 'success') {
            alert("Password reset email sent successfully.\nPlease note that the OTP is valid for 3 minutes only.");
            const input_em = document.getElementById("email");
            input_em.value = '';
        } else if (messageFromServer.request === 'forgotPassword' && messageFromServer.message.status === 'failed') {
            alert("Send reset password to server failed.");
        }
    });

    forgotSocket.addEventListener('error', (event) => {
        console.log('WebSocket error:', event);
    });

    forgotSocket.addEventListener('close', (event) => {
        console.log('WebSocket closed:', event);
    });
});
//---------------------------------------------------------------------//

