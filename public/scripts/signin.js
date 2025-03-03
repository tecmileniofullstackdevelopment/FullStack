document.getElementById("togglePassword").addEventListener("click", function() {
    let passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        this.textContent = "Conceal password";
    } else {
        passwordInput.type = "password";
        this.textContent = "Provide password";
    }
});