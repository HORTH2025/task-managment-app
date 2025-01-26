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

// Add event listener to dynamically created edit buttons
document.getElementById('submitProjectBtn').addEventListener('click', function () {
    const projectName = document.getElementById('projectName').value;

    if (projectName) {
        if (isProjectNameDuplicate(projectName)) {
            Swal.fire({
                icon: 'error', // Use 'error' for duplicate project names
                title: 'Duplicate Project Name',
                text: 'Project name already exists. Please choose a different name.',
                confirmButtonText: 'OK'
            });
            
            return;
        }

        const tableBody = document.querySelector('table tbody');
        const newRow = document.createElement('tr');

        const cellNumber = document.createElement('td');
        const cellName = document.createElement('td');
        const cellActions = document.createElement('td');

        cellNumber.textContent = tableBody.children.length + 1;

        // Create project link
        const projectLink = document.createElement('a');
        projectLink.href = `../page/page-backlog.html?name=${encodeURIComponent(projectName)}`;
        projectLink.textContent = projectName;
        projectLink.className = 'project-link';

        cellName.appendChild(projectLink);

        // Create action button and dropdown
        const actionButton = document.createElement('button');
        actionButton.className = 'btn btn-link dropdown-toggle';
        actionButton.innerHTML = "<i class='bx bx-dots-vertical-rounded'></i>";
        actionButton.setAttribute('data-bs-toggle', 'dropdown');
        actionButton.setAttribute('aria-expanded', 'false');

        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu';

        // Create Edit option
        const editOption = document.createElement('button');
        editOption.className = 'dropdown-item';
        editOption.textContent = 'Edit';
        editOption.onclick = function () {
            openEditModal(projectName, projectLink);
        };

        // Create Delete option
        const deleteOption = document.createElement('button');
        deleteOption.className = 'dropdown-item';
        deleteOption.textContent = 'Delete';
        deleteOption.onclick = function () {
            tableBody.removeChild(newRow);
            removeProjectFromLocalStorage(projectName);
        };

        dropdownMenu.appendChild(editOption);
        dropdownMenu.appendChild(deleteOption);
        cellActions.appendChild(actionButton);
        cellActions.appendChild(dropdownMenu);

        newRow.appendChild(cellNumber);
        newRow.appendChild(cellName);
        newRow.appendChild(cellActions);
        tableBody.appendChild(newRow);

        storeProjectInLocalStorage(projectName);

        // Reset form and close modal
        document.getElementById('projectForm').reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('projectModal'));
        modal.hide();
    } else {
        Swal.fire({
            icon: 'warning', 
            title: 'Empty Project Name',
            text: 'Please enter a valid project name before proceeding.',
            confirmButtonText: 'OK'
        });
    }
    
});

// Function to open the edit modal and handle editing
function openEditModal(currentProjectName, projectLink) {
    // Show the modal
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();

    // Set current project name in the modal's input
    const inputField = document.getElementById('projectNameInput');
    inputField.value = currentProjectName;

    // Save changes button
    document.getElementById('saveChanges').onclick = function () {
        const newProjectName = inputField.value;

        if (newProjectName && !isProjectNameDuplicate(newProjectName)) {
            // Update project link text and href
            projectLink.textContent = newProjectName;
            projectLink.href = `../page/page-backlog.html?name=${encodeURIComponent(newProjectName)}`;

            // Update localStorage
            storeProjectInLocalStorage(newProjectName);
            removeProjectFromLocalStorage(currentProjectName);

            // Close modal
            editModal.hide();
        }else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Project Name',
                text: 'Project name already exists or is invalid. Please try a different name.',
                confirmButtonText: 'OK'
            });
        }
    };
}

// Check for duplicate project names
function isProjectNameDuplicate(projectName) {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    return projects.includes(projectName);
}

// Store project in localStorage
function storeProjectInLocalStorage(projectName) {
    let projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects.push(projectName);
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Remove project from localStorage
function removeProjectFromLocalStorage(projectName) {
    let projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects = projects.filter(project => project !== projectName);
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Load projects from localStorage
function loadProjectsFromLocalStorage() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    const tableBody = document.querySelector('table tbody');

    projects.forEach((project, index) => {
        const newRow = document.createElement('tr');

        const cellNumber = document.createElement('td');
        const cellName = document.createElement('td');
        const cellActions = document.createElement('td');

        cellNumber.textContent = index + 1;

        const projectLink = document.createElement('a');
        projectLink.href = `../page/page-backlog.html?name=${encodeURIComponent(project)}`;
        projectLink.textContent = project;
        projectLink.className = 'project-link';

        cellName.appendChild(projectLink);

        const actionButton = document.createElement('button');
        actionButton.className = 'btn btn-link dropdown-toggle';
        actionButton.innerHTML = "<i class='bx bx-dots-vertical-rounded'></i>";
        actionButton.setAttribute('data-bs-toggle', 'dropdown');
        actionButton.setAttribute('aria-expanded', 'false');

        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu';

        const editOption = document.createElement('button');
        editOption.className = 'dropdown-item';
        editOption.textContent = 'Edit';
        editOption.onclick = function () {
            openEditModal(project, projectLink);
        };

        const deleteOption = document.createElement('button');
        deleteOption.className = 'dropdown-item';
        deleteOption.textContent = 'Delete';
        deleteOption.onclick = function () {
            tableBody.removeChild(newRow);
            removeProjectFromLocalStorage(project);
        };

        dropdownMenu.appendChild(editOption);
        dropdownMenu.appendChild(deleteOption);
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
  
