const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const isAdmin = require("../middlewares/isAdmin");
const checkjwt = require("../middlewares/checkjwt");

router.use(checkjwt, isAdmin);

router.get("/", orderController.index);
router.get("/:id", orderController.show);
router.post("/", orderController.store);
router.patch("/:id", orderController.update);
router.delete("/:id", orderController.destroy);

module.exports = router;
