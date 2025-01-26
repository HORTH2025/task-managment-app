
//... navbar
var el = document.getElementById("wrapper");
var toggleButton = document.getElementById("menu-toggle");

toggleButton.onclick = function () {
    el.classList.toggle("toggled");
};
//... take name 

//...container

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

// Function to create item element
function createItemElement(item, columnId) {
    const itemElement = document.createElement('div');
    itemElement.className = 'task-item d-flex justify-content-between align-items-center';
    itemElement.innerHTML = `
    <span class="item-name" style="cursor: pointer;">${item.name}</span>
    <span class="verification-sign" style="display: ${item.closed ? 'inline' : 'none'};">✔️</span>
    <div class="dropdown">
        <box-icon name='dots-vertical-rounded' class="dropdown-toggle" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"></box-icon>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item edit-item" href="#">Edit</a></li>
            <li><a class="dropdown-item delete-item" href="#">Delete</a></li>
            <li><a class="dropdown-item close-item" href="#">Close</a></li>
            <li><a class="dropdown-item comment-item" href="#" >Comment</a></li>
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
                alert("Comment cannot be empty.");
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
                alert("Comment cannot be empty.");
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
        if (confirm("Are you sure you want to delete this item?")) {
            itemElement.remove();
            updateLocalStorage(); // Update local storage after deletion
        }
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

// Function to create a new column
document.getElementById('createColumnBtn').addEventListener('click', function () {
    const columnName = document.getElementById('columnName').value;
    const selectedColor = document.querySelector('input[name="color"]:checked').id; // Get selected color

    if (columnName) {
        const newColumn = document.createElement('div');
        newColumn.className = 'task-column';
        newColumn.id = columnName.toLowerCase().replace(/\s+/g, '-'); // Create a unique ID
        newColumn.innerHTML = `
            <div class="column-header">
                <span class="dot ${selectedColor}"></span> ${columnName}
                <div class="dropdown float-end">
                    <button class="btn btn-link dropdown-toggle" id="columnMenuBtn" data-bs-toggle="dropdown" aria-expanded="false">
                        <ion-icon name="ellipsis-vertical-outline"></ion-icon>
                    </button>
                    <ul class="dropdown-menu" aria-labelledby="columnMenuBtn">
                        <li><a class="dropdown-item edit-column" href="#">Edit</a></li>
                        <li><a class="dropdown-item delete-column" href="#">Delete</a></li>
                    </ul>
                </div>
            </div>
            <div class="task-items"></div>
        `;

        // Create and append the add item button to the new column
        const addItemButton = document.createElement('button');
        addItemButton.className = 'add-item';
        addItemButton.textContent = '+ add item';
        newColumn.appendChild(addItemButton);

        // Add event listener for the new add item button
        addItemButton.addEventListener('click', function () {
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
                        columnId: newColumn.id // Store the column ID in the item
                    };

                    // Append the new item to the corresponding task column
                    const taskItems = newColumn.querySelector('.task-items');
                    const itemElement = createItemElement(newItem, newColumn.id);
                    taskItems.appendChild(itemElement);

                    // Store the item in localStorage
                    storeItemInLocalStorage(newColumn.id, newItem);

                    // Clear the input and hide the modal
                    document.getElementById('newItemName').value = '';
                    addItemModal.hide();
                }
            };
        });

        // Handle Edit and Delete actions for the new column
        const editButton = newColumn.querySelector('.edit-column');
        const deleteButton = newColumn.querySelector('.delete-column');

        editButton.addEventListener('click', function () {
            const newColumnName = prompt("Enter new column name:", columnName);
            if (newColumnName) {
                newColumn.querySelector('.column-header').childNodes[1].textContent = newColumnName;
                newColumn.id = newColumnName.toLowerCase().replace(/\s+/g, '-'); // Update ID
                storeColumnInLocalStorage(newColumnName); // Store the updated column name in localStorage
            }
        });

        deleteButton.addEventListener('click', function () {
            if (confirm(`Are you sure you want to delete the column "${columnName}"?`)) {
                newColumn.remove(); // Remove the column from the DOM
                removeColumnFromLocalStorage(columnName); // Remove the column from localStorage
            }
        });

        // Append the new column to the task columns section
        document.getElementById('taskColumns').appendChild(newColumn);

        // Clear the input and hide the modal
        document.getElementById('columnName').value = '';
        const newOptionModal = bootstrap.Modal.getInstance(document.getElementById('newOptionModal'));
        newOptionModal.hide();

        // Store the new column in localStorage (if needed)
        storeColumnInLocalStorage(columnName);
    }
});

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
    delete columns[columnName]; // Delete the column from the columns object
    localStorage.setItem('columns', JSON.stringify(columns));
}
