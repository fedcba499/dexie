const db = new Dexie("TodoDB");

db.version(1).stores({
  todos: "++id, title"
});

async function addTodo() {
  const input = document.getElementById("todoInput");
  const value = input.value;

  if (!value) return;

  await db.todos.add({ title: value });

  input.value = "";
  loadTodos();
}

async function loadTodos() {
  const todos = await db.todos.toArray();

  const list = document.getElementById("todoList");
  list.innerHTML = "";

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.textContent = todo.title;
    list.appendChild(li);
  });
}

loadTodos();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("Service Worker Registered"))
}