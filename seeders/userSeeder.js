const { faker } = require("@faker-js/faker");
const { User } = require("../models");

async function userSeeder() {
  const users = [];
  for (let i = 0; i < 20; i++) {
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const newUser = {
      surname,
      name,
      email: faker.internet.email({ firstName: name, lastName: surname }),
      password: "1234",
    };

    users.push(newUser);
  }
  await User.blukCreate(users);
  console.log("User seeder has been ran");
}

module.exports = userSeeder;
