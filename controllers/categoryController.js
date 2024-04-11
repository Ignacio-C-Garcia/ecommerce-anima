const { Category } = require("../models");

const categoryController = {
  index: async (req, res) => {
    const categories = await Category.findAll();
    return res.json(categories);
  },
  show: async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    return res.json(category);
  },
  store: async (req, res) => {
    const { name } = req.body;
    await Category.create({ name });
    return res.send("Category added successfully!");
  },
  update: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);

    if (name) category.name = name;

    await Category.save();

    return res.send("Category modified successfully!");
  },
  destroy: async (req, res) =>  {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    category.destroy()
    return res.json("The category was deleted succesfully!");
  },
};

module.exports = categoryController;
