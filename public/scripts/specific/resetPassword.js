//---------------------------------------------------------------------// 
//----------------------------EVENT ZONE-------------------------------//
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const resetSocket = new WebSocket('ws://localhost:3001');

    resetSocket.addEventListener('open', () => {
        console.log('WebSocket connection established with WebServer from reset password');

        const resetPwForm = document.getElementById("reset-password-form");

        resetPwForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const input_otp = document.getElementById("otp").value.trim();
            const input_un = document.getElementById("exist-username").value.trim();
            const input_npw = document.getElementById("new-password").value.trim();
            const input_cpw = document.getElementById("confirm-password").value.trim();
            const passwordPattern = /^[a-zA-Z0-9_@]{8,}$/;

            if (!passwordPattern.test(input_npw.value)) {
                alert('Please enter a strong password.\n\nPassword must be at least 8 characters long and can only contain upper-case letters, lower-case letters, numbers, underscores (_), and @ symbol.');

                event.preventDefault();
                return;
            }
            if (input_npw.value !== input_cpw.value) {
                alert('Passwords do not match.');

                event.preventDefault();
                return;
            }

            const req = {
                request: 'updatePassword',
                message: {
                    status: undefined,
                    data: {
                        user_otp: input_otp,
                        user_un: input_un,
                        user_npw: input_npw,
                    }
                }
            };

            resetSocket.send(JSON.stringify(req));
        });

        const backButton = document.getElementById("backButton");

        backButton.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    });

    resetSocket.addEventListener('message', (event) => {
        const messageFromServer = JSON.parse(event.data);
        console.log('Message from server:', messageFromServer);

        if (messageFromServer.request === 'updatePassword' && messageFromServer.message.status === 'success') {
            alert("Reset Password Successfully.");
            window.location.href = "index.html";
        } else if (messageFromServer.request === 'updatePassword' && messageFromServer.message.status === 'failed') {
            alert("Reset Password Failed: ", messageFromServer);
        }
    });

    resetSocket.addEventListener('error', (event) => {
        console.log('WebSocket error:', event);
    });

    resetSocket.addEventListener('close', (event) => {
        console.log('WebSocket closed:', event);
    });
});
//---------------------------------------------------------------------//
