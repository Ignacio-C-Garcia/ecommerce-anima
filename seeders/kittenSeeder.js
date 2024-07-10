const { Kitten } = require("../models");
module.exports = async () => {
  const kittensList = [
    {
      pic: "venus.jpeg",
      name: "Venus",
      birthdate: "08/08",
      age: 2,
      personality: "Curiosa y juguetona",
    },
    {
      pic: "lisa.jpg",
      name: "Lisa",
      birthdate: "27/04",
      age: 2,
      personality: "Curiosa y juguetona",
    },
    {
      pic: "luu.jpg",
      name: "Luu",
      birthdate: "01/10",
      age: 3,
      personality: "Tímida pero cariñosa",
    },
    {
      pic: "sushi.jpg",
      name: "Sushi",
      birthdate: "08/04",
      age: 1,
      personality: "Jugetón",
    },
    {
      pic: "bombon.jpg",
      name: "Bombón",
      birthdate: "17/12",
      age: 1,
      personality: "cariñoso y tranquilx",
    },
    {
      pic: "manito.jpg",
      name: "Manito",
      birthdate: "06/12",
      age: 1,
      personality: "Dormilón",
    },
    {
      pic: "nala.jpg",
      name: "Nala",
      birthdate: "15/01",
      age: 1,
      personality: "Juguetona y mimosa",
    },
    {
      pic: "Amy.jpg",
      name: "Amy",
      birthdate: "06/07",
      age: 6,
      personality: "Pasivo agresiva",
    },
  ];

  await Kitten.bulkCreate(kittensList);
  console.log("Kitten seeder has been ran.");
};
