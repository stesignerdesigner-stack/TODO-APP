const input = document.getElementById("input");
const addBtn = document.getElementById("add");
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

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTodo();
  }
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
  let value = input.value.trim();

  if (value === "") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter a task.",
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
  while (items.firstChild) {
    items.removeChild(items.firstChild);
  }

  let filteredTodos = [];

  if (currentFilter === "all") {
    filteredTodos = todos;
  } else if (currentFilter === "pending") {
    filteredTodos = todos.filter(function (todo) {
      return !todo.completed;
    });
  } else {
    filteredTodos = todos.filter(function (todo) {
      return todo.completed;
    });
  }

  filteredTodos.forEach(function (todo) {
    let li = document.createElement("li");

    let text = document.createElement("span");
    text.className = "todo-text";

    let textNode = document.createTextNode(todo.text);

    text.appendChild(textNode);

    if (todo.completed) {
      text.classList.add("completed");
    }

    li.appendChild(text);

    let btnGroup = document.createElement("div");
    btnGroup.className = "btn-group";

    let editBtn = document.createElement("button");
    editBtn.className = "edit-btn";

    let editIcon = document.createElement("i");
    editIcon.className = "fa-solid fa-pen";

    editBtn.appendChild(editIcon);

    let deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";

    let deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-solid fa-trash";

    deleteBtn.appendChild(deleteIcon);

    let completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";

    let checkIcon = document.createElement("i");
    checkIcon.className = "fa-solid fa-check";

    completeBtn.appendChild(checkIcon);

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);
    btnGroup.appendChild(completeBtn);

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
    if (todo.completed) {
      completed++;
    } else {
      pending++;
    }
  });

  totalCount.firstChild
    ? (totalCount.firstChild.nodeValue = todos.length)
    : totalCount.appendChild(document.createTextNode(todos.length));

  pendingCount.firstChild
    ? (pendingCount.firstChild.nodeValue = pending)
    : pendingCount.appendChild(document.createTextNode(pending));

  completedCount.firstChild
    ? (completedCount.firstChild.nodeValue = completed)
    : completedCount.appendChild(document.createTextNode(completed));
}

function editTodo(todo, li, textSpan) {
  if (li.querySelector(".todo-input")) {
    return;
  }

  let editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "todo-input";
  editInput.value = todo.text;

  li.replaceChild(editInput, textSpan);

  editInput.focus();
  editInput.select();

  let btnGroup = li.querySelector(".btn-group");

  let editBtn = btnGroup.children[0];

  while (editBtn.firstChild) {
    editBtn.removeChild(editBtn.firstChild);
  }

  let saveIcon = document.createElement("i");
  saveIcon.className = "fa-solid fa-floppy-disk";

  editBtn.appendChild(saveIcon);

  editBtn.classList.remove("edit-btn");
  editBtn.classList.add("save-btn");

  function saveTodo() {
    let value = editInput.value.trim();

    if (value === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todo cannot be empty.",
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
    if (e.key === "Enter") {
      saveTodo();
    }
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
    if (result.isConfirmed) {
      todos = todos.filter(function (todo) {
        return todo.id !== id;
      });

      saveTodos();

      renderTodos();

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  });
}

function completeTodo(id) {
  todos.forEach(function (todo) {
    if (todo.id === id) {
      todo.completed = !todo.completed;
    }
  });

  saveTodos();
  
  renderTodos();
}
