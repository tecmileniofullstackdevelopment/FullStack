class Calculator {
    constructor(displayElement, historyElement) {
        this.displayElement = displayElement;
        this.historyElement = historyElement;
        this.history = [];
        this.clear();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand === '0' ? number : this.currentOperand + number;
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        let computation;
        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                computation = current !== 0 ? prev / current : 'Error';
                break;
            default:
                return;
        }
        this.addToHistory(`${prev} ${this.operation} ${current} = ${computation}`);
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    updateDisplay() {
        this.displayElement.innerText = this.currentOperand;
    }

    addToHistory(entry) {
        this.history.push(entry);
        this.renderHistory();
    }

    renderHistory() {
        this.historyElement.innerHTML = '';
        this.history.forEach((entry, index) => {
            const li = document.createElement('li');
            li.innerText = entry;
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'X';
            deleteBtn.classList.add('history-button');
            deleteBtn.addEventListener('click', () => this.deleteHistory(index));
            li.appendChild(deleteBtn);
            this.historyElement.appendChild(li);
        });
    }

    deleteHistory(index) {
        this.history.splice(index, 1);
        this.renderHistory();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const displayElement = document.getElementById('display');
    const historyElement = document.getElementById('history-list');
    const loginContainer = document.getElementById('login-container');
    const calculatorContainer = document.getElementById('calculator-container');
    const logoutButton = document.getElementById('logout-button');
    const loginForm = document.getElementById('login-form');
    const registerLink = document.getElementById('register-link');
    const menuIcon = document.querySelector('.menu-icon');
    const historyDiv = document.querySelector('.history');
    const usernameSpan = document.getElementById("username");

    const calculator = new Calculator(displayElement, historyElement);

    document.querySelectorAll('.btn').forEach(button => {
        const action = button.dataset.action;
        const number = button.dataset.number;
        button.addEventListener('click', () => {
            if (number) calculator.appendNumber(number);
            else if (action === 'clear') calculator.clear();
            else if (action === 'equals') calculator.compute();
            else calculator.chooseOperation(action);
        });
    });

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                loginContainer.classList.add('hidden');
                calculatorContainer.classList.remove('hidden');
                usernameSpan.textContent = 'Hola, ' + data.username;
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    });

    registerLink.addEventListener('click', async () => {
        const username = prompt('Introduce un nombre de usuario:');
        const password = prompt('Introduce una contraseña:');
        if (!username || !password) return;

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                alert('Registro exitoso, ahora inicia sesión.');
            } else {
                alert('Error al registrarse.');
            }
        } catch (error) {
            console.error('Error al registrarse:', error);
        }
    });

    logoutButton.addEventListener('click', async () => {
        try {
            const response = await fetch('/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                loginContainer.classList.remove('hidden');
                calculatorContainer.classList.add('hidden');
            } else {
                console.error("Logout failed");
                alert("Logout Failed")
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("Logout error")
        }
    });

    menuIcon.addEventListener('click', () => {
        historyDiv.classList.toggle('hidden');
    });

    //Check session on load
    fetch('/auth/session-status')
        .then(response => response.json())
        .then(data => {
            if (data.session === 'active') {
                loginContainer.classList.add('hidden');
                calculatorContainer.classList.remove('hidden');
                document.getElementById("username").textContent = 'hola, ' + data.user;
            }
        })
        .catch(error => {
            console.error("Session status error:", error);
        });
});