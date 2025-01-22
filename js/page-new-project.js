document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#project-table tbody");

  const loadProjects = () => {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    projects.forEach((project, index) => {
      addRowToTable(index + 1, project);
    });
  };

  const saveProjects = () => {
    const projects = Array.from(tableBody.rows).map((row) => row.cells[1].textContent);
    localStorage.setItem("projects", JSON.stringify(projects));
  };

  const isDuplicateProject = (projectName) => {
    return Array.from(tableBody.rows).some((row) => row.cells[1].textContent === projectName);
  };

 const handleProjectClick = (projectName) => {
  // Store the selected project in localStorage
  localStorage.setItem("selectedProject", projectName);

  // Navigate to the backlog page
  window.location.href = "../page/page-backlog.html";
};


  const addRowToTable = (rowCount, projectName) => {
    const newRow = tableBody.insertRow();
    newRow.innerHTML = `
      <td>${rowCount}</td>
      <td><a href="#" class="project-name">${projectName}</a></td>
      <td>
        <button class="btn-edit">Edit</button>
        <button class="btn-delete">Delete</button>
      </td>
    `;

    newRow.querySelector(".project-name").addEventListener("click", () => handleProjectClick(projectName));
    newRow.querySelector(".btn-edit").addEventListener("click", () => {
      Swal.fire({
        title: "Edit Project",
        input: "text",
        inputValue: projectName,
        showCancelButton: true,
        confirmButtonText: "Save",
      }).then((result) => {
        if (result.isConfirmed && !isDuplicateProject(result.value)) {
          newRow.cells[1].querySelector(".project-name").textContent = result.value;
          saveProjects();
          Swal.fire("Success", "Project updated successfully!", "success");
        } else {
          Swal.fire("Error", "Project name is duplicate or invalid!", "error");
        }
      });
    });

    newRow.querySelector(".btn-delete").addEventListener("click", () => {
      tableBody.removeChild(newRow);
      saveProjects();
      Swal.fire("Deleted!", "The project has been deleted.", "success");
    });
  };

  document.querySelector(".btn-add").addEventListener("click", () => {
    Swal.fire({
      title: "Create New Project",
      input: "text",
      inputPlaceholder: "Enter project name",
      showCancelButton: true,
      confirmButtonText: "Create",
    }).then((result) => {
      if (result.isConfirmed && !isDuplicateProject(result.value)) {
        addRowToTable(tableBody.rows.length + 1, result.value);
        saveProjects();
        Swal.fire("Success!", `Project "${result.value}" has been created.`, "success");
      } else {
        Swal.fire("Error", "Project name is duplicate or invalid!", "error");
      }
    });
  });

  loadProjects();
});
