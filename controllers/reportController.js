const Task = require("../models/Task");
const User = require("../models/User");
const excelJs = require("exceljs");

// @desc Export all tasks as an excel file
// @route GET /api/reports/export/tasks
// @access Private (Admin)
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const workbook = new excelJs.Workbook();
    workSheet = workbook.addWorksheet("Tasks Report");

    workSheet.columns[
      ({ header: "Task ID", key: "_id", width: 25 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "desciption", width: 50 },
      { header: "Priority", key: "priority", width: 25 },
      { header: "Status", key: "status", width: 25 },
      { header: "Due Date", key: "dueDate", width: 25 },
      { header: "Assigned To", key: "assignedTo", width: 35 })
    ];

    tasks.forEach((task) => {
      const assignedTo = task.assignedTo
        .map((item) => `${item.name} ${item.email}`)
        .join(", ");

      const { _id, title, description, priority, status, dueDate } = task;
      workSheet.addRow({
        _id,
        title,
        description,
        priority,
        status,
        dueDate: dueDate.toISOString().split("T")[0],
        assignedTo: assignedTo || "Unassigned",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="tasks_report.xlsx"`
    );

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
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
    const users = await User.find().select("name email _id").lean();
    const userTasks = await Task.find().populate(
      "assignedTo",
      "name email _id"
    );

    const userTaskMap = {};
    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
      };
    });

    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser._id].taskCount += 1;
            if (task.status === "Pending") {
              userTaskMap[assignedUser._id].pendingTasks += 1;
            } else if (task.status === "In Progress") {
              userTaskMap[assignedUser._id].inProgressTasks += 1;
            } else if (task.status === "Completed") {
              userTaskMap[assignedUser._id].completedTasks += 1;
            }
          }
        });
      }
    });

    const workbook = new excelJs.Workbook();
    const workSheet = workbook.addWorksheet("User Task Report");

    workSheet.columns = [
        {header: "user Name", key: "name", width: 30},
        {header: "Email", key: "email", width: 40},
        {header: "Total Assigned Tasks", key: "taskCount", width: 20},
        {header: "Pending Tasks", key: "pendingTasks", width: 20},
        {header: "In Progress Tasks", key: "inProgressTasks", width: 20},
        {header: "Completed Tasks", key: "completedTasks", width: 20},
    ]

    Object.values(userTaskMap).forEach((user) => {
        workSheet.addRow(user);
    })

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
  
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="users_report.xlsx"`
      );
  
      return workbook.xlsx.write(res).then(() => {
        res.end();
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error exporting users ${error.message}` });
  }
};

module.exports = { exportTasksReport, exportUsersReport };
