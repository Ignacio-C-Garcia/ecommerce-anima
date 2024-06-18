const express = require("express");
const router = express.Router();
const kittenController = require("../controllers/kittenController");

router.get("/", kittenController.index);

module.exports = router;
