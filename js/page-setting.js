document.getElementById("close-project").addEventListener("click", () => {
    if (confirm("Are you sure you want to close this project?")) {
      alert("The project has been closed.");
    }
  });
  
  document.getElementById("delete-project").addEventListener("click", () => {
    if (confirm("This action cannot be undone. Do you wish to proceed?")) {
      alert("The project has been deleted.");
    }
  });
  
  document.getElementById("project-form").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Changes have been saved.");
  });
  
  