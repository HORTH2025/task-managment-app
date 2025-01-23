// document.addEventListener("DOMContentLoaded", () => {
//     // Invite Team Member
// const inviteButton = document.querySelector(".invite-btn");
// if (inviteButton) {
//     inviteButton.addEventListener("click", () => {
//         Swal.fire({
//             title: "Invite Team Member",
//             input: "email",
//             inputLabel: "Enter the email address of the team member:",
//             inputPlaceholder: "email@example.com",
//             showCancelButton: true,
//             confirmButtonText: "Send Invitation",
//             cancelButtonText: "Cancel",
//             inputValidator: (email) => {
//                 if (!email) return "You need to enter an email address!";
//                 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//                 return emailRegex.test(email) ? null : "Please enter a valid email address!";
//             },
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 // Send request to the back-end
//                 fetch("http://localhost:8080/api/invite", { // Fixed the URL
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({
//                         email: result.value,
//                         projectId: "123456", // Replace with actual project ID
//                     }),
//                 })
//                     .then((response) => {
//                         if (!response.ok) {
//                             throw new Error(`HTTP error! status: ${response.status}`);
//                         }
//                         return response.json();
//                     })
//                     .then((data) => {
//                         if (data.success) {
//                             Swal.fire({
//                                 icon: "success",
//                                 title: "Invitation Sent",
//                                 text: `An invitation has been sent to ${result.value}`,
//                             });
//                         } else {
//                             Swal.fire({
//                                 icon: "error",
//                                 title: "Error",
//                                 text: data.message || "Something went wrong!",
//                             });
//                         }
//                     })
//                     .catch((error) => {
//                         Swal.fire({
//                             icon: "error",
//                             title: "Error",
//                             text: error.message || "Failed to send invitation. Please try again.",
//                         });
//                         console.error("Error:", error);
//                     });
//             }
//         });
//     });
// }



//     // Set project name
//     const projectDropdown = document.getElementById("project-dropdown");
//     const nameTaskElement = document.getElementById("name-task");

//     // Populate selected project name on page load
//     const selectedProject = localStorage.getItem("selectedProject");
//     if (selectedProject && nameTaskElement) {
//         nameTaskElement.textContent = selectedProject;
//     }

//     // Listen for project selection changes
//     if (projectDropdown) {
//         projectDropdown.addEventListener("change", () => {
//             const selectedOption = projectDropdown.value;

//             // Save selected project name to localStorage
//             localStorage.setItem("selectedProject", selectedOption);

//             // Update the displayed project name
//             if (nameTaskElement) {
//                 nameTaskElement.textContent = selectedOption;
//             }
//         });
//     }

//     // Generalized function for task columns
//     // Generalized function for task columns
//     function setupTaskColumn(columnSelector, columnId) {
//         const column = document.querySelector(columnSelector);
//         if (!column) return;

//         const addButton = column.querySelector(".add-item");
//         const taskItems = column.querySelector(".task-items");

//         // Load tasks for this specific column from localStorage
//         const savedTasks = JSON.parse(localStorage.getItem(`tasks-${columnId}`)) || [];
//         savedTasks.forEach((taskData) => {
//             createTaskItem(taskData.name, taskData.status, taskItems, columnId);
//         });

//         // Add task button
//         if (addButton) {
//             addButton.addEventListener("click", () => {
//                 Swal.fire({
//                     title: "Add New Task",
//                     input: "text",
//                     inputLabel: "Enter task name:",
//                     inputPlaceholder: "Task name",
//                     showCancelButton: true,
//                     confirmButtonText: "Add Task",
//                     cancelButtonText: "Cancel",
//                     inputValidator: (value) => (value ? null : "Task name cannot be empty!"),
//                 }).then((result) => {
//                     if (result.isConfirmed) {
//                         createTaskItem(result.value, "active", taskItems, columnId);
//                     }
//                 });
//             });
//         }

//         // Create and add task
//         function createTaskItem(taskName, status, taskItems, columnId) {
//             // Generate a unique ID for the task item
//             const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

//             // Create the task item element
//             const task = document.createElement("div");
//             task.className = `task-item ${status}`;
//             task.id = taskId;
//             task.draggable = true;
//             task.innerHTML = `
//             <span>${taskName}</span>
//             <span class="task-status" style="font-size:15px; margin-right:20px; color:green;">
//                 ${status === "closed" ? "✔" : ""}
//             </span>
//             <ion-icon name="ellipsis-vertical-outline" class="options-btn" style="font-size:20px; margin-left:0px;"></ion-icon>
//         `;

//             // Append the new task to the taskItems container
//             taskItems.appendChild(task);

//             // Add event listeners for task options
//             const optionsBtn = task.querySelector(".options-btn");
//             optionsBtn.addEventListener("click", () => {
//                 Swal.fire({
//                     title: "Task Options",
//                     html: `
//                     <button id="comment-btn" class="swal-btn">Comment</button>
//                     <button id="edit-name-btn" class="swal-btn">Edit Name</button>
//                     <button id="close-task-btn" class="swal-btn">Close Task</button>
//                     <button id="delete-btn" class="swal-btn">Delete</button>
//                 `,
//                     showConfirmButton: false,
//                     showCancelButton: true,
//                     cancelButtonText: "Cancel",
//                     didRender: () => {
//                         document.getElementById("comment-btn").addEventListener("click", () => {
//                             Swal.close();
//                             Swal.fire({
//                                 title: "Add Comment",
//                                 input: "textarea",
//                                 inputLabel: "Enter your comment:",
//                                 inputPlaceholder: "Write something...",
//                                 showCancelButton: true,
//                                 confirmButtonText: "Add Comment",
//                             }).then((commentResult) => {
//                                 if (commentResult.isConfirmed) {
//                                     const comment = document.createElement("div");
//                                     comment.className = "task-comment";
//                                     comment.textContent = commentResult.value;
//                                     task.appendChild(comment);
//                                     saveTasksToLocalStorage(columnId);
//                                 }
//                             });
//                         });

//                         document.getElementById("edit-name-btn").addEventListener("click", () => {
//                             Swal.close();
//                             Swal.fire({
//                                 title: "Change Task Name",
//                                 input: "text",
//                                 inputLabel: "New task name:",
//                                 inputValue: taskName,
//                                 inputPlaceholder: "Enter new name",
//                                 showCancelButton: true,
//                                 confirmButtonText: "Save",
//                                 inputValidator: (value) => (value ? null : "Task name cannot be empty!"),
//                             }).then((nameResult) => {
//                                 if (nameResult.isConfirmed) {
//                                     taskName = nameResult.value;
//                                     task.querySelector("span").textContent = taskName;
//                                     saveTasksToLocalStorage(columnId);
//                                 }
//                             });
//                         });

//                         document.getElementById("close-task-btn").addEventListener("click", () => {
//                             Swal.close();
//                             Swal.fire({
//                                 title: "Are you sure?",
//                                 text: "This task will be marked as closed.",
//                                 icon: "warning",
//                                 showCancelButton: true,
//                                 confirmButtonText: "Yes, close it!",
//                                 cancelButtonText: "No, keep it",
//                             }).then((closeResult) => {
//                                 if (closeResult.isConfirmed) {
//                                     task.classList.add("closed");
//                                     task.querySelector(".task-status").textContent = "✔";
//                                     saveTasksToLocalStorage(columnId);
//                                     Swal.fire("Closed!", "Your task has been marked as closed.", "success");
//                                 }
//                             });
//                         });

//                         document.getElementById("delete-btn").addEventListener("click", () => {
//                             Swal.close();
//                             Swal.fire({
//                                 title: "Are you sure?",
//                                 text: "This task will be permanently deleted.",
//                                 icon: "warning",
//                                 showCancelButton: true,
//                                 confirmButtonText: "Yes, delete it!",
//                                 cancelButtonText: "No, keep it",
//                             }).then((deleteResult) => {
//                                 if (deleteResult.isConfirmed) {
//                                     task.remove();
//                                     saveTasksToLocalStorage(columnId);
//                                     Swal.fire("Deleted!", "Your task has been deleted.", "success");
//                                 }
//                             });
//                         });
//                     },
//                 });
//             });

//             // Drag-and-drop functionality
//             task.addEventListener("dragstart", () => {
//                 task.classList.add("dragging");
//             });

//             task.addEventListener("dragend", () => {
//                 task.classList.remove("dragging");
//             });

//             // Save tasks to localStorage for the current column
//             saveTasksToLocalStorage(columnId);
//         }

//         // Save tasks to localStorage for this specific column
//         function saveTasksToLocalStorage(columnId) {
//             const tasks = Array.from(taskItems.querySelectorAll(".task-item")).map((task) => ({
//                 name: task.querySelector("span").textContent.trim(),
//                 status: task.classList.contains("closed") ? "closed" : "active",
//             }));
//             localStorage.setItem(`tasks-${columnId}`, JSON.stringify(tasks));
//         }

//         // Drag-over and drop
//         column.addEventListener("dragover", (e) => {
//             e.preventDefault();
//             const draggingTask = document.querySelector(".dragging");
//             const afterElement = getDragAfterElement(taskItems, e.clientY);
//             if (afterElement == null) {
//                 taskItems.appendChild(draggingTask);
//             } else {
//                 taskItems.insertBefore(draggingTask, afterElement);
//             }
//         });

//         column.addEventListener("drop", (e) => {
//             e.preventDefault();
//             const draggingTask = document.querySelector(".dragging");
//             if (draggingTask) {
//                 draggingTask.classList.remove("dragging");
//                 saveTasksToLocalStorage(columnId); // Save tasks for the current column after dragging
//                 updateTaskCount();
//             }
//         });

//         // Get the element after which the dragged task should be placed
//         function getDragAfterElement(container, y) {
//             const draggableElements = [...container.querySelectorAll(".task-item:not(.dragging)")];
//             return draggableElements.reduce(
//                 (closest, child) => {
//                     const box = child.getBoundingClientRect();
//                     const offset = y - box.top - box.height / 2;
//                     if (offset < 0 && offset > closest.offset) {
//                         return { offset, element: child };
//                     } else {
//                         return closest;
//                     }
//                 },
//                 { offset: Number.NEGATIVE_INFINITY }
//             ).element;
//         }
//     }


//     // Add new column and save in localStorage
//     const addColumnButton = document.querySelector(".add-column-btn");
//     const taskColumns = document.querySelector(".task-columns");

//     if (addColumnButton && taskColumns) {
//         // Load columns from localStorage on page load
//         const loadColumns = () => {
//             const savedColumns = JSON.parse(localStorage.getItem("columns")) || [];
//             savedColumns.forEach(({ id, name, tasks }) => {
//                 createColumn(id, name, tasks);
//             });
//         };

//         // Save all columns to localStorage
//         const saveColumn = (id, name, tasks = []) => {
//             // Retrieve existing columns from localStorage
//             const existingColumns = JSON.parse(localStorage.getItem("columns")) || [];

//             // Add the new column to the array
//             existingColumns.push({ id, name, tasks });

//             // Save the updated columns back to localStorage
//             localStorage.setItem("columns", JSON.stringify(existingColumns));
//         };

//         // Function to create a new column
//         const createColumn = (id, name, tasks = []) => {
//             const newColumn = document.createElement("div");
//             newColumn.className = "task-column";
//             newColumn.id = id;
//             newColumn.innerHTML = `
//         <div class="column-header" style="margin-top:-1px;">
//         <img src="../image/round-circle.png" class="circle" style="width:11px; height: 11px; border-radius: 50%; margin-top:-5px;">
//             <span class="dot ${name.toLowerCase()}" style="margin-top:-5px;"></span> 
//             <span class="column-name" style="margin-top:-1px;">${name}</span>
//             <button class="column-actions" style="border: none; margin-left:100px; background-color:#f9f9f9;">
//                 <ion-icon name="ellipsis-horizontal-outline" 
//                 style="color:black; margin-left: 50px;"></ion-icon>
//     </button>
//         </div>
//         <div class="task-items">
//             ${tasks.map((task) => `<div class="task-item">${task}</div>`).join("")}
//         </div>
//         <button class="add-item">+ add item</button>
//     `;
//             // Add the column to the DOM
//             taskColumns.insertBefore(newColumn, addColumnButton);

//             // Handle column actions (edit/delete)
//             const columnActionsButton = newColumn.querySelector(".column-actions");
//             columnActionsButton.addEventListener("click", () => {
//                 Swal.fire({
//                     title: "Manage Column",
//                     showCancelButton: true,
//                     confirmButtonText: "Edit Name",
//                     cancelButtonText: "Delete Column",
//                 }).then((result) => {
//                     if (result.isConfirmed) {
//                         // Edit column name
//                         Swal.fire({
//                             title: "Edit Column Name",
//                             input: "text",
//                             inputLabel: "Enter new column name:",
//                             inputValue: name,
//                             inputPlaceholder: "Column name",
//                             showCancelButton: true,
//                             confirmButtonText: "Save",
//                             cancelButtonText: "Cancel",
//                         }).then((editResult) => {
//                             if (editResult.isConfirmed && editResult.value) {
//                                 const newName = editResult.value;

//                                 // Update the column name in the DOM
//                                 newColumn.querySelector(".column-name").textContent = newName;

//                                 // Update the column name in localStorage
//                                 const existingColumns = JSON.parse(localStorage.getItem("columns")) || [];
//                                 const column = existingColumns.find((col) => col.id === id);
//                                 if (column) {
//                                     column.name = newName;
//                                     localStorage.setItem("columns", JSON.stringify(existingColumns));
//                                 }
//                             }
//                         });
//                     } else {
//                         // Delete column
//                         Swal.fire({
//                             title: "Are you sure?",
//                             text: `Do you want to delete the column "${name}"?`,
//                             icon: "warning",
//                             showCancelButton: true,
//                             confirmButtonText: "Yes, delete it!",
//                             cancelButtonText: "Cancel",
//                         }).then((deleteResult) => {
//                             if (deleteResult.isConfirmed) {
//                                 // Remove the column from the DOM
//                                 newColumn.remove();



//                                 // Remove the column from localStorage
//                                 const existingColumns = JSON.parse(localStorage.getItem("columns")) || [];
//                                 const updatedColumns = existingColumns.filter((col) => col.id !== id);
//                                 localStorage.setItem("columns", JSON.stringify(updatedColumns));

//                                 Swal.fire({
//                                     icon: "success",
//                                     title: "Deleted!",
//                                     text: `The column "${name}" has been deleted.`,
//                                 });
//                             }
//                         });
//                     }
//                 });
//             });

//             // Add task functionality
//             const addItemButton = newColumn.querySelector(".add-item");
//             addItemButton.addEventListener("click", () => {
//                 Swal.fire({
//                     title: "Add Task",
//                     input: "text",
//                     inputLabel: "Enter task name:",
//                     inputPlaceholder: "Task name",
//                     showCancelButton: true,
//                     confirmButtonText: "Add Task",
//                     cancelButtonText: "Cancel",
//                     inputValidator: (value) => (value ? null : "Task name cannot be empty!"),
//                 }).then((result) => {
//                     if (result.isConfirmed) {
//                         const taskName = result.value;

//                         const taskItemsContainer = newColumn.querySelector(".task-items");
//                         const newTask = document.createElement("div");
//                         newTask.className = "task-item";
//                         newTask.textContent = taskName;

//                         taskItemsContainer.appendChild(newTask);

//                         // Update localStorage with new task
//                         const existingColumns = JSON.parse(localStorage.getItem("columns")) || [];
//                         const column = existingColumns.find((col) => col.id === newColumn.id);
//                         if (column) {
//                             column.tasks.push(taskName);
//                             localStorage.setItem("columns", JSON.stringify(existingColumns));
//                         }

//                         // Update the status count
//                         const status = newColumn.querySelector(".status");
//                         const itemCount = taskItemsContainer.querySelectorAll(".task-item").length;
//                         status.textContent = `(${itemCount})`;
//                     }
//                 });
//             });
//         };

//         // Add event listener for adding new column
//         addColumnButton.addEventListener("click", () => {
//             Swal.fire({
//                 title: "Add New Column",
//                 input: "text",
//                 inputLabel: "Enter column name:",
//                 inputPlaceholder: "Column name",
//                 showCancelButton: true,
//                 confirmButtonText: "Add Column",
//                 cancelButtonText: "Cancel",
//                 inputValidator: (value) => (value ? null : "Column name cannot be empty!"),
//             }).then((result) => {
//                 if (result.isConfirmed) {
//                     const columnName = result.value;
//                     const columnId = `column-${Date.now()}`;
//                     createColumn(columnId, columnName);

//                     // Save the new column to localStorage
//                     saveColumn(columnId, columnName);
//                 }
//             });
//         });
//         // Load columns on page load
//         loadColumns();
//     }
//     // Initialize default columns
//     setupTaskColumn("#todo");
//     setupTaskColumn("#in-progress");
//     setupTaskColumn("#done");
// })

//... navbar
var el = document.getElementById("wrapper");
var toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};

//...container
// Load existing columns and items from localStorage when the page loads
document.addEventListener('DOMContentLoaded', function () {
    loadColumnsFromLocalStorage();
});

// Add item functionality
document.querySelectorAll('.add-item').forEach(button => {
    button.addEventListener('click', function () {
        const columnId = this.getAttribute('data-column'); // Get the column ID
        const addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'));
        addItemModal.show();

        // Save item button click event
        document.getElementById('saveItemBtn').onclick = function () {
            const itemName = document.getElementById('newItemName').value;

            if (itemName) {
                const newItem = document.createElement('div');
                newItem.className = 'task-item';
                newItem.textContent = itemName; // Set the text of the new item

                // Append the new item to the corresponding task column
                const taskItems = document.querySelector(`#${columnId} .task-items`);
                taskItems.appendChild(newItem);

                // Store the item in localStorage
                storeItemInLocalStorage(columnId, itemName);

                // Clear the input and hide the modal
                document.getElementById('newItemName').value = '';
                addItemModal.hide();
            }
        };
    });
});

// Add column functionality
document.querySelector('.add-column-btn').addEventListener('click', function () {
    const columnName = prompt("Enter the new column name:");

    if (columnName) {
        const newColumn = document.createElement('div');
        newColumn.className = 'task-column';
        newColumn.innerHTML = `
            <div class="column-header">
                <span class="dot"></span> ${columnName}
                <button class="btn btn-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class='bx bx-dots-vertical'></i>
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item edit-column">Edit Name</a></li>
                    <li><a class="dropdown-item delete-column">Delete</a></li>
                </ul>
            </div>
            <div class="task-items"></div>
            <button class="add-item" data-column="${columnName}">+ add item</button>
        `;

        // Append the new column to the task columns section
        document.getElementById('taskColumns').appendChild(newColumn);

        // Add event listener for the new add item button
        newColumn.querySelector('.add-item').addEventListener('click', function () {
            const addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'));
            addItemModal.show();

            // Save item button click event
            document.getElementById('saveItemBtn').onclick = function () {
                const itemName = document.getElementById('newItemName').value;

                if (itemName) {
                    const newItem = document.createElement('div');
                    newItem.className = 'task-item';
                    newItem.textContent = itemName; // Set the text of the new item

                    // Append the new item to the corresponding task column
                    const taskItems = newColumn.querySelector('.task-items');
                    taskItems.appendChild(newItem);

                    // Store the item in localStorage
                    storeItemInLocalStorage(columnName, itemName);

                    // Clear the input and hide the modal
                    document.getElementById('newItemName').value = '';
                    addItemModal.hide();
                }
            };
        });

        // Store the new column in localStorage
        storeColumnInLocalStorage(columnName);
    }
});

// Function to store item in localStorage
function storeItemInLocalStorage(columnId, itemName) {
    let columns = JSON.parse(localStorage.getItem('columns')) || {};
    if (!columns[columnId]) {
        columns[columnId] = [];
    }
    columns[columnId].push(itemName);
    localStorage.setItem('columns', JSON.stringify(columns));
}

// Function to store new column in localStorage
function storeColumnInLocalStorage(columnName) {
    let columns = JSON.parse(localStorage.getItem('columns')) || {};
    if (!columns[columnName]) {
        columns[columnName] = [];
    }
    localStorage.setItem('columns', JSON.stringify(columns));
}

// Function to load columns and items from localStorage
function loadColumnsFromLocalStorage() {
    const columns = JSON.parse(localStorage.getItem('columns')) || {};
    const taskColumns = document.querySelector('.task-columns');

    for (const columnId in columns) {
        const newColumn = document.createElement('div');
        newColumn.className = 'task-column';
        newColumn.innerHTML = `
            <div class="column-header">
                <span class="dot"></span> ${columnId}
                <button class="btn btn-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class='bx bx-dots-vertical'></i>
                </button>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item edit-column">Edit Name</a></li>
                    <li><a class="dropdown-item delete-column">Delete</a></li>
                </ul>
            </div>
            <div class="task-items"></div>
            <button class="add-item" data-column="${columnId}">+ add item</button>
        `;

        // Append the new column to the task columns section
        taskColumns.appendChild(newColumn);

        // Load items for the column
        const taskItems = newColumn.querySelector('.task-items');
        columns[columnId].forEach(itemName => {
            const newItem = document.createElement('div');
            newItem.className = 'task-item';
            newItem.textContent = itemName; // Set the text of the new item
            taskItems.appendChild(newItem);
        });

        // Add event listener for the new add item button
        newColumn.querySelector('.add-item').addEventListener('click', function () {
            const addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'));
            addItemModal.show();

            // Save item button click event
            document.getElementById('saveItemBtn').onclick = function () {
                const itemName = document.getElementById('newItemName').value;

                if (itemName) {
                    const newItem = document.createElement('div');
                    newItem.className = 'task-item';
                    newItem.textContent = itemName; // Set the text of the new item

                    // Append the new item to the corresponding task column
                    const taskItems = newColumn.querySelector('.task-items');
                    taskItems.appendChild(newItem);

                    // Store the item in localStorage
                    storeItemInLocalStorage(columnId, itemName);

                    // Clear the input and hide the modal
                    document.getElementById('newItemName').value = '';
                    addItemModal.hide();
                }
            };
        });

        // Add event listeners for edit and delete options
        newColumn.querySelector('.dropdown-menu .edit-column').addEventListener('click', function () {
            const newColumnName = prompt("Enter the new column name:", columnId);
            if (newColumnName) {
                newColumn.querySelector('.column-header span').textContent = newColumnName;
                // Update localStorage
                updateColumnInLocalStorage(columnId, newColumnName);
            }
        });

        newColumn.querySelector('.dropdown-menu .delete-column').addEventListener('click', function () {
            if (confirm("Are you sure you want to delete this column?")) {
                taskColumns.removeChild(newColumn);
                deleteColumnFromLocalStorage(columnId);
            }
        });
    }
}

// Function to update column name in localStorage
function updateColumnInLocalStorage(oldColumnName, newColumnName) {
    let columns = JSON.parse(localStorage.getItem('columns')) || {};
    if (columns[oldColumnName]) {
        columns[newColumnName] = columns[oldColumnName];
        delete columns[oldColumnName];
        localStorage.setItem('columns', JSON.stringify(columns));
    }
}

// Function to delete column from localStorage
function deleteColumnFromLocalStorage(columnName) {
    let columns = JSON.parse(localStorage.getItem('columns')) || {};
    delete columns[columnName];
    localStorage.setItem('columns', JSON.stringify(columns));
}