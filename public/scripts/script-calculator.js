const display = document.getElementById("display");
        let firstValue = "";
        let operator = "";
        let secondValue = "";

        document.querySelectorAll(".btn").forEach(button => {
            button.addEventListener("click", () => {
                const action = button.dataset.action;
                const number = button.dataset.number;
                
                if (number !== undefined) {
                    if (!operator) {
                        firstValue += number;
                        display.textContent = firstValue;
                    } else {
                        secondValue += number;
                        display.textContent = secondValue;
                    }
                } else if (action) {
                    switch (action) {
                        case "clear":
                            firstValue = "";
                            operator = "";
                            secondValue = "";
                            display.textContent = "0";
                            break;
                        case "sign":
                            if (!operator) {
                                firstValue = (parseFloat(firstValue) * -1).toString();
                                display.textContent = firstValue;
                            } else {
                                secondValue = (parseFloat(secondValue) * -1).toString();
                                display.textContent = secondValue;
                            }
                            break;
                        case "percent":
                            if (!operator) {
                                firstValue = (parseFloat(firstValue) / 100).toString();
                                display.textContent = firstValue;
                            } else {
                                secondValue = (parseFloat(secondValue) / 100).toString();
                                display.textContent = secondValue;
                            }
                            break;
                        case "divide":
                        case "multiply":
                        case "subtract":
                        case "add":
                            operator = action;
                            break;
                        case "equals":
                            if (firstValue && operator && secondValue) {
                                const num1 = parseFloat(firstValue);
                                const num2 = parseFloat(secondValue);
                                let result;
                                
                                switch (operator) {
                                    case "divide":
                                        result = num1 / num2;
                                        break;
                                    case "multiply":
                                        result = num1 * num2;
                                        break;
                                    case "subtract":
                                        result = num1 - num2;
                                        break;
                                    case "add":
                                        result = num1 + num2;
                                        break;
                                }
                                display.textContent = result;
                                firstValue = result.toString();
                                operator = "";
                                secondValue = "";
                            }
                            break;
                        case "decimal":
                            if (!operator) {
                                if (!firstValue.includes(".")) {
                                    firstValue += ".";
                                    display.textContent = firstValue;
                                }
                            } else {
                                if (!secondValue.includes(".")) {
                                    secondValue += ".";
                                    display.textContent = secondValue;
                                }
                            }
                            break;
                    }
                }
            });
        });
