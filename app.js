document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("add");
  const taskInput = document.getElementById("task");
  const taskDate = document.getElementById("task-date");
  const taskTime = document.getElementById("task-time");
  const taskCategory = document.getElementById("task-category");
  const taskPriority = document.getElementById("task-priority");
  const list = document.getElementById("list");
  const remindersPanel = document.getElementById("reminders-panel");
  const remindersList = document.getElementById("appointments-list");
  const reminderToggle = document.getElementById("reminder-toggle");
  const closePanel = document.getElementById("close-panel");
  const tasksCount = document.getElementById("tasks-count");
  const clearCompletedBtn = document.getElementById("clear-completed");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("search-tasks");
  const themeSwitch = document.getElementById("theme-switch");
  const exportTasksBtn = document.getElementById("export-tasks");
  const notification = document.getElementById("notification");
  const notificationMessage = document.getElementById("notification-message");
  const notificationClose = document.getElementById("notification-close");

  const today = new Date();
  const formattedDate = formatDateForInput(today);
  taskDate.value = formattedDate;

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";
  let darkMode = localStorage.getItem("darkMode") === "true";

  init();

  addButton.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  });

  reminderToggle.addEventListener("click", toggleRemindersPanel);
  closePanel.addEventListener("click", toggleRemindersPanel);

  clearCompletedBtn.addEventListener("click", clearCompletedTasks);

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.getAttribute("data-filter");
      renderTasks();
    });
  });

  searchInput.addEventListener("input", renderTasks);

  themeSwitch.addEventListener("click", toggleTheme);

  exportTasksBtn.addEventListener("click", exportTasks);

  notificationClose.addEventListener("click", hideNotification);

  // Functions
  function init() {
    if (darkMode) {
      document.body.classList.add("dark-theme");
      themeSwitch.innerHTML = '<i class="fas fa-sun"></i>';
    }
    renderTasks();
    updateTasksCount();
    setUpTaskReminders();
  }

  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const now = new Date();
    const selectedDate = taskDate.value ? new Date(taskDate.value) : now;
    const selectedTime = taskTime.value;
    const category = taskCategory.value;
    const priority = taskPriority.value;

    // Create timestamp
    let timestamp;
    if (selectedTime) {
      // Combine the date and time
      const [hours, minutes] = selectedTime.split(":");
      selectedDate.setHours(parseInt(hours), parseInt(minutes));
      timestamp = selectedDate.getTime();
    } else {
      timestamp = selectedDate.getTime();
    }

    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      timestamp: timestamp,
      dateStr: formatDate(new Date(timestamp)),
      timeStr: selectedTime ? formatTime(new Date(timestamp)) : "",
      completed: false,
      category: category,
      priority: priority,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateTasksCount();
    addToReminders(newTask);

    // Clear inputs
    taskInput.value = "";
    taskTime.value = "";
    taskCategory.value = "";
    taskPriority.value = "medium";

    // Show notification
    showNotification("Task added successfully!");

    // Focus back on the input field
    taskInput.focus();
  }

  function renderTasks() {
    list.innerHTML = "";

    let filteredTasks = [...tasks];

    // Apply filter
    if (currentFilter === "active") {
      filteredTasks = filteredTasks.filter((task) => !task.completed);
    } else if (currentFilter === "completed") {
      filteredTasks = filteredTasks.filter((task) => task.completed);
    }

    // Apply search
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.text.toLowerCase().includes(searchTerm) ||
          task.category.toLowerCase().includes(searchTerm)
      );
    }

    // Sort tasks: priority first, then uncompleted first, then by date
    filteredTasks.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityCompare =
        priorityOrder[a.priority] - priorityOrder[b.priority];

      if (priorityCompare !== 0) return priorityCompare;

      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      return a.timestamp - b.timestamp;
    });

    filteredTasks.forEach((task) => {
      const li = createTaskElement(task);
      list.appendChild(li);
    });

    updateTasksCount();
  }

  function createTaskElement(task) {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.dataset.id = task.id;
    if (task.completed) {
      li.classList.add("completed");
    }

    // Task content container
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("task-content");

    // Task text
    const taskText = document.createElement("span");
    taskText.classList.add("task-text");
    taskText.textContent = task.text;
    contentDiv.appendChild(taskText);

    // Task metadata
    const metaDiv = document.createElement("div");
    metaDiv.classList.add("task-meta");

    // Task time
    const timeDiv = document.createElement("div");
    timeDiv.classList.add("task-time");
    timeDiv.innerHTML = `<i class="far fa-calendar-alt"></i> ${task.dateStr}`;
    if (task.timeStr) {
      timeDiv.innerHTML += ` <i class="far fa-clock"></i> ${task.timeStr}`;
    }
    metaDiv.appendChild(timeDiv);

    // Task category
    if (task.category) {
      const categorySpan = document.createElement("span");
      categorySpan.classList.add("task-category", `category-${task.category}`);
      categorySpan.textContent =
        task.category.charAt(0).toUpperCase() + task.category.slice(1);
      metaDiv.appendChild(categorySpan);
    }

    // Task priority
    const prioritySpan = document.createElement("span");
    prioritySpan.classList.add("task-priority", `priority-${task.priority}`);
    prioritySpan.textContent =
      task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    metaDiv.appendChild(prioritySpan);

    contentDiv.appendChild(metaDiv);
    li.appendChild(contentDiv);

    // Task actions
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("task-actions");

    // Complete button
    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.innerHTML = task.completed
      ? '<i class="fas fa-undo"></i>'
      : '<i class="far fa-check-circle"></i>';
    completeBtn.title = task.completed
      ? "Mark as incomplete"
      : "Mark as complete";
    completeBtn.addEventListener("click", () => toggleTaskComplete(task.id));
    actionsDiv.appendChild(completeBtn);

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.title = "Edit task";
    editBtn.addEventListener("click", () => enableEditMode(li, taskText, task));
    actionsDiv.appendChild(editBtn);

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.title = "Delete task";
    deleteBtn.addEventListener("click", () => deleteTask(task.id));
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(actionsDiv);

    return li;
  }

  function enableEditMode(li, taskTextElement, task) {
    // Create edit input
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;
    input.classList.add("edit-input");

    // Replace task text with input
    const taskContentDiv = li.querySelector(".task-content");
    taskContentDiv.insertBefore(input, taskTextElement);
    taskContentDiv.removeChild(taskTextElement);

    // Change edit button to save button
    const editBtn = li.querySelector(".edit-btn");
    editBtn.innerHTML = '<i class="fas fa-save"></i>';
    editBtn.title = "Save changes";

    function saveEdit() {
      if (input.value.trim() !== "") {
        task.text = input.value.trim();
        taskTextElement.textContent = task.text;

        taskContentDiv.insertBefore(taskTextElement, input);
        taskContentDiv.removeChild(input);

        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = "Edit task";

        const taskIndex = tasks.findIndex((t) => t.id === task.id);
        if (taskIndex !== -1) {
          tasks[taskIndex] = task;
          saveTasks();
          updateReminder(task);
        }

        showNotification("Task updated successfully!");
      }
    }

    editBtn.removeEventListener("click", () =>
      enableEditMode(li, taskTextElement, task)
    );
    editBtn.addEventListener("click", saveEdit, { once: true });

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        saveEdit();
      }
    });

    input.focus();
  }

  function toggleTaskComplete(taskId) {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      saveTasks();
      renderTasks();
      updateTasksCount();

      // Show notification
      if (tasks[taskIndex].completed) {
        showNotification("Task marked as completed!");
      } else {
        showNotification("Task marked as active!");
      }
    }
  }

  function deleteTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasks();
    renderTasks();
    updateTasksCount();
    removeFromReminders(taskId);

    // Show notification
    showNotification("Task deleted successfully!");
  }

  function clearCompletedTasks() {
    if (tasks.some((task) => task.completed)) {
      tasks = tasks.filter((task) => !task.completed);
      saveTasks();
      renderTasks();
      updateTasksCount();
      renderReminders();

      // Show notification
      showNotification("Completed tasks cleared!");
    }
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateTasksCount() {
    const activeTasks = tasks.filter((task) => !task.completed).length;
    const totalTasks = tasks.length;

    if (totalTasks === 0) {
      tasksCount.textContent = "No tasks";
    } else {
      tasksCount.textContent = `${activeTasks} active / ${totalTasks} total`;
    }
  }

  function addToReminders(task) {
    const reminderItem = createReminderElement(task);
    remindersList.appendChild(reminderItem);
  }

  function updateReminder(task) {
    const reminderItem = remindersList.querySelector(`[data-id="${task.id}"]`);
    if (reminderItem) {
      const newReminderItem = createReminderElement(task);
      remindersList.replaceChild(newReminderItem, reminderItem);
    }
  }

  function removeFromReminders(taskId) {
    const reminderItem = remindersList.querySelector(`[data-id="${taskId}"]`);
    if (reminderItem) {
      remindersList.removeChild(reminderItem);
    }
  }

  function renderReminders() {
    remindersList.innerHTML = "";

    // Sort tasks by timestamp (earliest first)
    const sortedTasks = [...tasks].sort((a, b) => a.timestamp - b.timestamp);

    sortedTasks.forEach((task) => {
      const reminderItem = createReminderElement(task);
      remindersList.appendChild(reminderItem);
    });
  }

  function createReminderElement(task) {
    const li = document.createElement("li");
    li.classList.add("reminder-item");
    li.dataset.id = task.id;
    if (task.completed) {
      li.classList.add("completed");
    }

    // Reminder content
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("reminder-content");

    // Task text with priority and category indicators
    let taskHTML = `<strong>${task.text}</strong>`;
    if (task.category) {
      taskHTML += ` <span class="task-category category-${task.category}">${task.category}</span>`;
    }
    taskHTML += ` <span class="task-priority priority-${task.priority}">${task.priority}</span>`;
    contentDiv.innerHTML = taskHTML;

    // Time
    const timeSpan = document.createElement("span");
    timeSpan.classList.add("reminder-time");
    timeSpan.innerHTML = `<i class="far fa-calendar-alt"></i> ${task.dateStr}`;
    if (task.timeStr) {
      timeSpan.innerHTML += ` <i class="far fa-clock"></i> ${task.timeStr}`;
    }
    contentDiv.appendChild(timeSpan);

    li.appendChild(contentDiv);

    // Reminder actions
    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("reminder-actions");

    // Complete button
    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.innerHTML = task.completed
      ? '<i class="fas fa-undo"></i>'
      : '<i class="far fa-check-circle"></i>';
    completeBtn.addEventListener("click", () => toggleTaskComplete(task.id));
    actionsDiv.appendChild(completeBtn);

    li.appendChild(actionsDiv);

    return li;
  }

  function toggleRemindersPanel() {
    if (remindersPanel.style.display === "none") {
      remindersPanel.style.display = "block";
      reminderToggle.textContent = "📅 Hide Appointments";
      renderReminders();
    } else {
      remindersPanel.style.display = "none";
      reminderToggle.textContent = "📅 Show Appointments";
    }
  }

  function toggleTheme() {
    darkMode = !darkMode;
    if (darkMode) {
      document.body.classList.add("dark-theme");
      themeSwitch.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.body.classList.remove("dark-theme");
      themeSwitch.innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem("darkMode", darkMode);
  }

  function exportTasks() {
    if (tasks.length === 0) {
      showNotification("No tasks to export!");
      return;
    }

    // Format tasks for export
    let exportText = "# Davcev To-Do List Export\n\n";
    exportText += `Date: ${formatDate(new Date())}\n\n`;

    // Active tasks
    const activeTasks = tasks.filter((task) => !task.completed);
    if (activeTasks.length > 0) {
      exportText += "## Active Tasks\n\n";
      activeTasks.forEach((task) => {
        exportText += `- ${task.text} (${task.priority} priority`;
        if (task.category) exportText += `, ${task.category}`;
        exportText += `)\n  Due: ${task.dateStr}`;
        if (task.timeStr) exportText += ` at ${task.timeStr}`;
        exportText += "\n\n";
      });
    }

    // Completed tasks
    const completedTasks = tasks.filter((task) => task.completed);
    if (completedTasks.length > 0) {
      exportText += "## Completed Tasks\n\n";
      completedTasks.forEach((task) => {
        exportText += `- ~~${task.text}~~ (${task.priority} priority`;
        if (task.category) exportText += `, ${task.category}`;
        exportText += `)\n  Due: ${task.dateStr}`;
        if (task.timeStr) exportText += ` at ${task.timeStr}`;
        exportText += "\n\n";
      });
    }

    // Create and download the file
    const blob = new Blob([exportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `davcev-todo-export-${formatDateForFileName(new Date())}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification("Tasks exported successfully!");
  }

  function setUpTaskReminders() {
    // Check for tasks that are due soon
    setInterval(() => {
      const now = new Date().getTime();

      tasks.forEach((task) => {
        // Skip completed tasks
        if (task.completed) return;

        // If the task has a time set and is due within the next minute
        if (
          task.timeStr &&
          task.timestamp - now <= 60000 &&
          task.timestamp > now
        ) {
          // Show browser notification if supported
          if ("Notification" in window) {
            if (Notification.permission === "granted") {
              new Notification("Task Reminder", {
                body: `Your task "${task.text}" is due soon!`,
                icon: "https://fonts.gstatic.com/s/i/materialiconsoutlined/notifications/v18/24px.svg",
              });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission();
            }
          }

          // Show in-app notification
          showNotification(`Reminder: "${task.text}" is due soon!`, 10000);
        }
      });
    }, 30000); // Check every 30 seconds
  }

  function showNotification(message, duration = 3000) {
    notificationMessage.textContent = message;
    notification.classList.add("show");

    // Hide notification after duration
    setTimeout(() => {
      hideNotification();
    }, duration);
  }

  function hideNotification() {
    notification.classList.remove("show");
  }

  // Utility functions
  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function formatDate(date) {
    const options = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  }

  function formatTime(date) {
    const options = { hour: "2-digit", minute: "2-digit" };
    return date.toLocaleTimeString([], options);
  }

  function formatDateForFileName(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
});
