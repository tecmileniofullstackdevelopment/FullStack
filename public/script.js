class Calculator {
    constructor(displayElement, historyElement) {
        this.displayElement = displayElement;
        this.historyElement = historyElement;
        this.history = [];
        this.clear();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return; // Evita múltiples puntos
        
        if(number === 'π'){
            this.currentOperand = Math.PI.toFixed(3); //Agrega el valor de PI redondeado a 3 números
        } else if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number; // Si la pantalla muestra "0" y presionas otro número, reemplaza el "0"
        
        } else {
            this.currentOperand += number; // Agrega el número o "."
        }
    
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;

        if (operation === 'sign') {
            // Implementación del botón ±
            this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
            this.updateDisplay();
            return;
        }

        if (operation === 'percent') {
            // Implementación del botón %
            this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
            this.updateDisplay();
            return;
        }

        if (this.previousOperand !== '') {
            this.compute();
        }

        // Mapeo de operaciones para que coincidan con los botones
        const operationMap = {
            'add': '+',
            'subtract': '-',
            'multiply': '×',
            'divide': '÷'
        };

        this.operation = operationMap[operation] || operation;
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
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = current !== 0 ? prev / current : 'Error';
                break;
            default:
                return;
        }

        this.addToHistory(`${prev} ${this.operation} ${current} = ${computation}`);
        this.currentOperand = parseFloat(computation.toFixed(3)).toString();
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
    const calculator = new Calculator(displayElement, historyElement);

    document.querySelectorAll('.btn, .btnoperator, .topbtn, .equals').forEach(button => {
        const action = button.dataset.action;
        const number = button.dataset.number;

        button.addEventListener('click', () => {
            if (number !== undefined) {
                calculator.appendNumber(number);
            } else if (action === 'decimal') {  // 🔥 Asegurar que el botón decimal se maneja bien
                calculator.appendNumber('.');
            } else if (action === 'clear') {
                calculator.clear();
            } else if (action === 'equals') {
                calculator.compute();
            } else {
                calculator.chooseOperation(action);
            }
        });
    });


    // Lista de temas en orden
    const themes = ["default", "winter", "spring", "summer", "fall"];
    const themeNames = ["Default", "Winter", "Spring", "Summer", "Fall"];
    const themeColors = ["#808080", "#1E3A5F", "#4CAF50", "#FFC107", "#8D6E63"];

    let currentThemeIndex = 0;

    // Función para cambiar el tema
    function changeTheme() {
        const body = document.body;
        const themeBtn = document.getElementById("theme-btn");

        // Cambiar al siguiente tema
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const nextTheme = themes[currentThemeIndex];

        // Aplicar el tema al body
        body.className = nextTheme;

        // Cambiar el texto y color del botón
        themeBtn.textContent = themeNames[currentThemeIndex];
        themeBtn.style.backgroundColor = themeColors[currentThemeIndex];
    }

    // Asignar el evento al botón de tema
    document.getElementById("theme-btn").addEventListener("click", changeTheme);
});
