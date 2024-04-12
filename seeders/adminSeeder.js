const { faker } = require("@faker-js/faker");
const { Admin } = require("../models");

async function adminSeeder() {
  const admins = [];
  // const root = {
  //   id: 1,
  //   surname: "User",
  //   name: "Admin",
  //   email: "admin@project.com",
  //   password: "admin",
  // };
  // const existingAdmin = await Admin.findOne({ where: { name: "Admin" } });
  // if (existingAdmin) {
  //   return console.log("An admin with name 'Admin' already exists.");
  // } else {
  //   admins.push(root);
  // }
  for (let i = 0; i < 2; i++) {
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
  console.log("New admins has been added by seeder");
}

module.exports = adminSeeder;
  