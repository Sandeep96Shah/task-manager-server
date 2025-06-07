require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportReports = require("./routes/reportRoutes");

const app = express();

// middleware to handle cors
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "PUT", "POST", "DELETE"],
  })
);

// Connect DataBase
connectDB();

// middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportReports);




const PORT = process.env.PORT || 5000;

// Start Server
app.listen(8000, () => {
    console.log(`Server is running on port: ${PORT}`);
})
