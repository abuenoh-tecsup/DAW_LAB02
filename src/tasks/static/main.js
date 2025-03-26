document.addEventListener('DOMContentLoaded', function () {
    // Cargar tareas solo si estamos en la lista de tareas
    if (document.getElementById('task-list')) {
        loadTasks();
    }

    // Configurar formulario solo si estamos en la página de creación o edición de tareas
    if (document.getElementById('task-form')) {
        setupCreateTaskForm();
    }
});

// Cargar todas las tareas con el filtro de estado y prioridad
function loadTasks() {
    let statusFilter = document.getElementById('status-filter');
    let priorityFilter = document.getElementById('priority-filter');
    let statusValue = statusFilter ? statusFilter.value : '';
    let priorityValue = priorityFilter ? priorityFilter.value : '';

    let apiUrl = `/api/tasks/?status=${statusValue}&priority=${priorityValue}`;

    axios.get(apiUrl)
        .then(response => renderTaskList(response.data))
        .catch(error => console.error("Error fetching tasks:", error));
}

// Renderiza la lista de tareas
function renderTaskList(tasks) {
    let taskListContainer = document.getElementById('task-list');
    if (!taskListContainer) return;
    taskListContainer.innerHTML = '';

    if (tasks.length === 0) {
        taskListContainer.innerHTML = `<div class="alert alert-info">No tasks found. <a href="/tasks/create">Create your first task</a></div>`;
        return;
    }

    let tableHTML = `<div class="table-responsive"><table class="table table-hover">
        <thead><tr>
            <th>Title</th><th>Priority</th><th>Status</th><th>Due Date</th><th>Actions</th>
        </tr></thead><tbody>`;

    tasks.forEach(task => {
        tableHTML += `<tr class="${task.status === 'completed' ? 'task-completed' : 'priority-' + task.priority}">
            <td>${task.title}</td>
            <td><span class="badge ${getPriorityBadgeClass(task.priority)}">${getPriorityText(task.priority)}</span></td>
            <td><span class="badge ${getStatusBadgeClass(task.status)}">${getStatusText(task.status)}</span></td>
            <td>${task.due_date ? task.due_date : '-'}</td>
            <td>
                <div class="btn-group btn-group-sm">
                    <a href="/tasks/${task.id}/edit" class="btn btn-outline-primary">Edit</a>
                    <button class="btn btn-outline-danger" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            </td>
        </tr>`;
    });

    tableHTML += '</tbody></table></div>';
    taskListContainer.innerHTML = tableHTML;
}

// Obtener la clase CSS del badge de prioridad
function getPriorityBadgeClass(priority) {
    if (priority === 'high') return 'bg-danger';
    if (priority === 'medium') return 'bg-warning text-dark';
    return 'bg-success';
}

// Obtener el texto de prioridad
function getPriorityText(priority) {
    if (priority === 'high') return 'High';
    if (priority === 'medium') return 'Medium';
    return 'Low';
}

// Obtener la clase CSS del badge de estado
function getStatusBadgeClass(status) {
    if (status === 'completed') return 'bg-success';
    if (status === 'pending') return 'bg-warning text-dark';
    return 'bg-secondary';
}

// Obtener el texto del estado
function getStatusText(status) {
    if (status === 'completed') return 'Completed';
    if (status === 'pending') return 'Pending';
    return 'Unknown';
}

// Configurar el formulario de creación y edición de tareas
function setupCreateTaskForm() {
    const form = document.getElementById('task-form');
    if (!form) return;
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const taskId = form.dataset.taskId;
        taskId ? updateTask(taskId) : createTask();
    });
}

// Crear una tarea
function createTask() {
    let taskData = getFormData();
    axios.post('/api/tasks/create/', taskData)
        .then(() => {
            alert('Task created successfully!');
            window.location.href = '/tasks';
        })
        .catch(error => handleFormError(error));
}

// Actualizar una tarea existente
function updateTask(taskId) {
    let taskData = getFormData();
    axios.put(`/api/tasks/update/${taskId}/`, taskData)
        .then(() => {
            alert('Task updated successfully!');
            window.location.href = '/tasks';
        })
        .catch(error => handleFormError(error));
}

// Eliminar una tarea
function deleteTask(taskId) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    axios.delete(`/api/tasks/delete/${taskId}/`)
        .then(() => {
            alert('Task deleted successfully!');
            loadTasks();
        })
        .catch(error => console.error("Error deleting task:", error));
}

// Obtener los datos del formulario
function getFormData() {
    return {
        title: document.getElementById('id_title').value,
        description: document.getElementById('id_description').value,
        due_date: document.getElementById('id_due_date').value,
        priority: document.getElementById('id_priority').value,
        status: document.getElementById('id_status').value
    };
}

// Manejar errores del formulario
function handleFormError(error) {
    console.error("Error handling form submission:", error);
    alert('There was an error processing the request.');
}
