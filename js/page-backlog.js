document.addEventListener("DOMContentLoaded", () => {
    // Handle the "Invite team" button
    const inviteButton = document.querySelector(".invite-btn");
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
          if (!email) {
            return "You need to enter an email address!";
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            return "Please enter a valid email address!";
          }
          return null;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const email = result.value;
          Swal.fire({
            icon: "success",
            title: "Invitation Sent",
            text: `An invitation has been sent to ${email}`,
          });
        }
      });
    });
  
    // Generalized function to handle task column logic
    function setupTaskColumn(columnSelector, columnId) {
      const column = document.querySelector(columnSelector);
      const addButton = column.querySelector(".add-item");
      const taskItems = column.querySelector(".task-items");
  
      // Load tasks from localStorage
      const savedTasks = JSON.parse(localStorage.getItem(`tasks-${columnId}`)) || [];
      savedTasks.forEach((taskName) => {
        createTaskItem(taskName, taskItems, columnId);
      });
  
      // Add new task functionality
      addButton.addEventListener("click", () => {
        Swal.fire({
          title: "Add New Task",
          input: "text",
          inputLabel: "Enter task name:",
          inputPlaceholder: "Task name",
          showCancelButton: true,
          confirmButtonText: "Add Task",
          cancelButtonText: "Cancel",
          inputValidator: (value) => {
            if (!value) {
              return "Task name cannot be empty!";
            }
            return null;
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const taskName = result.value;
            createTaskItem(taskName, taskItems, columnId);
          }
        });
      });
  
      // Function to create and add task item
      function createTaskItem(taskName, taskItems, columnId) {
        const task = document.createElement("div");
        task.className = "task-item";
        task.draggable = true; // Make task draggable
        task.innerHTML = `
          <span>${taskName}</span>
          <button class="delete-btn"><ion-icon name="trash-outline"></ion-icon></button>
        `;
        taskItems.appendChild(task);
  
        // Add delete functionality
        const deleteBtn = task.querySelector(".delete-btn");
        deleteBtn.addEventListener("click", () => {
          task.remove();
          saveTasksToLocalStorage();
        });
  
        // Save tasks to localStorage
        saveTasksToLocalStorage();
  
        // Handle task dragging
        task.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("taskName", taskName); // Set task name as data to transfer
          e.dataTransfer.setData("columnId", columnId); // Set the columnId as data to transfer
          task.classList.add("dragging");
        });
  
        task.addEventListener("dragend", () => {
          task.classList.remove("dragging");
        });
      }
  
      // Function to save tasks to localStorage
      function saveTasksToLocalStorage() {
        const tasks = Array.from(taskItems.querySelectorAll(".task-item span")).map(
          (task) => task.textContent
        );
        localStorage.setItem(`tasks-${columnId}`, JSON.stringify(tasks));
      }
  
      // Enable task drop in columns (across columns)
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
        draggingTask.classList.remove("dragging");
  
        const taskName = e.dataTransfer.getData("taskName");
        const sourceColumnId = e.dataTransfer.getData("columnId");
  
        // Move the task to the new column and update localStorage
        createTaskItem(taskName, taskItems, columnId);
  
        // Remove the task from the source column
        const sourceColumn = document.querySelector(`#${sourceColumnId} .task-items`);
        const taskToRemove = Array.from(sourceColumn.querySelectorAll(".task-item"))
          .find((task) => task.textContent.includes(taskName));
        taskToRemove.remove();
  
        // Update task lists in localStorage
        saveTasksToLocalStorage();
      });
    }
  
    // Initialize task columns
    setupTaskColumn("#todo", "todo");
    setupTaskColumn("#in-progress", "in-progress");
    setupTaskColumn("#done", "done");
  
    setupTaskRow("#todo", "in-progress");
    setupTaskRow("#todo", "done");
    setupTaskRow("#done", "in-progress");
  
  
    // Helper function to get the element after which the dragged item should be placed
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
  });
  