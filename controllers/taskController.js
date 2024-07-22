const Task = require("../models/taskModel");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const path = require("path");

exports.createTask = asyncHandler(async (req, res) => {
  try {
    const { title, desc, priority, dueDate } = req.body;

    const image = req.file ? `uploads/${req.file.filename}` : null;

    const newTask = await Task.create({
      title,
      image,
      desc,
      priority,
      dueDate,
    });
    const baseUrl = `http://localhost:3000/`;
    newTask.image = image ? `${baseUrl}${image}` : null;

    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.getAllTsks = asyncHandler(async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
exports.getOneTask = asyncHandler(async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      res.json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.updateOneTask = asyncHandler(async (req, res) => {
  const { title, desc, priority, dueDate } = req.body;
  const image = req.file ? `uploads/${req.file.filename}` : null;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, image, desc, priority, dueDate },
      { new: true }
    );
    if (updatedTask) {
      const baseUrl = `http://localhost:3000/`;
      updatedTask.image = updatedTask.image
        ? `${baseUrl}${updatedTask.image}`
        : null;

      res.json(updatedTask);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

exports.deleteTask = asyncHandler(async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.image) {
      const imagePath = path.join(
        __dirname,
        "../uploads",
        path.basename(task.image)
      );

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete image file:", err);
        }
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
