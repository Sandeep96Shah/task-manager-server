const express = require("express");
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");
const { adminOnly, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/export/tasks", protect, adminOnly, exportTasksReport);
router.get("/export/users", protect, adminOnly, exportUsersReport);

module.exports = router;