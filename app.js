const input = document.getElementById("input");
const addBtn = document.getElementById("add");
const deleteAllBtn = document.getElementById("deleteAll");
const items = document.getElementById("items");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const allBtn = document.getElementById("allTasks");
const pendingBtn = document.getElementById("pendingTasks");
const completedBtn = document.getElementById("completedTasks");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

addBtn.addEventListener("click", addTodo);
deleteAllBtn.addEventListener("click", deleteAllTodos);

input.addEventListener("keypress", function (e) {
  e.key === "Enter" ? addTodo() : null;
});

allBtn.addEventListener("click", function () {
  currentFilter = "all";
  setActiveButton(this);
  renderTodos();
});

pendingBtn.addEventListener("click", function () {
  currentFilter = "pending";
  setActiveButton(this);
  renderTodos();
});

completedBtn.addEventListener("click", function () {
  currentFilter = "completed";
  setActiveButton(this);
  renderTodos();
});

function setActiveButton(button) {
  allBtn.classList.remove("active");
  pendingBtn.classList.remove("active");
  completedBtn.classList.remove("active");

  button.classList.add("active");
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodo() {
  const value = input.value.trim();

  if (value === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter a task.",
    });

    return;
  }

  const duplicate = todos.some(function (todo) {
    return todo.text.toLowerCase() === value.toLowerCase();
  });

  if (duplicate) {
    Swal.fire({
      icon: "warning",
      title: "Duplicate Task",
      text: "This task already exists.",
    });

    return;
  }

  todos.push({
    id: Date.now(),
    text: value,
    completed: false,
  });

  input.value = "";

  saveTodos();

  renderTodos();
}

renderTodos();

function renderTodos() {
  items.innerHTML = "";

  let filteredTodos =
    currentFilter === "all"
      ? todos
      : currentFilter === "pending"
        ? todos.filter(function (todo) {
            return !todo.completed;
          })
        : todos.filter(function (todo) {
            return todo.completed;
          });

  filteredTodos.forEach(function (todo) {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    todo.completed ? text.classList.add("completed") : null;

    li.appendChild(text);

    const btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.innerHTML = '<i class="fa-solid fa-check"></i>';

    btnGroup.append(editBtn, deleteBtn, completeBtn);

    li.appendChild(btnGroup);

    items.appendChild(li);

    editBtn.addEventListener("click", function () {
      editTodo(todo, li, text);
    });

    deleteBtn.addEventListener("click", function () {
      deleteTodo(todo.id);
    });

    completeBtn.addEventListener("click", function () {
      completeTodo(todo.id);
    });
  });

  updateStats();
}

function updateStats() {
  let pending = 0;
  let completed = 0;

  todos.forEach(function (todo) {
    todo.completed ? completed++ : pending++;
  });

  totalCount.textContent = todos.length;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;

  deleteAllBtn.disabled = todos.length === 0 ? true : false;
}

function editTodo(todo, li, textSpan) {
  if (li.querySelector(".todo-input")) return;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "todo-input";
  editInput.value = todo.text;

  li.replaceChild(editInput, textSpan);

  editInput.focus();
  editInput.select();

  const btnGroup = li.querySelector(".btn-group");
  const editBtn = btnGroup.children[0];

  editBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';

  editBtn.classList.remove("edit-btn");
  editBtn.classList.add("save-btn");

  function saveTodo() {
    const value = editInput.value.trim();

    if (value === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todo cannot be empty.",
      });

      return;
    }

    const duplicate = todos.some(function (item) {
      return (
        item.id !== todo.id && item.text.toLowerCase() === value.toLowerCase()
      );
    });

    if (duplicate) {
      Swal.fire({
        icon: "warning",
        title: "Duplicate Task",
        text: "Another task with the same name already exists.",
      });

      return;
    }

    todo.text = value;

    saveTodos();

    renderTodos();
  }

  editBtn.addEventListener("click", saveTodo, {
    once: true,
  });

  editInput.addEventListener("keypress", function (e) {
    e.key === "Enter" ? saveTodo() : null;
  });
}

function deleteTodo(id) {
  Swal.fire({
    title: "Delete Task?",
    text: "This task will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Delete",
  }).then(function (result) {
    result.isConfirmed
      ? ((todos = todos.filter(function (todo) {
          return todo.id !== id;
        })),
        saveTodos(),
        renderTodos(),
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          timer: 1200,
          showConfirmButton: false,
        }))
      : null;
  });
}

function completeTodo(id) {
  todos.forEach(function (todo) {
    todo.id === id ? (todo.completed = !todo.completed) : null;
  });

  saveTodos();

  renderTodos();
}

function deleteAllTodos() {
  if (todos.length === 0) {
    Swal.fire({
      icon: "info",
      title: "No Tasks",
      text: "There are no tasks to delete.",
    });

    return;
  }

  Swal.fire({
    title: "Delete All Tasks?",
    text: "All tasks will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Delete All",
  }).then(function (result) {
    result.isConfirmed
      ? ((todos = []),
        saveTodos(),
        renderTodos(),
        Swal.fire({
          icon: "success",
          title: "All Tasks Deleted",
          timer: 1500,
          showConfirmButton: false,
        }))
      : null;
  });
}
