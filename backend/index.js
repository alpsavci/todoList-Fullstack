const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MongoDB Atlas bağlantısı (yerine kendi URI'nı yapıştır)
mongoose
  .connect("mongodb+srv://alpasavci:0123659Kralman66.@to-dolist.wlqqn00.mongodb.net/")
  .then(() => console.log("MongoDB bağlantısı başarılı"))
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));

// Görev şeması ve modeli
const taskSchema = new mongoose.Schema({
  task: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);

// Rotalar
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Yeni görev ekleme
app.post("/tasks", async (req, res) => {
  const { task } = req.body;
  const newTask = new Task({ task });
  await newTask.save();
  res.status(201).json(newTask);
});

// Görev silme
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Görev güncelleme (tamamlandı durumu)
app.patch("/tasks/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { completed: req.body.completed },
    { new: true }
  );
  res.json(updatedTask);
});

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
