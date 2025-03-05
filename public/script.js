class Calculator {
    constructor(displayElement, historyElement) {
        this.displayElement = displayElement;
        this.historyElement = historyElement;
        this.history = [];
        this.clear();
    }
    appendNumber(number) {
        // Si el resultado es un número y se está agregando después de un resultado, reiniciamos la pantalla
        if (this.currentOperand === this.currentOperand || this.currentOperand === 'Error') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }
    
    chooseOperation(operation) {
        if (this.currentOperand === '' || this.currentOperand === 'Error') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }
    
    compute() {
        const prev    = parseFloat(this.previousOperand);
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
