const { Kitten } = require("../models");
module.exports = async () => {
  const kittensList = [
    {
      pic: "venus.jpeg",
      name: "Venus",
      birthdate: "8 de agosto",
      age: 2,
      personality: "Curious and playful",
    },
    {
      pic: "lisa.jpg",
      name: "Lisa",
      birthdate: "27 de abril",
      age: 2,
      personality: "Curious and playful",
    },
    {
      pic: "whiskers.webp",
      name: "Whiskers",
      birthdate: "12 de noviembre",
      age: 7,
      personality: "Calm and affectionate",
    },
    {
      pic: "luu.jpg",
      name: "Luu",
      birthdate: "01 de octubre",
      age: 3,
      personality: "Shy but loving",
    },
    {
      pic: "luna.webp",
      name: "Luna",
      birthdate: "05 de noviembre",
      age: 4,
      personality: "Adventurous and brave",
    },
    {
      pic: "simba.webp",
      name: "Simba",
      birthdate: "09 de febrero",
      age: 6,
      personality: "Playful and energetic",
    },
    {
      pic: "bella.webp",
      name: "Bella",
      birthdate: "30 de julio",
      age: 2,
      personality: "Gentle and friendly",
    },
    {
      pic: "leo.webp",
      name: "Leo",
      birthdate: "15 de diciembre",
      age: 8,
      personality: "Independent and quiet",
    },
    {
      pic: "coco.webp",
      name: "Coco",
      birthdate: "29 de marzo",
      age: 1,
      personality: "Curious and playful",
    },
  ];

  await Kitten.bulkCreate(kittensList);
  console.log("Kitten seeder has been ran.");
};
