// Sidebar toggle
const wrapper = document.getElementById("wrapper");
const toggleButton = document.getElementById("menu-toggle");
toggleButton.onclick = () => wrapper.classList.toggle("toggled");

// Project Settings
const projectsKey = "projects";

document.addEventListener('DOMContentLoaded', () => {
  loadProjectSettings();
});

// Load project settings
function loadProjectSettings() {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  const projects = JSON.parse(localStorage.getItem(projectsKey)) || [];
  const project = projects.find(p => p.id === projectId);

  if (project) {
    document.getElementById('name-task').textContent = `Settings - ${project.name}`;
    document.getElementById('project-name').value = project.name;
    document.getElementById('project-description').value = project.description || '';
    document.getElementById('visibility').value = project.visibility || 'public';
  } 
}

// Save changes
document.getElementById('project-form').addEventListener('submit', e => {
  e.preventDefault();
  const projectId = new URLSearchParams(window.location.search).get('id');
  const projectName = document.getElementById('project-name').value.trim();
  const description = document.getElementById('project-description').value.trim();
  const visibility = document.getElementById('visibility').value;

  if (!projectName) {
    Swal.fire({
      icon: 'warning',
      title: 'Empty Name',
      text: 'Please enter a project name.',
      confirmButtonColor: '#0366d6'
    });
    return;
  }

  const projects = JSON.parse(localStorage.getItem(projectsKey)) || [];
  const projectIndex = projects.findIndex(p => p.id === projectId);

  if (projectIndex !== -1) {
    projects[projectIndex] = {
      ...projects[projectIndex],
      name: projectName,
      description,
      visibility
    };
    localStorage.setItem(projectsKey, JSON.stringify(projects));
    Swal.fire({
      icon: 'success',
      title: 'Saved',
      text: 'Project settings updated successfully.',
      confirmButtonColor: '#0366d6'
    });
  }
});

// Close project
document.getElementById('close-project').addEventListener('click', () => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Closing this project will disable workflows and hide it from open projects.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#cb2431',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Close Project'
  }).then(result => {
    if (result.isConfirmed) {
      const projectId = new URLSearchParams(window.location.search).get('id');
      const projects = JSON.parse(localStorage.getItem(projectsKey)) || [];
      const projectIndex = projects.findIndex(p => p.id === projectId);
      if (projectIndex !== -1) {
        projects[projectIndex].status = 'Closed';
        localStorage.setItem(projectsKey, JSON.stringify(projects));
        Swal.fire({
          icon: 'success',
          title: 'Project Closed',
          text: 'The project has been closed.',
          confirmButtonColor: '#0366d6'
        }).then(() => {
          
        });
      }
    }
  });
});

// Delete project
document.getElementById('delete-project').addEventListener('click', () => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Deleting this project is permanent and cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#cb2431',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Delete Project'
  }).then(result => {
    if (result.isConfirmed) {
      const projectId = new URLSearchParams(window.location.search).get('id');
      const projects = JSON.parse(localStorage.getItem(projectsKey)) || [];
      const updatedProjects = projects.filter(p => p.id !== projectId);
      localStorage.setItem(projectsKey, JSON.stringify(updatedProjects));
      Swal.fire({
        icon: 'success',
        title: 'Project Deleted',
        text: 'The project has been deleted.',
        confirmButtonColor: '#0366d6'
      }).then(() => {
        window.location.href = '../page/page-new-project.html';
      });
    }
  });
});