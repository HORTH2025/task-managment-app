// Sidebar toggle
const wrapper = document.getElementById("wrapper");
const toggleButton = document.getElementById("menu-toggle");
toggleButton.onclick = () => wrapper.classList.toggle("toggled");

// Task Management
let currentColumnId = null;
let currentColumnElement = null;
const columnsKey = `columns_${window.location.search}`; // Unique per project

// Load project name and data
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectName = urlParams.get('name');
    const nameTaskElement = document.getElementById('name-task');
    if (projectName) nameTaskElement.textContent = projectName;

    loadColumnsFromLocalStorage();
});

// Add item
document.addEventListener('click', e => {
    if (e.target.closest('.add-item')) {
        currentColumnId = e.target.closest('.task-column').id;
        const modal = new bootstrap.Modal(document.getElementById('addItemModal'));
        document.getElementById('addItemModalLabel').textContent = 'Add New Item';
        document.getElementById('addItemForm').reset();
        modal.show();
    }
});

// Save item
document.getElementById('saveItemBtn').addEventListener('click', () => {
    const itemName = document.getElementById('newItemName').value.trim();
    const priority = document.getElementById('priority').value;
    if (!itemName) {
        Swal.fire({ icon: 'warning', title: 'Empty Name', text: 'Please enter an item name.', confirmButtonColor: '#0366d6' });
        return;
    }

    const newItem = {
        id: `item-${Date.now()}`,
        name: itemName,
        comments: [],
        closed: false,
        labels: [],
        assignees: [],
        dueDate: null,
        priority: priority,
        columnId: currentColumnId
    };

    const taskItems = document.querySelector(`#${currentColumnId} .task-items`);
    taskItems.appendChild(createItemElement(newItem));
    storeItemInLocalStorage(currentColumnId, newItem);

    document.getElementById('addItemForm').reset();
    bootstrap.Modal.getInstance(document.getElementById('addItemModal')).hide();
});

// Drag-and-Drop
document.addEventListener('dragover', e => {
    if (e.target.closest('.task-column')) e.preventDefault();
});

document.addEventListener('drop', e => {
    if (!e.target.closest('.task-column')) return;
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    const sourceColumnId = e.dataTransfer.getData('itemColumnId');
    const targetColumnId = e.target.closest('.task-column').id;
    if (sourceColumnId !== targetColumnId) {
        const item = document.getElementById(itemId);
        e.target.closest('.task-column').querySelector('.task-items').appendChild(item);
        updateItemColumnInLocalStorage(itemId, sourceColumnId, targetColumnId);
    }
});
function createItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'task-item d-flex justify-content-between align-items-center';
    itemElement.id = item.id;
    itemElement.draggable = true;
    itemElement.innerHTML = `
        <div class="item-content">
            <span class="item-name" style="cursor: pointer;">${item.name}</span>
            <div class="item-meta">
                ${item.labels.map(label => `<span class="badge bg-${label.color}">${label.name}</span>`).join(' ')}
                ${item.priority ? `<span class="badge bg-${item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'success'}">${item.priority}</span>` : ''}
                ${item.assignees.length ? `<span class="assignee"><i class="fas fa-user"></i> ${item.assignees.join(', ')}</span>` : ''}
                ${item.dueDate ? `<span class="due-date"><i class="fas fa-calendar-alt"></i> ${new Date(item.dueDate).toLocaleDateString()}</span>` : ''}
            </div>
        </div>
        <span class="verification-sign" style="display: ${item.closed ? 'inline' : 'none'}; font-size: 1.2em;">✔️</span>
        <div class="dropdown professional-dropdown">
            <button class="btn btn-link dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="fas fa-ellipsis-v"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                <li class="dropdown-header">Manage Item</li>
                <li>
                    <a class="dropdown-item edit-item" href="#" role="button">
                        <i class="fas fa-edit me-2"></i> Edit
                    </a>
                </li>
                <li>
                    <a class="dropdown-item close-item" href="#" role="button">
                        <i class="fas fa-${item.closed ? 'undo' : 'check'} me-2"></i> ${item.closed ? 'Reopen' : 'Close'}
                    </a>
                </li>
                <li>
                    <a class="dropdown-item delete-item" href="#" role="button">
                        <i class="fas fa-trash me-2"></i> Delete
                    </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li class="dropdown-header">Add Details</li>
                <li>
                    <a class="dropdown-item comment-item" href="#" role="button">
                        <i class="fas fa-comment me-2"></i> Comment
                    </a>
                </li>
                <li>
                    <a class="dropdown-item label-item" href="#" role="button">
                        <i class="fas fa-tag me-2"></i> Add Label
                    </a>
                </li>
                <li>
                    <a class="dropdown-item assignee-item" href="#" role="button">
                        <i class="fas fa-user-plus me-2"></i> Assign
                    </a>
                </li>
                <li>
                    <a class="dropdown-item due-date-item" href="#" role="button">
                        <i class="fas fa-calendar-alt me-2"></i> Set Due Date
                    </a>
                </li>
                <li>
                    <a class="dropdown-item priority-item" href="#" role="button">
                        <i class="fas fa-exclamation-circle me-2"></i> Set Priority
                    </a>
                </li>
            </ul>
        </div>
    `;

    // Drag events
    itemElement.addEventListener('dragstart', e => {
        e.dataTransfer.setData('itemId', item.id);
        e.dataTransfer.setData('itemColumnId', item.columnId);
        itemElement.classList.add('dragging');
    });
    itemElement.addEventListener('dragend', () => itemElement.classList.remove('dragging'));

    // Item actions
    itemElement.querySelector('.item-name').addEventListener('click', () => editItem(item, itemElement));
    itemElement.querySelector('.edit-item').addEventListener('click', () => editItem(item, itemElement));
    itemElement.querySelector('.delete-item').addEventListener('click', () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This item will be deleted permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d73a49',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Delete'
        }).then(result => {
            if (result.isConfirmed) {
                itemElement.remove();
                removeItemFromLocalStorage(item.id, item.columnId);
            }
        });
    });
    itemElement.querySelector('.close-item').addEventListener('click', () => {
        item.closed = !item.closed;
        itemElement.querySelector('.verification-sign').style.display = item.closed ? 'inline' : 'none';
        itemElement.querySelector('.close-item').innerHTML = `<i class="fas fa-${item.closed ? 'undo' : 'check'} me-2"></i> ${item.closed ? 'Reopen' : 'Close'}`;
        updateLocalStorage(item);
    });
    itemElement.querySelector('.comment-item').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('commentModal'));
        document.getElementById('commentInput').value = '';
        modal.show();
        document.getElementById('saveCommentBtn').onclick = () => {
            const comment = document.getElementById('commentInput').value.trim();
            if (comment) {
                item.comments.push(`${new Date().toLocaleString()}: ${comment}`);
                updateLocalStorage(item);
                modal.hide();
            } else {
                Swal.fire({ icon: 'warning', title: 'Empty Comment', text: 'Please enter a comment.', confirmButtonColor: '#0366d6' });
            }
        };
    });
    itemElement.querySelector('.label-item').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('newOptionModal'));
        document.getElementById('newOptionModalLabel').textContent = 'Add Label';
        document.getElementById('newColumnForm').reset();
        modal.show();
        document.getElementById('createColumnBtn').onclick = () => {
            const labelName = document.getElementById('columnName').value.trim();
            const color = document.querySelector('input[name="color"]:checked')?.value || 'blue';
            if (labelName) {
                item.labels.push({ name: labelName, color });
                updateLocalStorage(item);
                itemElement.replaceWith(createItemElement(item));
                modal.hide();
            }
        };
    });
    itemElement.querySelector('.assignee-item').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('inviteTeamModal'));
        document.getElementById('inviteTeamModalLabel').textContent = 'Assign User';
        document.getElementById('inviteTeamForm').reset();
        modal.show();
        document.getElementById('sendInviteBtn').onclick = () => {
            const assignee = document.getElementById('email').value.trim();
            if (assignee && !item.assignees.includes(assignee)) {
                item.assignees.push(assignee);
                updateLocalStorage(item);
                itemElement.replaceWith(createItemElement(item));
                modal.hide();
            }
        };
    });
    itemElement.querySelector('.due-date-item').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('dueDateModal'));
        document.getElementById('dueDateInput').value = item.dueDate || '';
        modal.show();
        document.getElementById('saveDueDateBtn').onclick = () => {
            const dueDate = document.getElementById('dueDateInput').value;
            if (dueDate) {
                item.dueDate = dueDate;
                updateLocalStorage(item);
                itemElement.replaceWith(createItemElement(item));
                modal.hide();
            }
        };
    });
    itemElement.querySelector('.priority-item').addEventListener('click', () => {
        const modal = new bootstrap.Modal(document.getElementById('addItemModal'));
        document.getElementById('addItemModalLabel').textContent = 'Set Priority';
        document.getElementById('newItemName').value = item.name;
        document.getElementById('newItemName').disabled = true;
        document.getElementById('priority').value = item.priority || 'medium';
        modal.show();
        document.getElementById('saveItemBtn').onclick = () => {
            item.priority = document.getElementById('priority').value;
            updateLocalStorage(item);
            itemElement.replaceWith(createItemElement(item));
            modal.hide();
            document.getElementById('newItemName').disabled = false;
        };
    });

    return itemElement;
}

// Edit item
function editItem(item, itemElement) {
    const modal = new bootstrap.Modal(document.getElementById('addItemModal'));
    document.getElementById('addItemModalLabel').textContent = 'Edit Item';
    document.getElementById('newItemName').value = item.name;
    document.getElementById('newItemName').disabled = false;
    document.getElementById('priority').value = item.priority || 'medium';
    modal.show();
    document.getElementById('saveItemBtn').onclick = () => {
        const newName = document.getElementById('newItemName').value.trim();
        const priority = document.getElementById('priority').value;
        if (newName) {
            item.name = newName;
            item.priority = priority;
            updateLocalStorage(item);
            itemElement.replaceWith(createItemElement(item));
            modal.hide();
        }
    };
}

// Add new column
document.getElementById('createColumnBtn').addEventListener('click', () => {
    const columnName = document.getElementById('columnName').value.trim();
    const color = document.querySelector('input[name="color"]:checked')?.value || 'blue';
    const description = document.getElementById('description').value.trim();
    if (!columnName) {
        Swal.fire({ icon: 'warning', title: 'Empty Name', text: 'Please enter a column name.', confirmButtonColor: '#0366d6' });
        return;
    }

    const columnId = `column-${Date.now()}`;
    const newColumn = document.createElement('div');
    newColumn.className = 'task-column';
    newColumn.id = columnId;
    newColumn.innerHTML = `
        <div class="column-header">
            <span class="dot" style="background-color: ${color};"></span>
            <span class="column-name">${columnName}</span>
            <div class="column-menu">
                <button class="btn btn-link menu-btn"><i class="fas fa-ellipsis-v"></i></button>
                <div class="menu-items">
                    <button class="menu-item edit-column" data-bs-toggle="modal" data-bs-target="#editColumnModal">Edit</button>
                    <button class="menu-item delete-column">Delete</button>
                </div>
            </div>
        </div>
        ${description ? `<div class="column-description text-muted small">${description}</div>` : ''}
        <div class="task-items"></div>
        <button class="add-item">+ Add Item</button>
    `;

    newColumn.querySelector('.menu-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const menuItems = newColumn.querySelector('.menu-items');
        document.querySelectorAll('.menu-items.show').forEach(menu => {
            if (menu !== menuItems) menu.classList.remove('show');
        });
        menuItems.classList.toggle('show');
    });

    newColumn.querySelector('.edit-column').addEventListener('click', () => {
        currentColumnElement = newColumn;
        document.getElementById('editColumnName').value = columnName;
        const modal = new bootstrap.Modal(document.getElementById('editColumnModal'));
        modal.show();
    });

    newColumn.querySelector('.delete-column').addEventListener('click', () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This column and all its items will be deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d73a49',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Delete'
        }).then(result => {
            if (result.isConfirmed) {
                newColumn.remove();
                removeColumnFromLocalStorage(columnId);
            }
        });
    });

    document.getElementById('taskColumns').insertBefore(newColumn, document.querySelector('.add-column-btn'));
    storeColumnInLocalStorage(columnId, { name: columnName, color, description });
    bootstrap.Modal.getInstance(document.getElementById('newOptionModal')).hide();
});

// Edit column name
document.getElementById('saveColumnChangesBtn').addEventListener('click', () => {
    const newName = document.getElementById('editColumnName').value.trim();
    if (newName && currentColumnElement) {
        currentColumnElement.querySelector('.column-name').textContent = newName;
        const columnId = currentColumnElement.id;
        const columnsData = JSON.parse(localStorage.getItem(columnsKey)) || {};
        if (columnsData[columnId]) {
            columnsData[columnId].name = newName;
            localStorage.setItem(columnsKey, JSON.stringify(columnsData));
        }
        bootstrap.Modal.getInstance(document.getElementById('editColumnModal')).hide();
        currentColumnElement = null;
    }
});

// Search
document.getElementById('searchInput').addEventListener('input', e => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.task-item').forEach(item => {
        const name = item.querySelector('.item-name').textContent.toLowerCase();
        const labels = Array.from(item.querySelectorAll('.badge')).map(b => b.textContent.toLowerCase()).join(' ');
        const assignees = item.querySelector('.assignee')?.textContent.toLowerCase() || '';
        const comments = JSON.parse(localStorage.getItem(columnsKey))?.[item.closest('.task-column').id]?.items?.find(i => i.id === item.id)?.comments.join(' ').toLowerCase() || '';
        item.style.display = name.includes(query) || labels.includes(query) || assignees.includes(query) || comments.includes(query) ? '' : 'none';
    });
});

// LocalStorage Functions
function storeItemInLocalStorage(columnId, item) {
    const columns = JSON.parse(localStorage.getItem(columnsKey)) || {};
    columns[columnId] = columns[columnId] || { name: document.querySelector(`#${columnId} .column-name`)?.textContent || columnId, items: [] };
    columns[columnId].items = columns[columnId].items || [];
    columns[columnId].items.push(item);
    localStorage.setItem(columnsKey, JSON.stringify(columns));
}

function updateItemColumnInLocalStorage(itemId, sourceColumnId, targetColumnId) {
    const columns = JSON.parse(localStorage.getItem(columnsKey)) || {};
    const item = columns[sourceColumnId]?.items.find(i => i.id === itemId);
    if (item) {
        columns[sourceColumnId].items = columns[sourceColumnId].items.filter(i => i.id !== itemId);
        columns[targetColumnId] = columns[targetColumnId] || { name: document.querySelector(`#${targetColumnId} .column-name`)?.textContent || targetColumnId, items: [] };
        item.columnId = targetColumnId;
        columns[targetColumnId].items.push(item);
        localStorage.setItem(columnsKey, JSON.stringify(columns));
    }
}

function removeItemFromLocalStorage(itemId, columnId) {
    const columns = JSON.parse(localStorage.getItem(columnsKey)) || {};
    if (columns[columnId]) {
        columns[columnId].items = columns[columnId].items.filter(i => i.id !== itemId);
        localStorage.setItem(columnsKey, JSON.stringify(columns));
    }
}

function updateLocalStorage(updatedItem) {
    const columns = JSON.parse(localStorage.getItem(columnsKey)) || {};
    for (const columnId in columns) {
        const itemIndex = columns[columnId].items.findIndex(i => i.id === updatedItem.id);
        if (itemIndex !== -1) {
            columns[columnId].items[itemIndex] = updatedItem;
            localStorage.setItem(columnsKey, JSON.stringify(columns));
            return;
        }
    }
}

function storeColumnInLocalStorage(columnId, columnData) {
    const columns = JSON.parse(localStorage.getItem(columnsKey)) || {};
    columns[columnId] = { name: columnData.name, color: columnData.color, description: columnData.description, items: [] };
    localStorage.setItem(columnsKey, JSON.stringify(columns));
}

function removeColumnFromLocalStorage(columnId) {
    const columns = JSON.parse(localStorage.getItem(columnsKey)) || {};
    delete columns[columnId];
    localStorage.setItem(columnsKey, JSON.stringify(columns));
}

function loadColumnsFromLocalStorage() {
    const columns = JSON.parse(localStorage.getItem(columnsKey)) || {};
    for (const columnId in columns) {
        let columnElement = document.getElementById(columnId);
        if (!columnElement && columnId.startsWith('column-')) {
            // Create custom column
            columnElement = document.createElement('div');
            columnElement.className = 'task-column';
            columnElement.id = columnId;
            columnElement.innerHTML = `
                <div class="column-header">
                    <span class="dot" style="background-color: ${columns[columnId].color || 'blue'};"></span>
                    <span class="column-name">${columns[columnId].name}</span>
                    <div class="column-menu">
                        <button class="btn btn-link menu-btn"><i class="fas fa-ellipsis-v"></i></button>
                        <div class="menu-items">
                            <button class="menu-item edit-column" data-bs-toggle="modal" data-bs-target="#editColumnModal">Edit</button>
                            <button class="menu-item delete-column">Delete</button>
                        </div>
                    </div>
                </div>
                ${columns[columnId].description ? `<div class="column-description text-muted small">${columns[columnId].description}</div>` : ''}
                <div class="task-items"></div>
                <button class="add-item">+ Add Item</button>
            `;
            columnElement.querySelector('.menu-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                const menuItems = columnElement.querySelector('.menu-items');
                document.querySelectorAll('.menu-items.show').forEach(menu => {
                    if (menu !== menuItems) menu.classList.remove('show');
                });
                menuItems.classList.toggle('show');
            });
            columnElement.querySelector('.edit-column').addEventListener('click', () => {
                currentColumnElement = columnElement;
                document.getElementById('editColumnName').value = columns[columnId].name;
                const modal = new bootstrap.Modal(document.getElementById('editColumnModal'));
                modal.show();
            });
            columnElement.querySelector('.delete-column').addEventListener('click', () => {
                Swal.fire({
                    title: 'Are you sure?',
                    text: 'This column and all its items will be deleted.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d73a49',
                    cancelButtonColor: '#6c757d',
                    confirmButtonText: 'Delete'
                }).then(result => {
                    if (result.isConfirmed) {
                        columnElement.remove();
                        removeColumnFromLocalStorage(columnId);
                    }
                });
            });
            document.getElementById('taskColumns').insertBefore(columnElement, document.querySelector('.add-column-btn'));
        }
        const taskItems = columnElement?.querySelector('.task-items');
        if (taskItems && columns[columnId].items) {
            columns[columnId].items.forEach(item => taskItems.appendChild(createItemElement(item)));
        }
    }
}

// Close column menus when clicking outside
document.addEventListener('click', e => {
    if (!e.target.closest('.column-menu')) {
        document.querySelectorAll('.menu-items.show').forEach(menu => menu.classList.remove('show'));
    }
});