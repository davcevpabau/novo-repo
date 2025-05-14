document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("add");
  const taskInput = document.getElementById("task");
  const list = document.getElementById("list");
  const remindersPanel = document.getElementById("reminders-panel");
  const remindersList = document.getElementById("reminders-list");

  addButton.addEventListener("click", addTask);

  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  function addTask() {
    const taskText = taskInput.value.trim();
    const selectedTime = document.getElementById("task-time").value;

    if (taskText === "") return;

    const now = new Date();
    const dateStr = now.toLocaleDateString();
    const timeStr = selectedTime
      ? selectedTime
      : now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const fullTimestamp = `${dateStr} ${timeStr}`;

    const li = document.createElement("li");
    li.classList.add("task-item");

    const span = document.createElement("span");
    span.innerText = taskText;
    span.classList.add("task-text");

    const time = document.createElement("div");
    time.className = "task-time";
    time.innerText = fullTimestamp;

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.addEventListener("click", () =>
      enableEditMode(li, span, editBtn, time)
    );

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener("click", () => {
      list.removeChild(li);
      remindersList.removeChild(reminderLi);
    });

    li.appendChild(span);
    li.appendChild(time);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    list.appendChild(li);

    const reminderLi = document.createElement("li");
    reminderLi.classList.add("reminder-item");
    reminderLi.innerHTML = `<strong>${taskText}</strong><br><small>${fullTimestamp}</small>`;
    remindersList.appendChild(reminderLi);

    taskInput.value = "";
    document.getElementById("task-time").value = "";
  }

  function enableEditMode(li, span, editBtn, time) {
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.innerText;
    input.classList.add("edit-input");

    li.insertBefore(input, span);
    li.removeChild(span);

    editBtn.innerHTML = '<i class="fas fa-save"></i>';

    function saveEdit() {
      if (input.value.trim() !== "") {
        span.innerText = input.value.trim();
        li.insertBefore(span, input);
        li.removeChild(input);
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.addEventListener(
          "click",
          () => enableEditMode(li, span, editBtn, time),
          { once: true }
        );
      }
    }

    editBtn.addEventListener("click", saveEdit, { once: true });

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        saveEdit();
      }
    });

    input.focus();
  }

  const reminderToggle = document.getElementById("reminder-toggle");
  reminderToggle.addEventListener("click", () => {
    remindersPanel.classList.toggle("open");
  });
});
