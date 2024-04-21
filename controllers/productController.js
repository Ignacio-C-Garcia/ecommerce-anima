const { Product } = require("../models");
const errorFormatter = require("../utils/errorFormatter");

const productController = {
  index: async (req, res) => {
    const products = await Product.findAll();
    return res.json(products);
  },
  show: async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    return res.json({ message: "Product found", product });
  },
  store: async (req, res) => {
    const product = await Product.create(req.body);
    return res.json({ message: "Product created successfully", product });
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { name, description, pic, stock, price, featured, categoryId } =
      req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.json({ message: "Product is not available" });
    try {
      await product.update({
        name,
        description,
        pic,
        stock,
        price,
        featured,
        categoryId,
      });

      return res.json({ message: "Product updated", product });
    } catch (error) {
      return res.json({
        message: "Product not updated",
        product,
        errors: errorFormatter(error),
      });
    }
  },
  destroy: async (req, res) => {
    const { id } = req.params;
    try {
      await User.findByPk(id).destroy();
      return res.send("Producto eliminado con éxito!");
    } catch {
      res.send("No se ha podido eliminar el producto");
    }
  },
};

module.exports = productController;
