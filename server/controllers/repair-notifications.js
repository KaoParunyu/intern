const connection = require("../db");

const getRepairNotifications = async (req, res) => {
  try {
    const [results] = await connection
      .promise()
      .execute("SELECT * FROM repair_notifications");
    res.json(results);
  } catch (error) {
    console.log(error);
  }
};

const getRepairNotificationsInCurrentMonth = async (req, res) => {
  try {
    const [results] = await connection.promise().execute(
      `SELECT repair_notifications.id AS repairNotificationId,
      users.fname AS firstName,
      users.lname AS lastName,
      repair_notifications.title AS title,
      repair_types.name AS repairTypeName,
      status.name AS statusName,
      repair_notifications.created_at AS createdAt,
      repair_notifications.modified_date AS modifiedDate 
      FROM repair_notifications 
      LEFT JOIN status ON repair_notifications.status_id = status.id 
      LEFT JOIN users ON repair_notifications.user_id = users.id 
      LEFT JOIN repair_types ON repair_notifications.repair_type_id = repair_types.id 
      WHERE MONTH(created_at) = MONTH(NOW())`
    );
    res.json(results);
  } catch (error) {
    console.log(error);
  }
};

const createRepairNotification = async (req, res) => {
  const title = req.body.title;
  const status_id = 1;
  const repair_type_id = req.body.repair_type_id;
  const image_url = req.body.image_url;

  if (!title || !repair_type_id) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields." });
  }

  const token = req.headers.authorization.split(" ").pop();
  const decoded = jwt.verify(token, secret);

  try {
    const [results] = await connection
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [decoded.email]);
    const firstUser = results[0];
    const user_id = firstUser.id;
    await connection
      .promise()
      .query(
        "INSERT INTO repair_notifications (user_id, title, status_id, created_at, modified_date, repair_type_id, image_url) VALUES (?, ?, ?, NOW(), NOW(), ?, ?)",
        [user_id, title, status_id, repair_type_id, image_url]
      );
    res.status(200).json("Values Inserted");
  } catch (error) {
    console.log(error);
    res.status(500).json("Error inserting data");
  }
};

const updateRepairNotificationStatus = async (req, res) => {
  const id = req.params.statusId;

  if (!req.body && !req.body.status_id) {
    res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
    return;
  }

  const newStatusId = req.body.status_id;

  const sql = "UPDATE repair_notifications SET status_id = ? WHERE id = ?";

  connection.query(sql, [newStatusId, id], (err, result) => {
    if (err) {
      res.status(500).json({ message: "ไม่สามารถอัปเดตข้อมูลได้" });
    } else {
      res.status(200).json({ message: "อัปเดตข้อมูลสถานะสำเร็จ" });
    }
  });
};

const deleteRepairNotificationList = async (req, res) => {
  const ids = req.params.ids;
  console.log(ids);
  const idsArray = ids.split(",");
  try {
    await connection
      .promise()
      .query("DELETE FROM repair_notifications WHERE id IN (?)", [idsArray]);
    res.status(200).json({ success: "ลบข้อมูลเรียบร้อยแล้ว" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" });
  }
};

module.exports = {
  getRepairNotifications,
  createRepairNotification,
  deleteRepairNotificationList,
  updateRepairNotificationStatus,
  getRepairNotificationsInCurrentMonth,
};
