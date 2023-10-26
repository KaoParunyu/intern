const connection = require("../db");

const getStatuses = async (req, res) => {
  try {
    const [results] = await connection
      .promise()
      .execute("SELECT * FROM status");
    res.json(results);
  } catch (error) {
    console.log(error);
  }
};

const getDepartments = async (req, res) => {
  try {
    const [results] = await connection
      .promise()
      .execute("SELECT * FROM departments");
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
  }
};

const getRepairTypes = async (req, res) => {
  try {
    const [results] = await connection
      .promise()
      .execute("SELECT * FROM repair_types");
    res.status(200).json(results);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getStatuses,
  getDepartments,
  getRepairTypes,
};
