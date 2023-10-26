const express = require("express");

const { login, register, verifyToken } = require("../controllers/auth");

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/verify-token", verifyToken);

module.exports = router;
