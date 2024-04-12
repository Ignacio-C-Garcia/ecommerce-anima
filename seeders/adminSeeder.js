const { faker } = require("@faker-js/faker");
const { Admin } = require("../models");

async function adminSeeder() {
  const admins = [];
  const root = {
    surname: "User",
    name: "Admin",
    email: "admin@project.com",
    password: "admin",
  };
  admins.push(root);
  for (let i = 0; i < 9; i++) {
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const newAdmin = {
      surname,
      name,
      email: faker.internet.email({ firstName: name, lastName: surname }),
      password: "123456",
    };
    admins.push(newAdmin);
  }

  await Admin.bulkCreate(admins);
  console.log("New admins has been created by seeder.");
}

module.exports = adminSeeder;
