const { faker } = require("@faker-js/faker");
const { User } = require("../models");
const bcrypt = require("bcryptjs");

async function userSeeder() {
  const firstUser = {
    name: "user",
    surname: "user",
    email: "user@project.com",
    address: "michilandia",
    phone: 123456789,
    password: await bcrypt.hash("1234", 10),
  };
  const users = [];
  users.push(firstUser);
  for (let i = 0; i < 20; i++) {
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const email = faker.internet.email({ firstName: name, lastName: surname });
    const address = faker.location.streetAddress();
    const phone = faker.phone.number();
    const hashedPassword = await bcrypt.hash("1234", 10);
    const newUser = {
      name,
      surname,
      email,
      address,
      phone,
      password: hashedPassword,
    };

    users.push(newUser);
  }
  await User.bulkCreate(users);
  console.log("User seeder has been ran.");
}

module.exports = userSeeder;
