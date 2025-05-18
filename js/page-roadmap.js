document.addEventListener('DOMContentLoaded', function() {
    // Initialize FullCalendar
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: true,
        droppable: true,
        events: [],
        dateClick: function(info) {
            showTaskModal(null, info.dateStr);
        },
        eventClick: function(info) {
            showTaskModal(info.event);
        },
        eventDrop: function(info) {
            updateTask(info.event);
        },
        timeZone: 'UTC'
    });
    calendar.render();

    // Task storage
    let tasks = loadTasks();

    // Initialize Board View
    const boardColumns = document.querySelectorAll('.board-column .task-list');
    boardColumns.forEach(column => {
        new Sortable(column, {
            group: 'tasks',
            animation: 150,
            onEnd: function(evt) {
                const taskId = evt.item.dataset.id;
                const newStatus = evt.to.dataset.status;
                updateTaskStatus(taskId, newStatus);
            }
        });
    });

    // Task Modal
    function showTaskModal(event, date) {
        Swal.fire({
            title: event ? 'Edit Task' : 'Create Task',
            html: `
                <input id="task-title" class="swal2-input" placeholder="Task Title" value="${event ? event.title : ''}" required>
                <textarea id="task-description" class="swal2-textarea" placeholder="Description">${event ? event.extendedProps.description : ''}</textarea>
                <input id="task-date" type="date" class="swal2-input" value="${date || (event ? event.start.toISOString().split('T')[0] : '')}" required>
                <input id="task-time" type="time" class="swal2-input" value="${event ? event.start.toTimeString().slice(0, 5) : '11:23'}">
                <select id="task-status" class="swal2-select" required>
                    <option value="Backlog" ${event && event.extendedProps.status === 'Backlog' ? 'selected' : ''}>Backlog</option>
                    <option value="In Progress" ${event && event.extendedProps.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                    <option value="Done" ${event && event.extendedProps.status === 'Done' ? 'selected' : ''}>Done</option>
                </select>
            `,
            showCancelButton: true,
            confirmButtonText: event ? 'Update' : 'Create',
            showDenyButton: event ? true : false,
            denyButtonText: 'Delete',
            preConfirm: () => {
                const title = document.getElementById('task-title').value;
                const description = document.getElementById('task-description').value;
                const date = document.getElementById('task-date').value;
                const time = document.getElementById('task-time').value;
                const status = document.getElementById('task-status').value;

                if (!title || !date || !status) {
                    Swal.showValidationMessage('Title, date, and status are required');
                    return false;
                }

                return { title, description, date, time, status };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const taskData = result.value;
                if (event) {
                    updateTask({ id: event.id, ...taskData });
                } else {
                    createTask(taskData);
                }
            } else if (result.isDenied) {
                deleteTask(event.id);
            }
        });
    }

    // Load Tasks
    function loadTasks() {
        try {
            const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
            return storedTasks.filter(task => task && typeof task.title === 'string' && task.start && task.status);
        } catch (e) {
            console.error('Failed to load tasks:', e);
            return [];
        }
    }

    // Create Task
    function createTask(taskData) {
        const task = {
            id: Date.now().toString(),
            title: taskData.title || 'Untitled',
            description: taskData.description || '',
            start: `${taskData.date}T${taskData.time || '11:23'}:00+07:00`,
            status: taskData.status || 'Backlog',
            allDay: !taskData.time
        };
        tasks.push(task);
        saveTasks();
        calendar.addEvent(task);
        renderBoardTasks();
        renderRoadmapTasks();
    }

    // Update Task
    function updateTask(taskData) {
        const index = tasks.findIndex(t => t.id === taskData.id);
        if (index !== -1) {
            tasks[index] = {
                ...tasks[index],
                title: taskData.title || tasks[index].title,
                description: taskData.description || tasks[index].description,
                start: `${taskData.date}T${taskData.time || '11:23'}:00+07:00`,
                status: taskData.status || tasks[index].status,
                allDay: !taskData.time
            };
            saveTasks();
            const event = calendar.getEventById(taskData.id);
            if (event) {
                event.remove();
                calendar.addEvent(tasks[index]);
            }
            renderBoardTasks();
            renderRoadmapTasks();
        }
    }

    // Update Task Status
    function updateTaskStatus(taskId, newStatus) {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            task.status = newStatus;
            saveTasks();
            renderBoardTasks();
            renderRoadmapTasks();
        }
    }

    // Delete Task
    function deleteTask(taskId) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        const event = calendar.getEventById(taskId);
        if (event) event.remove();
        renderBoardTasks();
        renderRoadmapTasks();
    }

    // Save Tasks
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        refreshCalendar();
    }

    // Refresh Calendar
    function refreshCalendar() {
        calendar.getEvents().forEach(event => event.remove());
        tasks.forEach(task => {
            if (task && task.title && task.start) {
                calendar.addEvent(task);
            }
        });
        calendar.render();
    }

    // Render Board Tasks
    function renderBoardTasks() {
        boardColumns.forEach(column => {
            column.innerHTML = '';
            const status = column.dataset.status;
            tasks
                .filter(task => task && task.status === status)
                .forEach(task => {
                    const taskEl = document.createElement('div');
                    taskEl.className = 'task card mb-2';
                    taskEl.dataset.id = task.id;
                    taskEl.innerHTML = `
                        <div class="card-body">
                            <h6>${task.title || 'Untitled'}</h6>
                            <p class="text-muted small">${task.description || ''}</p>
                            <small>${new Date(task.start).toLocaleDateString()}</small>
                        </div>
                    `;
                    taskEl.addEventListener('click', () => showTaskModal(calendar.getEventById(task.id)));
                    column.appendChild(taskEl);
                });
        });
    }

    // Render Roadmap Tasks
    function renderRoadmapTasks() {
        const timelineBody = document.querySelector('.timeline-body');
        timelineBody.innerHTML = '';
        const sortedTasks = [...tasks].sort((a, b) => new Date(a.start) - new Date(b.start));
        const today = new Date();
        const earliestDate = sortedTasks.length ? new Date(Math.min(...sortedTasks.map(t => new Date(t.start)))) : today;

        // Add today line
        const todayLine = document.createElement('div');
        todayLine.className = 'today-line';
        const daysFromStart = (today - earliestDate) / (1000 * 60 * 60 * 24);
        todayLine.style.left = `${daysFromStart * 10 + 50}px`;
        timelineBody.appendChild(todayLine);

        sortedTasks.forEach((task, index) => {
            if (task && task.title && task.start) {
                const taskEl = document.createElement('div');
                taskEl.className = 'timeline-item';
                const taskDate = new Date(task.start);
                const daysFromStart = (taskDate - earliestDate) / (1000 * 60 * 60 * 24);
                const topPosition = index * 100 + daysFromStart * 10;
                taskEl.style.top = `${topPosition}px`;
                taskEl.innerHTML = `
                    <div class="timeline-date">${taskDate.toLocaleDateString()}</div>
                    <div class="timeline-content card">
                        <h6>${task.title}</h6>
                        <p>${task.description || ''}</p>
                        <span class="badge bg-${task.status === 'Done' ? 'success' : task.status === 'In Progress' ? 'warning' : 'secondary'}">${task.status}</span>
                    </div>
                `;
                taskEl.addEventListener('click', () => showTaskModal(calendar.getEventById(task.id)));
                timelineBody.appendChild(taskEl);
            }
        });
    }

    // Sidebar Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const wrapper = document.getElementById('wrapper');
    menuToggle.addEventListener('click', () => {
        wrapper.classList.toggle('toggled');
    });

    // Initial Render
    refreshCalendar();
    renderBoardTasks();
    renderRoadmapTasks();
});