const { Product } = require("../models");

const productController = {
  index: async (req, res) => {
    const products = await Product.findAll();
    return res.json(products);
  },
  show: async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    return res.json(product);
  },
  store: async (req, res) => {
    const { name, description, photo, stock, price, featured } = req.body;
    await Product.create({ name, description, photo, stock, price, featured });
    return res.send("El producto fue creado con éxito!");
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { name, description, photo, stock, price, featured } = req.body;

    const product = await Product.findByPk(id);

    if (name) product.name = name;
    if (description) product.description = description;
    if (photo) product.photo = photo;
    if (stock) product.stock = stock;
    if (price) product.price = price;
    if (featured) product.featured = featured;

    await product.save();

    return res.send("Producto modificado con éxito!");
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
