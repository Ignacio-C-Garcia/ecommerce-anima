const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const isAdmin = require("../middlewares/isAdmin");
const checkjwt = require("../middlewares/checkjwt");

router.get("/", categoryController.index);
router.get("/:id", categoryController.show);

router.use(checkjwt, isAdmin);

router.post("/", categoryController.store);
router.patch("/:id", categoryController.update);
router.delete("/:id", categoryController.destroy);

module.exports = router;
