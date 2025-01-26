
//... navbar
var el = document.getElementById("wrapper");
var toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};

//...take name project that select it 
document.addEventListener('DOMContentLoaded', function () {
    // Get the project name from the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const projectName = urlParams.get('name');

    const nameTaskElement = document.getElementById('name-task');

    if (projectName) {
        nameTaskElement.textContent = projectName;
    }
});


//...container

// Add item functionality
document.querySelectorAll('.add-item').forEach(button => {
    button.addEventListener('click', function () {
        const columnId = this.parentElement.id;
        const addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'));
        addItemModal.show();

        // Save item button click event
        document.getElementById('saveItemBtn').onclick = function () {
            const itemName = document.getElementById('newItemName').value;

            if (itemName) {
                const newItem = {
                    name: itemName,
                    comments: [],
                    closed: false, // Initialize closed status
                    columnId: columnId // Store the column ID in the item
                };

                // Append the new item to the corresponding task column
                const taskItems = document.querySelector(`#${columnId} .task-items`);
                const itemElement = createItemElement(newItem, columnId);
                taskItems.appendChild(itemElement);

                // Store the item in localStorage
                storeItemInLocalStorage(columnId, newItem);

                // Clear the input and hide the modal
                document.getElementById('newItemName').value = '';
                addItemModal.hide();
            }
        };
    });
});
// Enable Drag-and-Drop functionality for task items
document.querySelectorAll('.task-item').forEach(item => {
    item.setAttribute('draggable', true);

    item.addEventListener('dragstart', (e) => {
        // Store the dragged item's id and columnId in the dataTransfer object
        e.dataTransfer.setData('itemId', item.id);
        e.dataTransfer.setData('itemColumnId', item.closest('.task-column').id);
        item.style.opacity = '0.5';  // Visual feedback when dragging
    });

    item.addEventListener('dragend', () => {
        item.style.opacity = '';  // Reset opacity after dragging
    });
});

// Enable drop functionality for task columns
document.querySelectorAll('.task-column').forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();  // Allow dropping by preventing default action
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggedItemId = e.dataTransfer.getData('itemId');
        const draggedItemColumnId = e.dataTransfer.getData('itemColumnId');
        const draggedItem = document.getElementById(draggedItemId);
        const targetColumn = column; // The column where the item is dropped
        const targetColumnId = targetColumn.id; // The ID of the target column

        // Only move the item if it is being dropped in a different column
        if (draggedItemColumnId !== targetColumnId) {
            // Move the dragged item to the new column
            const taskItems = targetColumn.querySelector('.task-items');
            taskItems.appendChild(draggedItem);

            // Update the item's columnId in localStorage
            updateItemColumnInLocalStorage(draggedItemId, targetColumnId);

            // Optionally, update the UI or localStorage with other changes.
        }
    });
});

// Function to update localStorage after moving an item to another column
function updateItemColumnInLocalStorage(itemId, newColumnId) {
    let columns = JSON.parse(localStorage.getItem('columns')) || {};

    // Find the item in the previous column and move it to the new column
    for (let columnId in columns) {
        let columnItems = columns[columnId];
        const itemIndex = columnItems.findIndex(item => item.name === itemId);
        if (itemIndex !== -1) {
            const [movedItem] = columnItems.splice(itemIndex, 1);  // Remove the item from the old column
            movedItem.columnId = newColumnId;  // Update the column ID of the item

            // Add the moved item to the new column
            if (!columns[newColumnId]) {
                columns[newColumnId] = [];
            }
            columns[newColumnId].push(movedItem);

            // Update the localStorage with the new state
            localStorage.setItem('columns', JSON.stringify(columns));
            return;
        }
    }
}

// Function to create item element
function createItemElement(item, columnId) {
    const itemElement = document.createElement('div');
    itemElement.className = 'task-item d-flex justify-content-between align-items-center';
    itemElement.id = item.name; // Use a unique ID for each item
    itemElement.innerHTML = `
    <span class="item-name" style="cursor: pointer;">${item.name}</span>
    <span class="verification-sign" style="display: ${item.closed ? 'inline' : 'none'};">✔️</span>
    <div class="dropdown">
        <box-icon name='dots-vertical-rounded' class="dropdown-toggle" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"></box-icon>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item edit-item" href="#">Edit</a></li>
            <li><a class="dropdown-item delete-item" href="#">Delete</a></li>
            <li><a class="dropdown-item close-item" href="#">Close</a></li>
            <li><a class="dropdown-item comment-item" href="#">Comment</a></li>
        </ul>
    </div>
`;
    // Add click listener for the item's name to view the comment
    itemElement.querySelector('.item-name').addEventListener('click', () => {
        const commentModal = new bootstrap.Modal(document.getElementById('commentModal'));
        document.getElementById('commentInput').value = item.comment || ''; // Pre-fill with existing comment if any
        commentModal.show();

        // Save the comment when the save button is clicked
        document.getElementById('saveCommentBtn').onclick = () => {
            const commentInput = document.getElementById('commentInput').value.trim();
            if (commentInput) {
                item.comment = commentInput; // Save the comment in the item object
                commentModal.hide(); // Close the modal
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Empty Comment',
                    text: 'Please enter a comment before saving.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#007BFF'
                });
            }
        };
    });


    // Add click listener for the "Comment" menu option
    itemElement.querySelector('.comment-item').addEventListener('click', () => {
        const commentModal = new bootstrap.Modal(document.getElementById('commentModal'));
        document.getElementById('commentInput').value = item.comment || ''; // Pre-fill with existing comment if any
        commentModal.show();

        // Save the comment when the save button is clicked
        document.getElementById('saveCommentBtn').onclick = () => {
            const commentInput = document.getElementById('commentInput').value.trim();
            if (commentInput) {
                item.comment = commentInput; // Save the comment in the item object
                commentModal.hide(); // Close the modal
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Empty Comment',
                    text: 'Please enter a comment before saving.',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#007BFF'
                });
            }
        };
    });

    // Add event listeners for edit, delete, close, and comment buttons
    itemElement.querySelector('.edit-item').addEventListener('click', function () {
        // Populate the modal fields with the current item data
        document.getElementById('projectName').value = item.name;

        // Show the modal
        const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
        projectModal.show();

        // Save changes to the item when the "Save Changes" button is clicked
        document.getElementById('saveChangesBtn').onclick = function () {
            const newName = document.getElementById('projectName').value;

            // Update the item properties
            item.name = newName;

            // Update the UI
            itemElement.querySelector('span').textContent = newName;

            // Update local storage
            updateLocalStorage();

            // Hide the modal
            projectModal.hide();
        };
    });

    itemElement.querySelector('.delete-item').addEventListener('click', function () {

        itemElement.remove();
        updateLocalStorage();

    });

    itemElement.querySelector('.close-item').addEventListener('click', function () {
        item.closed = true; // Mark the item as closed
        itemElement.querySelector('.verification-sign').style.display = 'inline'; // Show the verification sign
        updateLocalStorage(); // Update local storage after closing
    });

    itemElement.querySelector('.comment-item').addEventListener('click', function () {
        currentItem = item; // Set the current item for commenting
        document.getElementById('commentText').value = ''; // Clear previous comments
        const commentModal = new bootstrap.Modal(document.getElementById('commentModal'));
        commentModal.show();
    });

    itemElement.setAttribute('draggable', true);

    itemElement.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('itemId', itemElement.id);
        e.dataTransfer.setData('itemColumnId', columnId); // Storing the columnId
        itemElement.style.opacity = '0.5';
    });

    itemElement.addEventListener('dragend', () => {
        itemElement.style.opacity = '';
    });

    return itemElement;
}

// Function to store item in localStorage
function storeItemInLocalStorage(columnId, item) {
    let columns = JSON.parse(localStorage.getItem('columns')) || {};
    if (!columns[columnId]) {
        columns[columnId] = [];
    }
    columns[columnId].push(item);
    localStorage.setItem('columns', JSON.stringify(columns));
}

// Function to load columns and items from localStorage
function loadColumnsFromLocalStorage() {
    const columns = JSON.parse(localStorage.getItem('columns')) || {};
    const taskColumns = document.getElementById('taskColumns');

    for (const columnId in columns) {
        const taskItems = document.querySelector(`#${columnId} .task-items`);
        columns[columnId].forEach(item => {
            const itemElement = createItemElement(item, columnId);
            taskItems.appendChild(itemElement);
        });
    }
}


document.getElementById('createColumnBtn').addEventListener('click', function () {
    const columnName = document.getElementById('columnName').value.trim();
    const selectedColor = document.querySelector('input[name="color"]:checked')?.id;

    if (columnName) {
        // Create a unique ID for the new column
        const columnId = columnName.toLowerCase().replace(/\s+/g, '-');

        const newColumn = document.createElement('div');
        newColumn.className = 'task-column';
        newColumn.id = columnId; // Use unique columnId
        newColumn.innerHTML = `
            <div class="column-header">
            <img src="../image/round-circle.png" alt="" class ="img-color">
                <span class="dot ${selectedColor}"></span> <span class="column-name">${columnName}</span>
                <div class="column-menu float-end">
                    <button class="btn btn-link menu-btn" id="menuBtn">
                        <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                    </button>
                    <div class="menu-items" id="menuItems">
                        <button class="menu-item edit-column" data-bs-toggle="modal" data-bs-target="#editColumnModal">Edit</button>
                        <button class="menu-item delete-column">Delete</button>
                    </div>
                </div>
            </div>
            <div class="task-items"></div>
        `;

        // Toggle menu visibility with smooth transition
        const menuBtn = newColumn.querySelector('.menu-btn');
        const menuItems = newColumn.querySelector('.menu-items');

        menuBtn.addEventListener('click', function () {
            menuItems.classList.toggle('show'); // Toggles the 'show' class to trigger smooth visibility change
        });

        // Add event listener for Edit action
        newColumn.querySelector('.edit-column').addEventListener('click', function () {
            const columnNameElement = newColumn.querySelector('.column-name');
            document.getElementById('editColumnName').value = columnNameElement.textContent;

            document.getElementById('saveColumnChangesBtn').onclick = function () {
                const newColumnName = document.getElementById('editColumnName').value.trim();
                if (newColumnName) {
                    columnNameElement.textContent = newColumnName;
                    newColumn.id = newColumnName.toLowerCase().replace(/\s+/g, '-');
                    // Optionally update localStorage here if needed
                    const editColumnModal = bootstrap.Modal.getInstance(document.getElementById('editColumnModal'));
                    editColumnModal.hide(); // Hide the modal after saving changes
                }
            };
        });

        // Add event listener for Delete action
        newColumn.querySelector('.delete-column').addEventListener('click', function () {
            newColumn.remove(); // Remove the column from the DOM
            removeColumnFromLocalStorage(columnId); // Remove from localStorage
        });

        // Add "Add Item" button to the column
        const addItemButton = document.createElement('button');
        addItemButton.className = 'add-item';
        addItemButton.textContent = '+ Add Item';
        newColumn.appendChild(addItemButton);

        addItemButton.addEventListener('click', function () {
            const addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'));
            addItemModal.show();

            document.getElementById('saveItemBtn').onclick = function () {
                const itemName = document.getElementById('newItemName').value.trim();
                if (itemName) {
                    const taskItems = newColumn.querySelector('.task-items');
                    const itemElement = document.createElement('div');
                    itemElement.className = 'task-item';
                    itemElement.textContent = itemName;
                    taskItems.appendChild(itemElement);

                    // Store the item in localStorage for the newly created column
                    const newItem = {
                        name: itemName,
                        comments: [],
                        closed: false,
                        columnId: columnId // Store columnId in the item
                    };
                    storeItemInLocalStorage(columnId, newItem); // Store the new item

                    document.getElementById('newItemName').value = '';
                    addItemModal.hide();
                }
            };
        });

        // Append the new column to the task columns section
        document.getElementById('taskColumns').appendChild(newColumn);

        // Clear the input and hide the modal
        document.getElementById('columnName').value = '';
        const newOptionModal = bootstrap.Modal.getInstance(document.getElementById('newOptionModal'));
        if (newOptionModal) newOptionModal.hide();

        // Store the new column in localStorage
        storeColumnInLocalStorage(columnId);
    }
});

// Function to load items from localStorage and append them to their respective columns
function loadColumnsFromLocalStorage() {
    const columns = JSON.parse(localStorage.getItem('columns')) || {};
    const taskColumns = document.getElementById('taskColumns');

    // Loop through each column and its items
    for (const columnId in columns) {
        const taskItems = document.querySelector(`#${columnId} .task-items`) || createNewColumn(columnId);
        columns[columnId].forEach(item => {
            const itemElement = createItemElement(item, columnId);
            taskItems.appendChild(itemElement);
        });
    }
}

// Create a new column if it does not exist
function createNewColumn(columnId) {
    const column = document.createElement('div');
    column.className = 'task-column';
    column.id = columnId;
    column.innerHTML = `
    <div class="column-header">
        <span class="column-name">${columnId}</span>
        <div class="task-items"></div>
    </div>`;
    document.getElementById('taskColumns').appendChild(column);
    return column.querySelector('.task-items');
}


// Function to store new column in localStorage
function storeColumnInLocalStorage(columnName) {
    let columns = JSON.parse(localStorage.getItem('columns')) || {};
    if (!columns[columnName]) {
        columns[columnName] = [];
    }
    localStorage.setItem('columns', JSON.stringify(columns));
}

// Function to remove column from localStorage
function removeColumnFromLocalStorage(columnName) {
    let columns = JSON.parse(localStorage.getItem('columns')) || {};
    delete columns[columnName];
    localStorage.setItem('columns', JSON.stringify(columns));
}
