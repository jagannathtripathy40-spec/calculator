const display = document.getElementById("display");
const previousOperand = document.getElementById("previous-operand");

let expression = "";
let justCalculated = false;

// Add number or operator
function appendValue(value) {
  if (display.value === "Error") {
    clearDisplay();
  }

  if (justCalculated) {
    if (/[0-9.]/.test(value)) {
      expression = "";
    }
    justCalculated = false;
  }

  if (value === ".") {
    const currentNumber = expression.split(/[+\-*/%]/).pop();

    if (currentNumber.includes(".")) {
      return;
    }

    if (currentNumber === "") {
      value = "0.";
    }
  }

  expression += value;
  display.value = expression;
}

// Clear everything
function clearDisplay() {
  expression = "";
  display.value = "";
  previousOperand.textContent = "";
  justCalculated = false;
}

// Delete last character
function deleteNumber() {
  expression = expression.slice(0, -1);
  display.value = expression;
  justCalculated = false;
}

// Calculate result
function calculate() {
  if (expression === "") {
    return;
  }

  try {
    if (!/^[0-9+\-*/%.()\s]+$/.test(expression)) {
      throw new Error("Invalid expression");
    }

    const result = Function('"use strict"; return (' + expression + ")")();

    if (!Number.isFinite(result)) {
      throw new Error("Invalid calculation");
    }

    previousOperand.textContent = expression + " =";

    expression = String(Number(result.toPrecision(12)));

    display.value = expression;
    justCalculated = true;
  } catch (error) {
    display.value = "Error";
    expression = "";
    justCalculated = false;
  }
}

// Keyboard Support
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (/[0-9.+\-*/%]/.test(key) && key.length === 1) {
    appendValue(key);
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Backspace") {
    deleteNumber();
  } else if (key === "Escape") {
    clearDisplay();
  }
});
