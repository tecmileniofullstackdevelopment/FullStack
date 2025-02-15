document.addEventListener("DOMContentLoaded", function() {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const User = document.getElementById("User");
    const SpanUser = document.getElementById("spanUser");

    const Pwd = document.getElementById("PWD");
    const SpanPwd = document.getElementById("SpanPWD");

    const confirmPwd = document.getElementById("ConfirmPWD");
    const SpanConfirmPwd = document.getElementById("SpanConfirmPWD");

    function resetStyles(input, icon, label ){
        icon.style.backgroundColor = '';
        label.style.backgroundColor = '';
        input.style.color = '';
    }

    usernameInput.addEventListener("input", function() {
        resetStyles(usernameInput, SpanUser, User);
    });

    passwordInput.addEventListener("input", function() {
        resetStyles(passwordInput, SpanPwd, Pwd);
    });

    confirmPasswordInput.addEventListener("input", function() {
        resetStyles(confirmPasswordInput, SpanConfirmPwd, confirmPwd);
    });
});


document.getElementById('registerButton').addEventListener('click', function() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    const User = document.getElementById('User');
    const SpanUser = document.getElementById('spanUser');
    
    const Pwd = document.getElementById('PWD');
    const SpanPwd = document.getElementById('SpanPWD');
    
    const confirmPwd = document.getElementById('ConfirmPWD');
    const SpanConfirmPwd = document.getElementById('SpanConfirmPWD');
    
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = '';
    
    if (!username || !password || !confirmPassword) {
        errorMessage.textContent = 'Please complete all fields.';
        
        User.style.backgroundColor = 'rgb(90, 14, 14)'
        SpanUser.style.color = 'rgb(90, 14, 14)'
        
        Pwd.style.backgroundColor = 'rgb(90, 14, 14)'
        SpanPwd.style.color = 'rgb(90, 14, 14)'

        confirmPwd.style.backgroundColor = 'rgb(90, 14, 14)'
        SpanConfirmPwd.style.color = 'rgb(90, 14, 14)'
        
        return;
    }

    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters.';

        Pwd.style.backgroundColor = 'rgb(90, 14, 14)'
        SpanPwd.style.color = 'rgb(90, 14, 14)'
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match.';

        Pwd.style.backgroundColor = 'rgb(90, 14, 14)'
        SpanPwd.style.color = 'rgb(90, 14, 14)'

        confirmPwd.style.backgroundColor = 'rgb(90, 14, 14)'
        SpanConfirmPwd.style.color = 'rgb(90, 14, 14)'
        return;
    }

    fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            errorMessage.textContent = data.error;
        } else {
            window.location.href = 'index.html';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        errorMessage.textContent = 'Server error. Please try again later.';
    });
});