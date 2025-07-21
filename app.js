const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const API_URL = "http://localhost:5000/tasks";

// Model elemanları
const deleteConfirmModel = document.getElementById("deleteConfirmModel");
const modelYes = document.getElementById("modelYes");
const modelNo = document.getElementById("modelNo");

let taskIdToDelete = null;

// Görevleri yükle
async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();

  taskList.innerHTML = "";
  tasks.forEach(renderTask);
}

// Tek bir görevi listeye ekle
function renderTask(task) {
  const li = document.createElement("li");
  li.className =
    "flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2";

  const span = document.createElement("span");
  span.textContent = task.task;
  span.className = "flex-1";
  if (task.completed) {
    span.classList.add("line-through", "text-gray-400");
  }

  // Görevi tamamlandı yapma
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "✔️";
  completeBtn.className =
    "text-green-500 font-bold px-2 hover:scale-110 transition";
  completeBtn.addEventListener("click", async () => {
    await fetch(`${API_URL}/${task._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed }),
    });
    fetchTasks(); // Güncelle
  });

  // Görev silme
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "🗑️";
  deleteBtn.className =
    "text-red-500 font-bold px-2 hover:scale-110 transition";
  deleteBtn.addEventListener("click", () => {
    taskIdToDelete = task._id;
    deleteConfirmModel.classList.remove("hidden");
  });

  li.appendChild(span);
  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

// Model "Evet" butonu
modelYes.addEventListener("click", async () => {
  if (taskIdToDelete) {
    await fetch(`${API_URL}/${taskIdToDelete}`, { method: "DELETE" });
    taskIdToDelete = null;
    fetchTasks();
  }
  deleteConfirmModel.classList.add("hidden");
});

// Model "Hayır" butonu
modelNo.addEventListener("click", () => {
  taskIdToDelete = null;
  deleteConfirmModel.classList.add("hidden");
});

// Görev ekleme
addTaskBtn.addEventListener("click", async () => {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task: taskText }),
  });

  taskInput.value = "";
  fetchTasks(); // Görevleri güncelleme
});

// Enter tuşu ile görev ekleme
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTaskBtn.click();
  }
});

// Sayfa açılınca görevleri getir
fetchTasks();
