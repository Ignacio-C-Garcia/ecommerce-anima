const { Kitten } = require("../models");
module.exports = async () => {
  const kittensList = [
    {
      pic: "venus.jpeg",
      name: "Venus",
      birthdate: "8 de agosto",
      age: 2,
      personality: "Curiosa y juguetona",
    },
    {
      pic: "lisa.jpg",
      name: "Lisa",
      birthdate: "27 de abril",
      age: 2,
      personality: "Curiosa y juguetona",
    },
    {
      pic: "luu.jpg",
      name: "Luu",
      birthdate: "01 de octubre",
      age: 3,
      personality: "Tímida pero cariñosa",
    },
    {
      pic: "leo.webp",
      name: "Leo",
      birthdate: "15 de diciembre",
      age: 8,
      personality: "Independiente y tranquilo",
    },
  ];

  await Kitten.bulkCreate(kittensList);
  console.log("Kitten seeder has been ran.");
};
