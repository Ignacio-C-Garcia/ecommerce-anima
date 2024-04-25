const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

async function createAdmins() {
  const admins = [];

  for (let i = 0; i < 4; i++) {
    const name = `admin${i + 1}`;
    const surname = `admin${i + 1}`;
    const hashedPassword = "1234";
    const newAdmin = {
      surname,
      name,
      email: faker.internet.email({ firstName: name, lastName: surname }),
      password: hashedPassword,
    };
    admins.push(newAdmin);
  }
  return admins;
}

module.exports = createAdmins;
