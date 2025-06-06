const { Category } = require("../models");
const errorFormatter = require("../utils/errorFormatter");

const categoryController = {
  index: async (req, res) => {
    const categories = await Category.findAll();
    return res.json({ categories });
  },
  show: async (req, res) => {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category)
      return res.status(404).json({
        category,
        errors: ["Category not available"],
      });
    return res.json({ category });
  },
  store: async (req, res) => {
    try {
      const category = await Category.create(req.body);
      return res.status(201).json({ category });
    } catch (error) {
      return res
        .status(400)
        .json({ category: null, errors: errorFormatter(error) });
    }
  },
  update: async (req, res) => {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category)
      return res
        .status(404)
        .json({ category, errors: ["Category is not available"] });

    const { name } = req.body;

    try {
      if (name === undefined)
        return res.status(400).json({
          category: null,
          errors: errorFormatter({ message: "name is required" }),
        });
      await category.update({
        name,
      });

      return res.json({ category });
    } catch (error) {
      return res.status(400).json({
        category: null,
        errors: errorFormatter(error),
      });
    }
  },
  destroy: async (req, res) => {
    const { id } = req.params;
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        return res.status(404).json({
          category: null,
          errors: errorFormatter({ message: "Category not available" }),
        });
      }
      await category.destroy();
      return res.json({ category, message: "Category deleted" });
    } catch (error) {
      return res
        .status(404)
        .json({ category: null, errors: errorFormatter(error) });
    }
  },
};

module.exports = categoryController;
