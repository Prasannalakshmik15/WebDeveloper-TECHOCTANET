// script.js
document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const priorityInput = document.getElementById('priority-input');
    const dueDateInput = document.getElementById('due-date-input');
    const imageInput = document.getElementById('image-input');
    const descriptionInput = document.getElementById('description-input');
    const todoList = document.getElementById('todo-list');
    const allTasksButton = document.getElementById('all-tasks');
    const completedTasksButton = document.getElementById('completed-tasks');
    const pendingTasksButton = document.getElementById('pending-tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = (filter = 'all') => {
        todoList.innerHTML = '';
        tasks.filter(task => {
            if (filter === 'all') return true;
            if (filter === 'completed') return task.completed;
            if (filter === 'pending') return !task.completed;
        }).forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = task.completed ? 'completed' : '';

            const taskText = document.createElement('span');
            taskText.textContent = `${task.text} (${task.priority}) - Due: ${task.dueDate}`;
            listItem.appendChild(taskText);

            const taskDescription = document.createElement('p');
            taskDescription.textContent = task.description;
            listItem.appendChild(taskDescription);

            if (task.image) {
                const taskImage = document.createElement('img');
                taskImage.src = task.image;
                listItem.appendChild(taskImage);
            }

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            const completeButton = document.createElement('button');
            completeButton.textContent = task.completed ? 'Unmark' : 'Complete';
            completeButton.addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks(filter);
            });
            taskActions.appendChild(completeButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                tasks = tasks.filter(t => t !== task);
                saveTasks();
                renderTasks(filter);
            });
            taskActions.appendChild(deleteButton);

            listItem.appendChild(taskActions);

            todoList.appendChild(listItem);
        });
    };

    todoForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskText = todoInput.value.trim();
        const priority = priorityInput.value;
        const dueDate = dueDateInput.value;
        const description = descriptionInput.value;
        const image = imageInput.files[0];

        if (taskText !== "" && dueDate !== "") {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newTask = {
                    text: taskText,
                    priority: priority,
                    dueDate: dueDate,
                    description: description,
                    image: reader.result || '',
                    completed: false
                };

                tasks.push(newTask);
                saveTasks();
                renderTasks();

                todoInput.value = "";
                priorityInput.value = "low";
                dueDateInput.value = "";
                descriptionInput.value = "";
                imageInput.value = "";
            };

            if (image) {
                reader.readAsDataURL(image);
            } else {
                reader.onloadend();
            }
        }
    });

    allTasksButton.addEventListener('click', () => renderTasks('all'));
    completedTasksButton.addEventListener('click', () => renderTasks('completed'));
    pendingTasksButton.addEventListener('click', () => renderTasks('pending'));

    renderTasks();
});
