//...navbar
var el = document.getElementById("wrapper");
var toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
  el.classList.toggle("toggled");
};
//...navbar

//...contain page 
document.addEventListener('DOMContentLoaded', function () {
  loadProjectsFromLocalStorage();
});
// Add click event listener to all project buttons
document.querySelectorAll('.project-name-btn').forEach(button => {
    button.addEventListener('click', function () {
        const projectName = this.getAttribute('data-project-name'); // Get the project name
        localStorage.setItem('selectedTaskName', projectName); // Store it in localStorage
    });
});

document.getElementById('submitProjectBtn').addEventListener('click', function () {
  const projectName = document.getElementById('projectName').value;

  if (projectName) {
      // Check for duplicate project names
      if (isProjectNameDuplicate(projectName)) {
          alert("Project name already exists. Please choose a different name.");
          return; // Exit the function if duplicate
      }

      const tableBody = document.querySelector('table tbody');
      const newRow = document.createElement('tr');

      const cellNumber = document.createElement('td');
      const cellName = document.createElement('td');
      const cellActions = document.createElement('td');

      cellNumber.textContent = tableBody.children.length + 1; // Auto-increment number

      // Create a link to the project page
      const projectLink = document.createElement('a');
      projectLink.href = `../page/page-backlog.htmll?name=${encodeURIComponent(projectName)}`; // Adjust the URL as needed
      projectLink.textContent = projectName;
      projectLink.className = 'project-link';
      projectLink.target = '_blank'; // Open in a new tab

      cellName.appendChild(projectLink);

      // Create the icon button for actions
      const actionButton = document.createElement('button');
      actionButton.className = 'btn btn-link dropdown-toggle';
      actionButton.innerHTML = "<i class='bx bx-dots-vertical-rounded'></i>";
      actionButton.setAttribute('data-bs-toggle', 'dropdown');
      actionButton.setAttribute('aria-expanded', 'false');

      // Create the dropdown menu
      const dropdownMenu = document.createElement('div');
      dropdownMenu.className = 'dropdown-menu';

      // Create delete option
      const deleteOption = document.createElement('button');
      deleteOption.className = 'dropdown-item';
      deleteOption.textContent = 'Delete';
      deleteOption.onclick = function () {
          tableBody.removeChild(newRow);
          removeProjectFromLocalStorage(projectName);
      };

      // Create edit option
      const editOption = document.createElement('button');
      editOption.className = 'dropdown-item';
      editOption.textContent = 'Edit';
      editOption.onclick = function () {
          const newProjectName = prompt("Enter new project name:", projectName);
          if (newProjectName && !isProjectNameDuplicate(newProjectName)) {
              projectLink.textContent = newProjectName;
              projectLink.href = `../page/page-backlog.html?name=${encodeURIComponent(newProjectName)}`;
              storeProjectInLocalStorage(newProjectName);
              removeProjectFromLocalStorage(projectName);
          } else {
              alert("Project name already exists or is invalid.");
          }
      };

      // Create close option
      const closeOption = document.createElement('button');
      closeOption.className = 'dropdown-item';
      closeOption.textContent = 'Close Project';
      closeOption.onclick = function () {
          alert("Project closed (functionality not implemented).");
      };

      // Append options to dropdown menu
      dropdownMenu.appendChild(deleteOption);
      dropdownMenu.appendChild(editOption);
      dropdownMenu.appendChild(closeOption);

      // Append dropdown menu to the action button
      cellActions.appendChild(actionButton);
      cellActions.appendChild(dropdownMenu);
      newRow.appendChild(cellNumber);
      newRow.appendChild(cellName);
      newRow.appendChild(cellActions);
      tableBody.appendChild(newRow);

      // Store the project in localStorage
      storeProjectInLocalStorage(projectName);

      // Clear the input field and close the modal
      document.getElementById('projectForm').reset();
      const modal = bootstrap.Modal.getInstance(document.getElementById('projectModal'));
      modal.hide();
  } else {
      alert("Project name cannot be empty.");
  }
});

// Function to check for duplicate project names
function isProjectNameDuplicate(projectName) {
  let projects = JSON.parse(localStorage.getItem('projects')) || [];
  return projects.includes(projectName);
}

// Function to store project in localStorage
function storeProjectInLocalStorage(projectName) {
  let projects = JSON.parse(localStorage.getItem('projects')) || [];
  projects.push(projectName);
  localStorage.setItem('projects', JSON.stringify(projects));
}

// Function to remove project from localStorage
function removeProjectFromLocalStorage(projectName) {
  let projects = JSON.parse(localStorage.getItem('projects')) || [];
  projects = projects.filter(project => project !== projectName);
  localStorage.setItem('projects', JSON.stringify(projects));
}

// Function to load projects from localStorage
function loadProjectsFromLocalStorage() {
  const projects = JSON.parse(localStorage.getItem('projects')) || [];
  const tableBody = document.querySelector('table tbody');

  projects.forEach((project, index) => {
      const newRow = document.createElement('tr');

      const cellNumber = document.createElement('td');
      const cellName = document.createElement('td');
      const cellActions = document.createElement('td');

      cellNumber.textContent = index + 1; // Auto-increment number

      // Create a link to the project page
      const projectLink = document.createElement('a');
      projectLink.href = `../page/page-backlog.html?name=${encodeURIComponent(project)}`; // Adjust the URL as needed
      projectLink.textContent = project;
      projectLink.className = 'project-link';

      cellName.appendChild(projectLink);

      // Create the icon button for actions
      const actionButton = document.createElement('button');
      actionButton.className = 'btn btn-link dropdown-toggle';
      actionButton.innerHTML = "<i class='bx bx-dots-vertical-rounded'></i>";
      actionButton.setAttribute('data-bs-toggle', 'dropdown');
      actionButton.setAttribute('aria-expanded', 'false');

      // Create the dropdown menu
      const dropdownMenu = document.createElement('div');
      dropdownMenu.className = 'dropdown-menu';

      // Create delete option
      const deleteOption = document.createElement('button');
      deleteOption.className = 'dropdown-item';
      deleteOption.textContent = 'Delete';
      deleteOption.onclick = function () {
          tableBody.removeChild(newRow);
          removeProjectFromLocalStorage(project);
      };

      // Create edit option
      const editOption = document.createElement('button');
      editOption.className = 'dropdown-item';
      editOption.textContent = 'Edit';
      editOption.onclick = function () {
          const newProjectName = prompt("Enter new project name:", project);
          if (newProjectName && !isProjectNameDuplicate(newProjectName)) {
              projectLink.textContent = newProjectName;
              projectLink.href = `../page/page-backlog.html?name=${encodeURIComponent(newProjectName)}`;
              storeProjectInLocalStorage(newProjectName);
              removeProjectFromLocalStorage(project);
          } else {
              alert("Project name already exists or is invalid.");
          }
      };

      // Create close option
      const closeOption = document.createElement('button');
      closeOption.className = 'dropdown-item';
      closeOption.textContent = 'Close Project';
      closeOption.onclick = function () {
          alert("Project closed (functionality not implemented).");
      };

      // Append options to dropdown menu
      dropdownMenu.appendChild(deleteOption);
      dropdownMenu.appendChild(editOption);
      dropdownMenu.appendChild(closeOption);

      // Append dropdown menu to the action button
      cellActions.appendChild(actionButton);
      cellActions.appendChild(dropdownMenu);
      newRow.appendChild(cellNumber);
      newRow.appendChild(cellName);
      newRow.appendChild(cellActions);
      tableBody.appendChild(newRow);
  });
}


// Event listener for the search input
document.getElementById('searchInput').addEventListener('input', function() {
  const searchTerm = this.value.toLowerCase(); // Get the search term and convert to lowercase
  const tableBody = document.querySelector('table tbody');
  const rows = tableBody.querySelectorAll('tr'); // Get all rows in the table

  rows.forEach(row => {
      const projectName = row.querySelector('td:nth-child(2) a').textContent.toLowerCase(); // Get the project name from the second cell
      if (projectName.includes(searchTerm)) {
          row.style.display = ''; // Show the row if it matches the search term
      } else {
          row.style.display = 'none'; // Hide the row if it doesn't match
      }
  });
});