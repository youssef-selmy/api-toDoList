const express = require("express");
const mongoose = require("mongoose");
const taskRouter = require("./routes/taskroutes");
const authRouter = require("./routes/authRoute");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });
const path = require("path");
// Initialize Express app
const app = express();
const port = process.env.port;

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//mount route
app.use("/tasks", taskRouter);
app.use("/auth", authRouter);

// MongoDB connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Routes

// Start the server
app.listen(port || 3000, () => {
  console.log(`Server running at http://localhost:${port}`);
});
