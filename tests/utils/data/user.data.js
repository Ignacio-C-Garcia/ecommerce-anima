const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");
async function createUsers() {
  const users = [];
  for (let i = 0; i < 5; i++) {
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const hashedPassword = await bcrypt.hash("userPassword", 8);
    users.push({
      name,
      surname,
      email: faker.internet.email({ firstName: name, lastName: surname }),
      address: faker.location.streetAddress(),
      phone: faker.phone.number(),
      password: hashedPassword,
    });
  }
  return users;
}
module.exports = createUsers;
