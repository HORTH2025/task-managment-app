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
                icon: 'error',
                title: 'Duplicate Project Name',
                text: 'Project name already exists. Please choose a different name.',
                confirmButtonText: 'OK'
            });
            return;
        }

        storeProjectInLocalStorage(projectName);
        loadProjectsFromLocalStorage(); // Re-render table after adding
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
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();

    const inputField = document.getElementById('projectNameInput');
    inputField.value = currentProjectName;

    document.getElementById('saveChanges').onclick = function () {
        const newProjectName = inputField.value;

        if (newProjectName && !isProjectNameDuplicate(newProjectName)) {
            projectLink.textContent = newProjectName;
            projectLink.href = `../page/page-backlog.html?name=${encodeURIComponent(newProjectName)}`;

            removeProjectFromLocalStorage(currentProjectName);
            storeProjectInLocalStorage(newProjectName);
            loadProjectsFromLocalStorage(); // Re-render table after editing
            editModal.hide();
        } else {
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

// Store project in localStorage with validation
function storeProjectInLocalStorage(projectName) {
    let projects = JSON.parse(localStorage.getItem('projects')) || [];
    // Validate that projectName is a string and not empty
    if (typeof projectName === 'string' && projectName.trim() !== '' && !projects.includes(projectName)) {
        projects.push(projectName);
        localStorage.setItem('projects', JSON.stringify(projects));
    }
}

// Remove project from localStorage
function removeProjectFromLocalStorage(projectName) {
    let projects = JSON.parse(localStorage.getItem('projects')) || [];
    // Filter out the project name and any invalid entries
    projects = projects.filter(project => {
        if (typeof project !== 'string') return false; // Remove non-strings (like [object Object])
        return project !== projectName;
    });
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Load projects from localStorage
function loadProjectsFromLocalStorage() {
    let projects = JSON.parse(localStorage.getItem('projects')) || [];
    // Clean up projects array: ensure only valid strings remain
    projects = projects.filter(project => typeof project === 'string' && project.trim() !== '');
    localStorage.setItem('projects', JSON.stringify(projects)); // Update localStorage with cleaned data

    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    projects.forEach((project, index) => {
        const newRow = document.createElement('tr');
        newRow.dataset.projectName = project; // Store project name as data attribute

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
            const projectToDelete = newRow.dataset.projectName;
            removeProjectFromLocalStorage(projectToDelete);
            loadProjectsFromLocalStorage(); // Re-render table after deletion
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
document.getElementById('searchInput').addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const tableBody = document.querySelector('table tbody');
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
        const projectName = row.querySelector('td:nth-child(2) a').textContent.toLowerCase();
        if (projectName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

const profileImage = document.getElementById("profileImage");
const signoutInterface = document.getElementById("signoutInterface");
const signOutButton = document.getElementById("signOutButton");

// Show the sign-out interface when the profile image is clicked
profileImage.addEventListener("click", () => {
    signoutInterface.classList.remove("d-none");
});

// Handle the sign-out button click
signOutButton.addEventListener("click", () => {
    window.location.href = "../index.html";
});