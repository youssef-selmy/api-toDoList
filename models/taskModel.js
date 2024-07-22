const mongoose = require("mongoose");

// Define schema for Task
// {
//   "image"  : "path.png",
//   "title" : "title",
//   "desc" : "desc",
//   "priority" : "low",//low , medium , high
//   "dueDate" : "2024-05-15"
// }

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  desc: String,
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  dueDate: Date,
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
