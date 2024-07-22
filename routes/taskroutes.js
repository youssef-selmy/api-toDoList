const express = require("express");
const {
  createTask,
  getAllTsks,
  getOneTask,
  updateOneTask,
  deleteTask,
} = require("../controllers/taskController");
const upload = require("../middlewares/uplodeImage");
const { protect } = require("../controllers/authController");
const router = express.Router();
// Get all tasks
router.get("/", protect, getAllTsks);

// Get a task by ID
router.get("/:id", protect, getOneTask);

// Create a new task
router.post("/", protect, upload.single("image"), createTask);

// Update a task
router.put("/:id", protect, upload.single("image"), updateOneTask);

// Delete a task
router.delete("/:id", protect, deleteTask);

module.exports = router;
