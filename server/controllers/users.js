const jwt = require("jsonwebtoken");

const connection = require("../db");
const { secret } = require("../constants/common");

const getUsers = async (req, res) => {
  try {
    const [results] = await connection.promise().execute("SELECT * FROM users");
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
  }
};

const getMe = async (req, res) => {
  const token = req.headers.authorization.split(" ").pop();
  const decoded = jwt.verify(token, secret);
  try {
    const [results] = await connection
      .promise()
      .query(
        "SELECT users.id AS id, users.fname AS fname, users.lname AS lname, users.role AS role, departments.description AS department FROM users LEFT JOIN departments ON departments.id = users.departmentId WHERE email = ?",
        [decoded.email]
      );
    const user = results[0];
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getMe,
  getUsers,
};
