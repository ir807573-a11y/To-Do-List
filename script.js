const STORAGE_KEY = "todo-tasks";
let tasks = loadTasks();

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");
const emptyMessage = document.getElementById("empty-message");
const clearAllButton = document.getElementById("clear-all");

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn("Could not save tasks:", error);
  }
}

function addTask(text) {
  tasks.push({ id: Date.now(), text: text, completed: false });
  update();
}

function toggleTask(id) {
  const task = tasks.find(function (item) {
    return item.id === id;
  });

  if (task) {
    task.completed = !task.completed;
  }
  update();
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  update();
}

function editTask(id, newText) {
  const task = tasks.find(function (item) {
    return item.id === id;
  });

  if (task && newText.trim() !== "") {
    task.text = newText.trim();
  }
  update();
}

function clearAll() {
  if (tasks.length === 0) return;

  if (confirm("Remove all tasks?")) {
    tasks = [];
    update();
  }
}

function render() {
  list.innerHTML = "";

  tasks.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task-item";

    if (task.completed) {
      li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn-ghost";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", function () {
      startEdit(li, task);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn btn-danger";
    deleteBtn.style.padding = "6px 10px";
    deleteBtn.style.fontSize = "0.85rem";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    actions.append(editBtn, deleteBtn);
    li.append(checkbox, text, actions);
    list.appendChild(li);
  });

  const pending = tasks.filter(function (task) {
    return !task.completed;
  }).length;

  if (pending === 1) {
    counter.textContent = "1 task pending";
  } else {
    counter.textContent = pending + " tasks pending";
  }

  emptyMessage.hidden = tasks.length > 0;
}

function startEdit(li, task) {
  const textElement = li.querySelector(".task-text");
  const editButton = li.querySelector(".btn-ghost");

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "edit-input";
  editInput.value = task.text;
  textElement.replaceWith(editInput);
  editInput.focus();

  editButton.textContent = "Save";
  editButton.onclick = function () {
    editTask(task.id, editInput.value);
  };

  editInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      editTask(task.id, editInput.value);
    } else if (event.key === "Escape") {
      render();
    }
  });
}

function update() {
  saveTasks();
  render();
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const value = input.value.trim();
  if (value === "") return;

  addTask(value);
  input.value = "";
  input.focus();
});

clearAllButton.addEventListener("click", clearAll);

render();
