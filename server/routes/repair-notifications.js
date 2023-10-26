const express = require("express");

const {
  getRepairNotifications,
  createRepairNotification,
  deleteRepairNotificationList,
  updateRepairNotificationStatus,
  getRepairNotificationsInCurrentMonth,
} = require("../controllers/repair-notifications");

const router = express.Router();

router.get("/", getRepairNotifications);
router.post("/", createRepairNotification);
router.delete("/:ids", deleteRepairNotificationList);
router.put("/:statusId", updateRepairNotificationStatus);
router.get("/current-month", getRepairNotificationsInCurrentMonth);

module.exports = router;
