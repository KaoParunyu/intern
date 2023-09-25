const express = require("express");
const cors = require("cors");
const app = express();
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const secret = "fullstack";

app.use(cors());
app.use(bodyParser.json());

const mysql = require("mysql2");
const { log } = require("console");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "project",
});

app.post("/register", function (req, res, next) {
  if (!req.body.email.endsWith("@gmail.com")) {
    return res.json({ status: "error", message: "รูปแบบอีเมลไม่ถูกต้อง" });
  }
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

//   app.post('/Problem,  function (req, res, next) {

//     const usersId = req.body.usersId;

//         connection.execute(
//             'INSERT INTO repair_notifications (title, image_url, users_id ) VALUES (?, ?, ?)',
//             [req.body.title, req.body.image_url, usersId],
//             function(err, results, fields) {
//              if(err){
//                 res.json({status: 'error', message: err})
//                 return
//              }
//                res.json({status: 'ok'})
//             }
//           );

// })

app.listen(3333, function () {
  console.log("work on 3333");
});
