const { faker } = require("@faker-js/faker");
const users = [];
for (let i = 0; i < 5; i++) {
  const name = faker.person.firstName();
  const surname = faker.person.lastName();
  users.push({
    name,
    surname,
    email: faker.internet.email({ firstName: name, lastName: surname }),
    address: faker.location.streetAddress(),
    phone: faker.phone.number(),
    password: "1234",
  });
}

module.exports = users;
