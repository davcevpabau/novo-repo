document.getElementById('add').addEventListener('click', addTask);
document.getElementById('task').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskInput = document.getElementById('task');
    const taskText = taskInput.value.trim();

    if (taskText === '') return;

    const list = document.getElementById('list');

    
    const li = document.createElement('li');


    const span = document.createElement('span');
    span.innerText = taskText;
    span.classList.add('task-text');

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.addEventListener('click', function () {
        enableEditMode(li, span, editBtn);
    });

    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener('click', function () {
        list.removeChild(li);
    });

 
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);

    taskInput.value = '';
}

function enableEditMode(li, span, editBtn) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = span.innerText;
    input.classList.add('edit-input');

    li.insertBefore(input, span);
    li.removeChild(span);

    editBtn.innerHTML = '<i class="fas fa-save"></i>';

    function saveEdit() {
        if (input.value.trim() !== '') {
            span.innerText = input.value.trim();
            li.insertBefore(span, input);
            li.removeChild(input);
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.onclick = function () {
                enableEditMode(li, span, editBtn);
            };
        }
    }

    editBtn.onclick = saveEdit;

    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });

    input.focus();
}