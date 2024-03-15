//---------------------------------------------------------------------// 
//----------------------------EVENT ZONE-------------------------------//
const SERVICE_IP_ADDRESS = "<SERVICE SERVER IP ADDRESS>";
const SERVICE_PORT = "3333";
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    localStorage.clear();

    const loginForm = document.getElementById('login-form');
    const input_id = document.getElementById('username');
    const input_pw = document.getElementById('password');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (isEmail(input_id.value)) {
            const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/loginByEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_em: input_id.value.trim(),
                    user_pw: input_pw.value.trim(),
                })
            });

            const result = await response.json();
            console.log('Result:\n', result);

            if (result.status === 'failed') {
                alert("Login failed.");
                window.location.href = '../htmls/index.html';
                return;
            }

            localStorage.setItem('user_token', result.user_token);
            window.location.href = '../htmls/dashboard.html';
        } else {
            const response = await fetch(`http://${SERVICE_IP_ADDRESS}:${SERVICE_PORT}/loginByName`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_un: input_id.value.trim(),
                    user_pw: input_pw.value.trim(),
                })
            });

            const result = await response.json();
            console.log('Result:\n', result);

            if (result.status === 'failed') {
                alert("Login failed.");
                window.location.href = '../htmls/index.html';
                return;
            }

            localStorage.setItem('user_token', result.user_token);
            window.location.href = '../htmls/dashboard.html';
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
