 const profileImage = document.getElementById("profileImage");
const signoutInterface = document.getElementById("signoutInterface");
const signOutButton = document.getElementById("signOutButton");

// Show the sign-out interface when the profile image is clicked
profileImage.addEventListener("click", () => {
  signoutInterface.classList.remove("d-none");
});

// Handle the sign-out button click
signOutButton.addEventListener("click", () => {
  // Redirect to the login page or perform other sign-out actions
  window.location.href = "../index.html"; // Replace "login.html" with your login page
});

  