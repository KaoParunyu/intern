const path = require("path");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");

const app = express();

const secret = "fullstack";

app.use(fileUpload());
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "project",
});

app.post("/register", function (req, res, next) {
  if (!req.body.email.endsWith("@gmail.com")) {
    return res.json({ status: "error", message: "รูปแบบอีเมลไม่ถูกต้อง" });
  }
  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const role = req.body.role || "user";
    connection.execute(
      "INSERT INTO users (email, password, fname, lname, role) VALUES (?, ?, ?, ?, ?)",
      [req.body.email, hash, req.body.fname, req.body.lname, role],
      function (err, results, fields) {
        if (err) {
          res.json({ status: "error", message: err });
          return;
        }
        res.json({ status: "ok" });
      }
    );
  });
});

app.post("/login", function (req, res, next) {
  connection.execute(
    "SELECT * FROM users WHERE email=?",
    [req.body.email],
    function (err, users, fields) {
      if (err) {
        res.json({ status: "error", message: err });
        return;
      }
      if (users.length == 0) {
        res.json({ status: "error", message: "no user found" });
        return;
      }
      bcrypt.compare(
        req.body.password,
        users[0].password,
        function (err, isLogin) {
          if (isLogin) {
            var token = jwt.sign(
              { email: users[0].email, role: users[0].role },
              secret,
              { expiresIn: "1h" }
            );
            res.json({
              status: "ok",
              message: "login success",
              token,
              role: users[0].role,
            });
          } else {
            res.json({ status: "error", message: "login failed" });
          }
        }
      );
    }
  );
});

app.post("/authen", function (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    res.json({ status: "ok", decoded });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

app.get("/repair_notifications", (req, res) => {
  connection.execute("SELECT * FROM repair_notifications", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/users", (req, res) => {
  connection.execute("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/me", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, secret);
  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [decoded.email],
    (err, results) => {
      const firstUser = results[0];
      res.json(firstUser);
    }
  );
});

app.get("/status", (req, res) => {
  connection.execute("SELECT * FROM status", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
app.get("/repair_types", (req, res) => {
  connection.execute("SELECT * FROM repair_types", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.put("/repair_notifications/:statusId", (req, res) => {
  const id = req.params.statusId;

  // ตรวจสอบว่า req.body มีค่าและมีคีย์ status_id
  if (!req.body && !req.body.status_id) {
    res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
    return;
  }

  const newStatusId = req.body.status_id;

  const sql = "UPDATE repair_notifications SET status_id = ? WHERE id = ?";

  connection.query(sql, [newStatusId, id], (err, result) => {
    if (err) {
      console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล: ", err);
      res.status(500).json({ message: "ไม่สามารถอัปเดตข้อมูลได้" });
    } else {
      console.log(`อัปเดตข้อมูลสถานะสำเร็จสำหรับรายการที่มี ID ${id}`);
      res.status(200).json({ message: "อัปเดตข้อมูลสถานะสำเร็จ" });
    }
  });
});

app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  const idsArray = id.split(","); // แยกค่า id ออกเป็นอาร์เรย์ของ id
  connection.query(
    "DELETE FROM repair_notifications WHERE id IN (?)",
    [idsArray],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "เกิดข้อผิดพลาดในการลบข้อมูล" });
      } else {
        res.status(200).json({ success: "ลบข้อมูลเรียบร้อยแล้ว" });
      }
    }
  );
});

app.post("/postproblem", (req, res) => {
  const title = req.body.title;
  const status_id = 1;
  const repair_type_id = req.body.repair_type_id;
  const image_url = req.body.image_url;

  if (!title || !repair_type_id) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields." });
  }

  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, secret);

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [decoded.email],
    (err, results) => {
      const firstUser = results[0];
      const user_id = firstUser.id;
      connection.query(
        "INSERT INTO repair_notifications (user_id, title, status_id, created_at, modified_date, repair_type_id, image_url) VALUES (?, ?, ?, NOW(), NOW(), ?, ?)",
        [user_id, title, status_id, repair_type_id, image_url],

        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error inserting data");
          } else {
            res.send("Values Inserted");
          }
        }
      );
    }
  );
});

app.post("/images", (req, res) => {
  const { image } = req.files;

  if (!image) return res.sendStatus(400);

  const imageExtension = image.name.split(".").pop();

  const imageName = Date.now() + "." + imageExtension;

  const path = "/upload/" + imageName;

  image.mv(__dirname + path);

  res.json(path).status(200);
});

app.listen(3333, function () {
  console.log("work on 3333");
});
