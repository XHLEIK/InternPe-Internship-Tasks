let display = document.querySelector('input[name="display"]');
let calculationPerformed = false;

// Function to clear display
function clearDisplay() {
    display.value = '';
}

// Function to delete last character
function deleteLast() {
    display.value = display.value.toString().slice(0, -1);
}

// Function to add number
function addNumber(num) {
    if (calculationPerformed) {
        display.value = '';
        calculationPerformed = false;
    }
    display.value += num;
}

// Function to add operator
function addOperator(op) {
    calculationPerformed = false;
    display.value += op;
}

// Function to calculate result
function calculate() {
    try {
        display.value = eval(display.value);
        calculationPerformed = true;
    } catch (error) {
        display.value = 'Error';
        calculationPerformed = true;
    }
}

// Wait for DOM to load before adding event listeners
document.addEventListener('DOMContentLoaded', function() {
    display = document.querySelector('input[name="display"]');
});
