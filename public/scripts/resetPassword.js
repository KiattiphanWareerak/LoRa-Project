//---------------------------------------------------------------------// 
//----------------------------EVENT ZONE-------------------------------//
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
    const resetPwForm = document.getElementById("reset-password-form");

    resetPwForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const input_otp = document.getElementById("otp").value.trim();
        const input_un = document.getElementById("exist-username").value.trim();
        const input_em = document.getElementById("exist-email").value.trim();
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

        const response = await fetch('http://localhost:3333/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_otp: input_otp,
                user_un: input_un,
                user_em: input_em,
                user_pw: input_cpw,
            })
        });

        const result = await response.json();
        console.log('Result:\n', result);

        if (result === 'failed') {
            alert('Error: But the password in chirpstack account is Successful, except influxdb account.');
            return;
        }
        if (result === 'Email is not already in use') {
            alert('Email is not already in use');
            return;
        }
        if (result === 'The OTP code has expired') {
            alert('The OTP code has expired');
            return;
        }
        if (result === 'Incorrect OTP code') {
            alert('Incorrect OTP code');
            return;
        }

        alert("Reset Password Successfully.");
        window.location.href = "../htmls/index.html";
    });

    const backButton = document.getElementById("backButton");

    backButton.addEventListener("click", () => {
        window.location.href = "../htmls/index.html";
    });
});
//---------------------------------------------------------------------//
