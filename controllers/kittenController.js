const { Kitten } = require("../models");

const kittenController = {
  index: async (req, res) => {
    const kittens = await Kitten.findAll();
    return res.json({ kittens });
  },
};

module.exports = kittenController;
