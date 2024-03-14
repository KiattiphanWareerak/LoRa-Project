//---------------------------------------------------------------------// 
//----------------------------EVENTS ZONE------------------------------// 
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registration-form');
    const input_un = document.getElementById('user-name');
    const input_em = document.getElementById('email');
    const input_pw = document.getElementById('password');
    const input_pw_cf = document.getElementById('confirm-password');

    registerForm.addEventListener('submit', async (event) => {
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

        // All checks passed, proceed with sending request
        const response = await fetch('http://202.28.95.234:3333/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_un: input_un.value.trim(),
                    user_em: input_em.value.trim(),
                    user_pw: input_pw.value.trim()
                })
            });

            const result = await response.json();
            console.log('Result:\n', result);

            if (result.status === 'failed') {
                if (result.check_un === 'exist') {
                    alert("Username is already in use.");
                    input_un.value = '';
                    input_pw.value = '';
                    input_pw_cf.value = '';
                    return;
                } else if (result.check_em === 'exist') {
                    alert("Email is already in use.");
                    input_em.value = '';
                    input_pw.value = '';
                    input_pw_cf.value = '';
                    return;
                }
    
                alert("Registration failed.");
                input_pw.value = '';
                input_pw_cf.value = '';
                return;
            } else {
                alert("Registration Successful!");
                input_un.value = '';
                input_em.value = '';
                input_pw.value = '';
                input_pw_cf.value = '';
                window.location.href = '../htmls/index.html';
            }
    });

    // back to login page
    const backButton = document.getElementById("backButton");

    backButton.addEventListener("click", () => {
        window.location.href = "../htmls/index.html";
    });
});
//---------------------------------------------------------------------//
