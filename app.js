const list = document.getElementById('list');
const add = document.getElementById('add');
const taskInput = document.getElementById('task');

add.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const li = document.createElement('li');

    const span = document.createElement('span');
    span.innerText = taskText;
    span.classList.add('task-text');

    const editBtn = document.createElement('button');
    editBtn.innerText = 'Edit';
    editBtn.addEventListener('click', function () {
        enableEditMode(li, span, editBtn);
    });

    li.appendChild(span);
    li.appendChild(editBtn);

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

    editBtn.innerText = 'Save';

    
    function saveEdit() {
        if (input.value.trim() !== '') {
            span.innerText = input.value.trim();
            li.insertBefore(span, input);
            li.removeChild(input);
            editBtn.innerText = 'Edit';
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
