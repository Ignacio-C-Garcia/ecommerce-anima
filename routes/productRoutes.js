const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const isAdmin = require("../middlewares/isAdmin");
const checkjwt = require("../middlewares/checkjwt");

router.get("/", productController.index);
router.get("/:id", productController.show);

router.use(checkjwt, isAdmin);
router.post("/", productController.store);
router.patch("/:id", productController.update);
router.delete("/:id", productController.destroy);

module.exports = router;
