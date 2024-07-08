const { faker } = require("@faker-js/faker");
const { Admin } = require("../models");
const bcrypt = require("bcryptjs");

async function adminSeeder() {
  const admins = [];
  const root = {
    surname: "User",
    name: "Admin",
    email: "admin@project.com",
    password: await bcrypt.hash("admin", 10),
  };
  admins.push(root);
  for (let i = 0; i < 9; i++) {
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const hashedPassword = await bcrypt.hash(faker.internet.password(), 10);
    const newAdmin = {
      surname,
      name,
      email: faker.internet.email({ firstName: name, lastName: surname }),
      password: hashedPassword,
    };
    admins.push(newAdmin);
  }

  await Admin.bulkCreate(admins);
  console.log("Admin seeder has been ran.");
}

module.exports = adminSeeder;
