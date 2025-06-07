const Task = require("../models/Task");
const User = require("../models/User");
const excelJs = require("exceljs");

// @desc Export all tasks as an excel file
// @route GET /api/reports/export/tasks
// @access Private (Admin)
const exportTasksReport = async (req, res) => {
  try {
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error exporting tasks ${error.message}` });
  }
};

// @desc  export user-task report as an excel
// @route GET /api/reports/export/users
// @access Private(Admin)
const exportUsersReport = async (req, res) => {
  try {
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error exporting users ${error.message}` });
  }
};

module.exports = { exportTasksReport, exportUsersReport };
