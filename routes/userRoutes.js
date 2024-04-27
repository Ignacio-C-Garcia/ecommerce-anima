const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const isAdmin = require("../middlewares/isAdmin");
const checkjwt = require("../middlewares/checkjwt");

router.post("/", userController.store);

router.use(checkjwt);
router.get("/:id", userController.show);
router.patch("/:id", userController.update);
router.delete("/:id", userController.destroy);

router.use(isAdmin);
router.get("/", userController.index);

module.exports = router;
