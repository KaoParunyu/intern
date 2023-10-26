const express = require("express");

const { uploadImage } = require("../controllers/images");

const router = express.Router();

router.post("/", uploadImage);

module.exports = router;
