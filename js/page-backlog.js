document.addEventListener("DOMContentLoaded", () => {
  // Invite Team Member
  const inviteButton = document.querySelector(".invite-btn");
  if (inviteButton) {
      inviteButton.addEventListener("click", () => {
          Swal.fire({
              title: "Invite Team Member",
              input: "email",
              inputLabel: "Enter the email address of the team member:",
              inputPlaceholder: "email@example.com",
              showCancelButton: true,
              confirmButtonText: "Send Invitation",
              cancelButtonText: "Cancel",
              inputValidator: (email) => {
                  if (!email) return "You need to enter an email address!";
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  return emailRegex.test(email) ? null : "Please enter a valid email address!";
              },
          }).then((result) => {
              if (result.isConfirmed) {
                  Swal.fire({
                      icon: "success",
                      title: "Invitation Sent",
                      text: `An invitation has been sent to ${result.value}`,
                  });
              }
          });
      });
  }

// Set project name
  const projectDropdown = document.getElementById("project-dropdown"); // Example dropdown element
  const nameTaskElement = document.getElementById("name-task");

  // Populate selected project name on page load
  const selectedProject = localStorage.getItem("selectedProject");
  if (selectedProject && nameTaskElement) {
      nameTaskElement.textContent = selectedProject;
  }

  // Listen for project selection changes
  if (projectDropdown) {
      projectDropdown.addEventListener("change", () => {
          const selectedOption = projectDropdown.value;

          // Save selected project name to localStorage
          localStorage.setItem("selectedProject", selectedOption);

          // Update the displayed project name
          if (nameTaskElement) {
              nameTaskElement.textContent = selectedOption;
          }
      });
  }

  // Generalized function for task columns
  function setupTaskColumn(columnSelector, columnId) {
      const column = document.querySelector(columnSelector);
      if (!column) return;

      const addButton = column.querySelector(".add-item");
      const taskItems = column.querySelector(".task-items");

      // Load tasks from localStorage
      const savedTasks = JSON.parse(localStorage.getItem(`tasks-${columnId}`)) || [];
      savedTasks.forEach((taskName) => {
          createTaskItem(taskName, taskItems, columnId);
      });

      // Add task button
      if (addButton) {
          addButton.addEventListener("click", () => {
              Swal.fire({
                  title: "Add New Task",
                  input: "text",
                  inputLabel: "Enter task name:",
                  inputPlaceholder: "Task name",
                  showCancelButton: true,
                  confirmButtonText: "Add Task",
                  cancelButtonText: "Cancel",
                  inputValidator: (value) => (value ? null : "Task name cannot be empty!"),
              }).then((result) => {
                  if (result.isConfirmed) {
                      createTaskItem(result.value, taskItems, columnId);
                  }
              });
          });
      }

      // Create and add task
      function createTaskItem(taskName, taskItems, columnId) {
          const task = document.createElement("div");
          task.className = "task-item";
          task.draggable = true;
          task.innerHTML = `
              <span>${taskName}</span>
              <button class="delete-btn"><ion-icon name="trash-outline"></ion-icon></button>
          `;
          taskItems.appendChild(task);

          // Delete task
          task.querySelector(".delete-btn").addEventListener("click", () => {
              task.remove();
              saveTasksToLocalStorage();
              updateTaskCount(column);
          });

          // Drag-and-drop functionality
          task.addEventListener("dragstart", (e) => {
              e.dataTransfer.setData("text/plain", JSON.stringify({ taskName, columnId }));
              task.classList.add("dragging");
          });

          task.addEventListener("dragend", () => task.classList.remove("dragging"));

          // Save tasks
          saveTasksToLocalStorage();
          updateTaskCount(column);
      }

      // Save tasks to localStorage
      function saveTasksToLocalStorage() {
          const tasks = Array.from(taskItems.querySelectorAll(".task-item span")).map(
              (task) => task.textContent
          );
          localStorage.setItem(`tasks-${columnId}`, JSON.stringify(tasks));
      }

      // Drag-over and drop
      column.addEventListener("dragover", (e) => {
          e.preventDefault();
          const draggingTask = document.querySelector(".dragging");
          const afterElement = getDragAfterElement(taskItems, e.clientY);
          if (afterElement == null) {
              taskItems.appendChild(draggingTask);
          } else {
              taskItems.insertBefore(draggingTask, afterElement);
          }
      });

      column.addEventListener("drop", (e) => {
          e.preventDefault();
          const draggingTask = document.querySelector(".dragging");
          if (draggingTask) {
              draggingTask.classList.remove("dragging");
              saveTasksToLocalStorage();
              updateTaskCount(column);
          }
      });

      // Update task count
      function updateTaskCount(column) {
          const count = column.querySelectorAll(".task-item").length;
          const status = column.querySelector(".status");
          if (status) status.textContent = `(${count})`;
      }

      // Get the element after which the dragged task should be placed
      function getDragAfterElement(container, y) {
          const draggableElements = [...container.querySelectorAll(".task-item:not(.dragging)")];
          return draggableElements.reduce(
              (closest, child) => {
                  const box = child.getBoundingClientRect();
                  const offset = y - box.top - box.height / 2;
                  if (offset < 0 && offset > closest.offset) {
                      return { offset, element: child };
                  } else {
                      return closest;
                  }
              },
              { offset: Number.NEGATIVE_INFINITY }
          ).element;
      }
  }
  
// Add new column and save in localStorage
const addColumnButton = document.querySelector(".add-column-btn");
const taskColumns = document.querySelector(".task-columns");

if (addColumnButton && taskColumns) {
  // Load columns from localStorage on page load
  const loadColumns = () => {
      const savedColumns = JSON.parse(localStorage.getItem("columns")) || [];
      savedColumns.forEach(({ id, name, tasks }) => {
          createColumn(id, name, tasks);
      });
  };

  // Save all columns to localStorage
  const saveColumn = (id, name, tasks = []) => {
      // Retrieve existing columns from localStorage
      const existingColumns = JSON.parse(localStorage.getItem("columns")) || [];
  
      // Add the new column to the array
      existingColumns.push({ id, name, tasks });
  
      // Save the updated columns back to localStorage
      localStorage.setItem("columns", JSON.stringify(existingColumns));
  };
  

  // Function to create a new column
  const createColumn = (id, name, tasks = []) => {
      const newColumn = document.createElement("div");
      newColumn.className = "task-column";
      newColumn.id = id;
      newColumn.innerHTML = `
          <div class="column-header">
              <span class="dot ${name.toLowerCase()}"></span> ${name} <span class="status">(${tasks.length})</span>
              <button class="delete-column-btn">🗑️</button>
          </div>
          <div class="task-items">
              ${tasks.map((task) => `<div class="task-item">${task}</div>`).join("")}
          </div>
          <button class="add-item">+ add item</button>
      `;
      // Add the column to the DOM
      taskColumns.insertBefore(newColumn, addColumnButton);

      // Add delete functionality
      const deleteButton = newColumn.querySelector(".delete-column-btn");
      deleteButton.addEventListener("click", () => {
          Swal.fire({
              title: "Are you sure?",
              text: `Do you want to delete the column "${name}"?`,
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes, delete it!",
              cancelButtonText: "Cancel",
          }).then((result) => {
              if (result.isConfirmed) {
                  newColumn.remove();
                  saveColumns();
                  Swal.fire({
                      icon: "success",
                      title: "Deleted!",
                      text: `The column "${name}" has been deleted.`,
                  });
              }
          });
      });

      // Add task functionality
      addItemButton.addEventListener("click", () => {
          Swal.fire({
              title: "Add Task",
              input: "text",
              inputLabel: "Enter task name:",
              inputPlaceholder: "Task name",
              showCancelButton: true,
              confirmButtonText: "Add Task",
              cancelButtonText: "Cancel",
              inputValidator: (value) => (value ? null : "Task name cannot be empty!"),
          }).then((result) => {
              if (result.isConfirmed) {
                  const taskName = result.value;
      
                  const taskItemsContainer = newColumn.querySelector(".task-items");
                  const newTask = document.createElement("div");
                  newTask.className = "task-item";
                  newTask.textContent = taskName;
      
                  taskItemsContainer.appendChild(newTask);
      
                  // Update localStorage with new task
                  const existingColumns = JSON.parse(localStorage.getItem("columns")) || [];
                  const column = existingColumns.find((col) => col.id === newColumn.id);
                  if (column) {
                      column.tasks.push(taskName);
                      localStorage.setItem("columns", JSON.stringify(existingColumns));
                  }
      
                  // Update the status count
                  const status = newColumn.querySelector(".status");
                  const itemCount = taskItemsContainer.querySelectorAll(".task-item").length;
                  status.textContent = `(${itemCount})`;
              }
          });
      });
      
  };

  // Add event listener for adding new column
  addColumnButton.addEventListener("click", () => {
      Swal.fire({
          title: "Add New Column",
          input: "text",
          inputLabel: "Enter column name:",
          inputPlaceholder: "Column name",
          showCancelButton: true,
          confirmButtonText: "Add Column",
          cancelButtonText: "Cancel",
          inputValidator: (value) => (value ? null : "Column name cannot be empty!"),
      }).then((result) => {
          if (result.isConfirmed) {
              const columnName = result.value;
              const columnId = `column-${Date.now()}`;
              createColumn(columnId, columnName);
  
              // Save the new column to localStorage
              saveColumn(columnId, columnName);
          }
      });
  });
  // Load columns on page load
  loadColumns();
}


  // Initialize default columns
  setupTaskColumn("#todo", "todo");
  setupTaskColumn("#in-progress", "in-progress");
  setupTaskColumn("#done", "done");
});
