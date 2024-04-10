const express = require("express");
const router = express.Router();
const { Admin } = require("../models");

router.post("/", async (req, res) => {
  const { surname, name, email, password } = req.body;
  await Admin.create({ surname, name, email, password });
  return res.send("Register added successfully!");
});

router.get("/", async (req, res) => {
  const admins = await Admin.findAll();
  return res.json(admins);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const admin = await Admin.findByPk(id);
  return res.json(admin);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { surname, name, email, password } = req.body;

  const admin = await Admin.findByPk(id);

  if (name) admin.name = name;
  if (surname) admin.surname = surname;
  if (email) admin.email = email;
  if (password) admin.password = password;

  await admin.save();

  return res.send("Admin modified successfully!");
});

// router.get("/", userController.index);


module.exports = router;
