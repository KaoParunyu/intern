const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const connection = require("../db");
const { secret } = require("../constants/common");

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const [results] = await connection
      .promise()
      .execute("SELECT * FROM users WHERE email = ?", [email]);
    if (results.length === 0) {
      res.json({ status: "error", message: "No user found" });
      return;
    }
    const user = results[0];
    const hashedPassword = user.password;
    const isPasswordMatched = bcrypt.compareSync(password, hashedPassword);

    if (!isPasswordMatched) {
      res.json({ status: "error", message: "Login failed" });
      return;
    }

    const payload = { email: user.email, role: user.role };
    const token = jwt.sign(payload, secret, {
      expiresIn: "1h",
    });
    res.json({
      status: "ok",
      message: "Login success",
      token,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
  }
};

const register = (req, res) => {
  if (!req.body.email.endsWith("@onee.one")) {
    return res.json({
      status: "error",
      // message: "อีเมลไม่ถูกต้อง ต้องลงท้ายด้วย @onee.one เท่านั้น",
      message: "Email is invalid, must end with @onee.one",
    });
  }
  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const role = req.body.role || "user";
    connection.execute(
      "INSERT INTO users (email, password, fname, lname, role, departmentId) VALUES (?, ?, ?, ?, ?, ?)",
      [
        req.body.email,
        hash,
        req.body.fname,
        req.body.lname,
        role,
        req.body.departmentId,
      ],
      function (err, results, fields) {
        if (err?.code === "ER_DUP_ENTRY") {
          res.json({ status: "error", message: "อีเมลนี้มีผู้ใช้งานแล้ว" });
          return;
        }
        res.json({ status: "ok" });
      }
    );
  });
};

const verifyToken = (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    res.json({ status: "ok", decoded });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
};

module.exports = { login, register, verifyToken };
