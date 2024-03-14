//---------------------------------------------------------------------// 
//----------------------------EVENT ZONE-------------------------------//
//---------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', () => {
        const forgotPwForm = document.getElementById("forgot-password-form");

        forgotPwForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const input_em = document.getElementById("email").value.trim();

            const response = await fetch('http://localhost:3333/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_em: input_em
                })
            });

            const result = await response.json();
            console.log('Result:\n', result);

            if (result.status === 'failed') {
                if (result.check_em === 'null') {
                    alert("Email is't already in use.");
                    window.location.href = '../htmls/forgotPassword.html';
                    return;
                }
                alert("Send reset password to server failed.");
                window.location.href = '../htmls/forgotPassword.html';
                return;
            }
            alert("Password reset email sent successfully.\nPlease check you mail or spam/junk folder.\n(Note that the OTP is valid for 3 minutes only)");
            document.getElementById("email").value = '';
        });

        // back to login page
        const backButton = document.getElementById("backButton");

        backButton.addEventListener("click", () => {
            window.location.href = "../htmls/index.html";
        });
});
//---------------------------------------------------------------------//

