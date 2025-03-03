document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordField = document.getElementById("password");
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const errorMessage = document.getElementById("errorMessage");
    const errorUser = document.getElementById('inputUser');
    const errorPassword = document.getElementById('inputPwd');

    document.getElementById("username").addEventListener("input", function() {
        errorMessage.style.display = "none";
        errorUser.style.backgroundColor = '';

    });
    
    document.getElementById("password").addEventListener("input", function() {
        errorMessage.style.display = "none";
        errorPassword.style.backgroundColor = '';

    });
});



document.getElementById("loginButton").addEventListener("click", function () {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const errorMessage = document.getElementById("errorMessage");

    const loader = document.querySelector(".wrapper");
    const bgloader = document.getElementById("loader");
    let overlay = document.querySelector(".loader-overlay");

    //span
    const spanUserError = document.getElementById('spanUser')
    const spanPwdError = document.getElementById('spanPwd')

    const inputUserError = document.getElementById('inputUser')
    const inputPwdError = document.getElementById('inputPwd')

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.classList.add("loader-overlay");
        document.body.appendChild(overlay);
    }
    
    if (!username || !password) {
        errorMessage.textContent = "Please complete both fields.";
        errorMessage.style.display = "block";
        
        spanUserError.style.color = 'rgb(90, 14, 14)';
        spanPwdError.style.color = 'rgb(90, 14, 14)';

        inputUserError.style.backgroundColor = 'rgb(90, 14, 14)';
        inputPwdError.style.backgroundColor = 'rgb(90, 14, 14)';
        return;
    }

    // Show loader and overlay
    loader.style.display = "block";
    bgloader.style.display = "block";
    overlay.style.display = "block";

    setTimeout(() => {
        fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                errorMessage.textContent = data.error;
                errorMessage.style.display = "block";    

                // Hide loader and overlay on error
                loader.style.display = "none";
                overlay.style.display = "none";
                bgloader.style.display = "none";
            } else {
                window.location.href = "calculator.html";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = "Server error.";
            errorMessage.style.display = "block";

            // Hide loader and overlay on error
            loader.style.display = "none";
            overlay.style.display = "none";
            bgloader.style.display = "none";
        });
    }, 2000); // Small delay to allow UI to update
});