const express = require("express");

const {
  getStatuses,
  getDepartments,
  getRepairTypes,
} = require("../controllers/common");

const router = express.Router();

router.get("/statuses", getStatuses);
router.get("/departments", getDepartments);
router.get("/repair_types", getRepairTypes);

module.exports = router;
