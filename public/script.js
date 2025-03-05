class Calculator {
    constructor(displayElement, historyElement) {
        this.displayElement = displayElement;
        this.historyElement = historyElement;
        this.history = [];
        this.clear();
        this.hasComputed = false;  // Variable global que indica si se ha realizado una operación
    }

    appendNumber(number) {
        // Si ya se realizó una operación o el resultado es '0' o 'Error', reiniciamos el display
        if (this.hasComputed || this.currentOperand === '0' || this.currentOperand === 'Error') {
            this.currentOperand = number;  // Inicia el número nuevo
            this.hasComputed = false;  // Restablece la variable
        } else {
            this.currentOperand += number;  // Continúa agregando números al valor actual
        }
        this.updateDisplay();
    }

    appendDecimal() {
        // Prevenir agregar más de un punto en el número
        if (!this.currentOperand.includes('.')) {
            this.currentOperand += '.';
        }
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

        this.addToHistory(`${prev} ${this.operation} ${current} = ${computation.toFixed(3).toString()}`);
        this.currentOperand = parseFloat(computation.toFixed(3)).toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.hasComputed = true;  // Indica que una operación se ha realizado
        this.updateDisplay();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.hasComputed = false;  // Restablece la variable al limpiar
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

// Lógica para los botones en el HTML
document.addEventListener('DOMContentLoaded', () => {
    const displayElement = document.getElementById('display');
    const historyElement = document.getElementById('history-list');
    const calculator = new Calculator(displayElement, historyElement);

    document.querySelectorAll('.btn').forEach(button => {
        const action = button.dataset.action;
        const number = button.dataset.number;

        button.addEventListener('click', () => {
            if (number !== undefined) calculator.appendNumber(number);
            else if (action === 'clear') calculator.clear();
            else if (action === 'equals') calculator.compute();
            else if (action === 'decimal') calculator.appendDecimal();
            else calculator.chooseOperation(action);
        });
    });
});

function showLoading() {
    document.getElementById("loading").style.display = "flex";
}

function hideLoading() {
    document.getElementById("loading").style.display = "none";
}

function toggleTheme() {
    document.body.classList.toggle('light-mode');
}
