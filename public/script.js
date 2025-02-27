class Calculator {
    constructor(displayElement, historyElement) {
        this.displayElement = displayElement;
        this.historyElement = historyElement;
        this.history = [];
        this.clear();
    }

    // Agrega un número al operando actual
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand === '0' ? number : this.currentOperand + number;
        this.updateDisplay();
    }

    // Selecciona una operación
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

    // Realiza el cálculo
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

    // Calcula el porcentaje
    calculatePercent() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
        this.updateDisplay();
    }

    // Cambia el signo del número actual
    changeSign() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current * -1).toString();
        this.updateDisplay();
    }

    // Limpia la calculadora
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    // Actualiza el display
    updateDisplay() {
        this.displayElement.innerText = this.currentOperand;
    }

    // Agrega una entrada al historial
    addToHistory(entry) {
        this.history.push(entry);
        this.renderHistory();
    }

    // Renderiza el historial
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

    // Elimina una entrada del historial
    deleteHistory(index) {
        this.history.splice(index, 1);
        this.renderHistory();
    }
}

// Inicialización de la calculadora y eventos
document.addEventListener('DOMContentLoaded', () => {
    const displayElement = document.getElementById('display');
    const historyElement = document.getElementById('history-list');
    const calculator = new Calculator(displayElement, historyElement);

    // Botón de cambio de tema
    const themeButton = document.getElementById('theme-button');
    const body = document.body;

    themeButton.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'light') {
            body.setAttribute('data-theme', 'dark');
            themeButton.textContent = '🌙'; // Icono de luna para tema oscuro
        } else {
            body.setAttribute('data-theme', 'light');
            themeButton.textContent = '☀️'; // Icono de sol para tema claro
        }
    });

    // Event listeners para los botones de la calculadora
    document.querySelectorAll('.btn').forEach(button => {
        const action = button.dataset.action;
        const number = button.dataset.number;
        button.addEventListener('click', () => {
            if (number) calculator.appendNumber(number);
            else if (action === 'clear') calculator.clear();
            else if (action === 'equals') calculator.compute();
            else if (action === 'percent') calculator.calculatePercent();
            else if (action === 'sign') calculator.changeSign();
            else calculator.chooseOperation(action);
        });
    });
});