// Select the form and its input fields
const form = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');

// Function to display an error message
function showError(input, message) {
    const errorElement = document.createElement('p');
    errorElement.className = 'error-message';
    errorElement.style.color = 'red';
    errorElement.style.fontSize = '0.9em';
    errorElement.innerText = message;

    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
        input.insertAdjacentElement('afterend', errorElement);
    }
}

// Function to remove error messages
function clearErrors() {
    document.querySelectorAll('.error-message').forEach((error) => error.remove());
}

// Form submit event listener
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent the form from submitting

    // Clear previous errors
    clearErrors();

    let isValid = true;

    // Validate email
    if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
        showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
    }

    // Validate password length
    if (passwordInput.value.length < 6) {
        showError(passwordInput, 'Password must be at least 6 characters long.');
        isValid = false;
    }

    // Validate password match
    if (passwordInput.value !== confirmPasswordInput.value) {
        showError(confirmPasswordInput, 'Passwords do not match.');
        isValid = false;
    }

    // If all validations pass
    if (isValid) {
        // alert('Sign up successful!');
        // form.reset(); // Reset the form fields
        window.location.href = "../page/page-new-project.html";
    }
});