// -------------------- DB --------------------
const db = new Dexie("TodoDB");

db.version(1).stores({
  todos: "++id, title, pendingSync"
});


// -------------------- SAVE TODO --------------------
async function saveTodo() {

  const input = document.getElementById("todoInput");
  const title = input.value.trim();

  if (!title) return;

  // save locally first
  const id = await db.todos.add({
    title,
    pendingSync: true
  });

  console.log(id)

  input.value = "";
  loadTodos();

  // try sync if online
  if (navigator.onLine) {
    syncTodo(id);
  }
}


// -------------------- SYNC SINGLE TODO --------------------
async function syncTodo(id) {

  const todo = await db.todos.get(id);
  if (!todo) return;

  if (!navigator.onLine) {
    console.log("No internet");
    return;
  }

  try {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(todo)
    });

    if (res.ok) {
      await db.todos.update(id, { pendingSync: false });
    }

  } catch (err) {
    console.log("Sync failed:", err);
  }
}


// -------------------- LOAD TODOS --------------------
async function loadTodos() {

  const todos = await db.todos.toArray();

  const list = document.getElementById("todoList");
  list.innerHTML = "";

  todos.forEach(todo => {

    const li = document.createElement("li");

    li.textContent =
      todo.title +
      (todo.pendingSync ? " (offline)" : "");

    list.appendChild(li);
  });
}


// -------------------- SYNC ALL PENDING --------------------
async function syncPendingTodos() {

  if (!navigator.onLine) return;

  const pending = await db.todos
    .filter(todo => todo.pendingSync === true)
    .toArray();

  for (const todo of pending) {
    await syncTodo(todo.id);
  }

  console.log("Sync complete");
}


// -------------------- ONLINE EVENT --------------------
window.addEventListener("online", () => {
  console.log("Back online");
  syncPendingTodos();
});


// -------------------- SERVICE WORKER --------------------
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/static/service-worker.js")
    .then(() => console.log("SW registered"));
}