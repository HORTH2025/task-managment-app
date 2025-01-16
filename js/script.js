document.querySelector(".btn-add").addEventListener("click", () => {
  Swal.fire({
    title: "Create New Project",
    html: `<input type="text" id="project-name" class="swal2-input" placeholder="Enter project name">`,
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
      const tableBody = document.querySelector("#project-table tbody");
      const rowCount = tableBody.rows.length + 1;
      const newRow = tableBody.insertRow();
      newRow.innerHTML = `
        <td style="border: 1px solid #ddd; padding: 8px;">${rowCount}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${result.value}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">
          <button class="btn-delete" style="background-color: #e74c3c; color: white; border: none; padding: 10px 20px; cursor: pointer; margin-right: 20px; border-radius: 5px;
  text-align: center;">
            Delete
          </button>
        </td>
      `;
      
     newRow.querySelector(".btn-delete").addEventListener("click", () => {
        tableBody.removeChild(newRow);
        Swal.fire("Deleted!", "The project has been deleted.", "success");
      });

      Swal.fire("Success!", `Project "${result.value}" has been created.`, "success");
    }
  });
});
