//---------------------------------------------------------------------// 
//-------------------------SCRIPT FOR DATABASE-------------------------//
//---------------------------------------------------------------------//

//---------------------------------------------------------------------// 
//----------------------------ACTION EVENTS----------------------------//

//---LOGIN---//
document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("login-button");

    const username = document.getElementById("username");
    const password = document.getElementById("password");

    button.addEventListener("click", function () {
      const id = username.value;
      const pass = password.value;

      fetch('https://your-api-url.com/check-login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id, pass })
        })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                if (data.password === pass) {
                    alert('Login successful');
                    window.location.href('dashboard.html');
                } else {
                    alert('Incorrect password');
                }
            } else {
                alert('Username not found in the system');
            }
        })
        .catch(error => {
            console.error('An error occurred during login:', error);
        });
    });
});
//---------------------------------------------------------------------//

//---REGISTER---//

//---------------------------------------------------------------------//
