const express = require("express");
const router = express.Router();
const {
  getAdminLogs,
  getAdminLog,
  createAdminLog,
  updateAdminLog,
  deleteAdminLog,
} = require("../controllers/adminLogControllers");
const { protect, authorize } = require("../middleware/auth");

// Protect all routes and restrict access to "admin" role
router.use(protect);
router.use(authorize("admin"));

router.route("/").get(getAdminLogs).post(createAdminLog);
router
  .route("/:id")
  .get(getAdminLog)
  .put(updateAdminLog)
  .delete(deleteAdminLog);

module.exports = router;
