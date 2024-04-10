const { faker } = require("@faker-js/faker");
const { Admin } = require("../models");

async function adminSeeder() {
  const admins = [];
  for (let i = 0; i < 20; i++) {
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const newAdmin = {
      surname,
      name,
      email: faker.internet.email({ firstName: name, lastName: surname }),
      password: "123456",
    };
    // await Admin.create(newAdmin);
    admins.push(newAdmin);
  }
  await Admin.bulkCreate(admins);
  console.log("Admins seeder has been ran");
}

module.exports = adminSeeder;
