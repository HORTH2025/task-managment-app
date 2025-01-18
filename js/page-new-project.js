document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#project-table tbody");

  const loadProjects = () => {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    projects.forEach((project, index) => {
      addRowToTable(index + 1, project);
    });
  };

  const saveProjects = () => {
    const projects = Array.from(tableBody.rows).map((row) => row.cells[2].textContent);
    localStorage.setItem("projects", JSON.stringify(projects));
  };

  const isDuplicateProject = (projectName) => {
    return Array.from(tableBody.rows).some((row) => row.cells[1].textContent === projectName);
  };

  const addRowToTable = (rowCount, projectName) => {
    const newRow = tableBody.insertRow();
    newRow.innerHTML = `
    <td style="border: 1px solid #ddd; padding: 8px;">${rowCount}</td>
    <td style="border: 1px solid #ddd; padding: 8px;">${projectName}</td>
    <td style="border: 1px solid #ddd; padding: 8px;">
      <button class="btn-edit" style="background-color: #3498db; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px; margin-right: 10px;">
        Edit
      </button>
      <button class="btn-delete" style="background-color: #e74c3c; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 5px;">
        Delete
      </button>
    </td>
  `;

  newRow.querySelector(".btn-edit").addEventListener("click", () => {
    Swal.fire({
      title: "Edit Project",
      input: "text",
      inputValue: projectName,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: (newName) => {
        if (!newName.trim()) {
          Swal.showValidationMessage("Project name cannot be empty.");
        }
        return newName.trim();
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (isDuplicateProject(result.value)) {
          Swal.fire("Error", `Project "${result.value}" already exists.`, "error");
        } else {
          newRow.cells[1].textContent = result.value;
          saveProjects();
          Swal.fire("Success", "Project updated successfully!", "success");
        }
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
      html: `<input type="text" id="project-name" class="swal2-input" placeholder="Enter project name";  width: 80%;>`,
      showCancelButton: true,
      confirmButtonText: "Create",
      preConfirm: () => {
        const projectName = document.getElementById("project-name").value.trim();
        if (!projectName) {
          Swal.showValidationMessage("Project name is required.");
        }
        return projectName;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (isDuplicateProject(result.value)) {
          Swal.fire("Error", `Project "${result.value}" already exists.`, "error");
        } else {
          const rowCount = tableBody.rows.length + 1;
          addRowToTable(rowCount, result.value);
          saveProjects();
          Swal.fire("Success!", `Project "${result.value}" has been created.`, "success");
        }
      }
    });
  });

  loadProjects();
});
