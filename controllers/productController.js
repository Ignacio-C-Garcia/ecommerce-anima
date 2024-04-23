const { Product } = require("../models");
const errorFormatter = require("../utils/errorFormatter");

const productController = {
  index: async (req, res) => {
    const products = await Product.findAll();
    return res.json({ products });
  },
  show: async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product)
      return res.json({
        product,
        errors: ["Product not available"],
      });
    return res.json({ product });
  },
  store: async (req, res) => {
    try {
      const product = await Product.create(req.body);
      return res.json({ product });
    } catch (error) {
      return res.json({ product: null, errors: errorFormatter(error) });
    }
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { name, description, pic, stock, price, featured, categoryId } =
      req.body;
    try {
      const product = await Product.findByPk(id);
      if (!product) throw { message: "Product is not available" };

      await product.update({
        name,
        description,
        pic,
        stock,
        price,
        featured,
        categoryId,
      });

      return res.json({ product });
    } catch (error) {
      return res.json({
        product: null,
        errors: errorFormatter(error),
      });
    }
  },
  destroy: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
      product.destroy();
      return res.send({ product, message: "Product deleted" });
    } catch (error) {
      res.json({ product: null, errors: errorFormatter(error) });
    }
  },
};

module.exports = productController;
