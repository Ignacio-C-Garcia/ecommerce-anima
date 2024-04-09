const express = require("express");
const router = express.Router();
const adminRoutes = require("./adminRoutes");

router.use("/admins", adminRoutes);

module.exports = router;
