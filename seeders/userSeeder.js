const { faker } = require("@faker-js/faker");
const { User } = require("../models");

async function userSeeder() {
  const users = [];
  for (let i = 0; i < 20; i++) {
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const email = faker.internet.email({ firstName: name, lastName: surname });
    const address = faker.location.streetAddress();
    const phoneNumber = faker.phone.number();
    const newUser = {
      name,
      surname,
      email,
      address,
      phoneNumber,
      password: "1234",
    };

    users.push(newUser);
  }
  await User.bulkCreate(users);
  console.log("User seeder has been ran.");
}

module.exports = userSeeder;
