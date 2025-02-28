class Calculator {
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.clear();
    }

    appendNumber(number) {
        // Si ya se tiene un resultado, reinicia el número
        if (this.resultCalculated) {
            this.currentOperand = number === '.' ? '0.' : number;
            this.resultCalculated = false;
        } else {
            // Si el número es un punto, no agregarlo si ya existe
            if (number === '.' && this.currentOperand.includes('.')) return;
    
            // Si el número es 0 y no hay nada, no agregarlo
            if (this.currentOperand === '0' && number !== '.') {
                this.currentOperand = number;
            } else {
                this.currentOperand += number;
            }
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return; // Evita operar si no hay un número
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
            case 'percent':
                // Si el operador es porcentaje, se realiza el cálculo de acuerdo a si es primer o segundo valor
                if (this.previousOperand !== '') {
                    // Si es el primer valor, entonces: valor * (porcentaje / 100)
                    computation = (prev * current) / 100;
                } else {
                    // Si es el segundo valor, entonces: valor * (porcentaje / 100)
                    computation = (current * prev) / 100;
                }
                break;
            default:
                return;
        }
        this.currentOperand = computation.toString();
        this.resultCalculated = true; // Se marca como resultado calculado
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.resultCalculated = false; // Al limpiar, desmarcamos la bandera de resultado calculado
        this.updateDisplay();
    }

    updateDisplay() {
        let operationSymbol = '';
        // Muestra el operador con su símbolo adecuado
        switch (this.operation) {
            case 'add':
                operationSymbol = '+'; 
                break;
            case 'subtract':
                operationSymbol = '-';
                break;
            case 'multiply':
                operationSymbol = '*';
                break;
            case 'divide':
                operationSymbol = '/';
                break;
            case 'percent':
                operationSymbol = '%';
                break;
            default:
                operationSymbol = '';
        }

        if (this.operation) {
            // Muestra la operación completa en formato: 5 + 5 en vez de que se desaparezca
            this.displayElement.innerText = `${this.previousOperand} ${operationSymbol} ${this.currentOperand}`;
        } else {
            this.displayElement.innerText = this.currentOperand;
        }
    }

    toggleSign() {
        if (this.currentOperand !== '0') {
            this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
            this.updateDisplay();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const displayElement = document.getElementById('display');
    const calculator = new Calculator(displayElement);

    document.querySelectorAll('.btn').forEach(button => {
        const action = button.dataset.action;
        const number = button.dataset.number;
    
        button.addEventListener('click', () => {
            if (number !== undefined) {
                calculator.appendNumber(number);
            } else if (action === 'decimal') {  // Asegurar que el botón `.` funcione
                calculator.appendNumber('.');
            } else if (action === 'clear') {
                calculator.clear();
            } else if (action === 'equals') {
                calculator.compute();
            } else if (action === 'sign') {
                calculator.toggleSign();
            } else if (action === 'percent') {
                calculator.chooseOperation('percent');
            } else {
                calculator.chooseOperation(action);
            }
        });
    });
});
