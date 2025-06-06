const User = require("../models/User");
const Task = require("../models/Task");
const bcrypt = require("bcryptjs");

// @desc Get all users (Admin only)
// @route GET /api/users
// @sccess Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    // Add task count for each user
    const usersWithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const pendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const inProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "In Progress",
        });
        const completedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });

        return {
          ...user._doc,
          pendingTasks,
          inProgressTasks,
          completedTasks,
        };
      })
    );

    return res.status(200).json(usersWithTaskCounts);
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc Get user by id
// @route GET /api/user/:id
// @access Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = { getUsers, getUserById };
