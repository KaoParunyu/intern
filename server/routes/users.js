const express = require("express");

const { getUsers, getMe } = require("../controllers/users");

const router = express.Router();

router.get("/me", getMe);
router.get("/", getUsers);

module.exports = router;
