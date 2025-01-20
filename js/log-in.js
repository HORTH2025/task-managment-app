// Select the form and its input fields
const logInForm = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessageDiv = document.getElementById('error-message'); // Select the error message container
const errorMessageDivPsswd = document.getElementById('error-messagepsswd'); // Select the error message container

// Handle log-in form submission
logInForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const enteredEmail = emailInput.value.trim(); // Trim to remove extra spaces
    const enteredPassword = passwordInput.value.trim();

    // Get stored email and password from localStorage
    const storedEmail = localStorage.getItem('userEmail');
    const storedPassword = localStorage.getItem('userPassword');

    // Clear the error message container
    errorMessageDiv.textContent = '';
    errorMessageDivPsswd.textContent = '';

    // Check if email matches
    if (enteredEmail !== storedEmail) {
        errorMessageDiv.textContent = 'Email is incorrect!';
        return; // Exit if the email is incorrect
    }

    // Check if password matches
    if (enteredPassword !== storedPassword) {
        errorMessageDivPsswd.textContent = 'Password is incorrect!';
        return; // Exit if the password is incorrect
    }

    // Redirect if both email and password are correct
    window.location.href = '../page/page-new-project.html';
});



// Select elements
const forgotPasswordLink = document.getElementById('forgot-password-link');
const reminderMessageDiv = document.getElementById('reminder-message');
const resetForm = document.getElementById('reset-form');
const resetMessageDiv = document.getElementById('reset-message');
const resetEmailInput = document.getElementById('reset-email');

// Handle "Forgot your password?" click
forgotPasswordLink.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior

    // Show the password reset form
    reminderMessageDiv.textContent = '';
    resetForm.style.display = 'block';
});

// Handle password reset form submission
resetForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const enteredEmail = resetEmailInput.value.trim();

    // Simulate email verification (replace with real backend API call)
    const storedEmail = localStorage.getItem('userEmail');
    if (enteredEmail === storedEmail) {
        resetMessageDiv.textContent = 'A password reset link has been sent to your email!';
        resetForm.style.display = 'none';
        // Send the reset link via backend API
        // Example: sendResetLinkToEmail(enteredEmail);
    } else {
        resetMessageDiv.textContent = 'Email not found. Please check and try again.';
    }
});
