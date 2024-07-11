const { logger } = require("sequelize/lib/utils/logger");
const { Kitten } = require("../models");
module.exports = async () => {
  const kittensList = [
    {
      pic: "venus.jpeg",
      name: "Venus",
      birthdate: "8 de agosto",
      age: 2,
      personality: "Curiosa y cariñosa",
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
      pic: "sushi.jpg",
      name: "Sushi",
      birthdate: "08 de abril",
      age: 1,
      personality: "Jugetón",
    },
    {
      pic: "bombon.jpg",
      name: "Bombón",
      birthdate: "06 de diciembre",
      age: 1,
      personality: "cariñoso y tranquilx",
    },
    {
      pic: "manito.jpg",
      name: "Manito",
      birthdate: "06 de diciembre",
      age: 1,
      personality: "Dormilón",
    },
    {
      pic: "nala.jpg",
      name: "Nala",
      birthdate: "15 de enero",
      age: "6 meses",
      personality: "Juguetona y mimosa",
    },
    {
      pic: "Amy.jpg",
      name: "Amy",
      birthdate: "31 de diciembre",
      age: 6,
      personality: "Muerde si no le das de comer",
    },
  ];

  await Kitten.bulkCreate(kittensList);
  console.log("Kitten seeder has been ran.");
};
