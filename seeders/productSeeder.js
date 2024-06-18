const Product = require("../models/Product");
module.exports = async () => {
  const productList = [
    {
      pic: "coffee/cappuccino.png",
      //     alt: "Cappuccino",
      name: "Cappuccino",
      description: "Un cappuccino rico y espumoso con un toque de chocolate.",
      price: 4.99,
      stock: 99,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "latte-vanilla.png",
      //     alt: "Latte",
      name: "Latte Vainilla",
      description:
        "Un latte suave y cremoso con la mezcla perfecta de espresso y leche vaporizada, con un toque de vainilla.",
      price: 4.49,
      stock: 10,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "coffee/americano.png",
      //    alt: "Americano",
      name: "Americano",
      description: "Un espresso fuerte y audaz, con agua caliente.",
      price: 2.99,
      stock: 34,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "coffee/moccha.png",
      //   alt: "Mocha",
      name: "Mocha",
      description:
        "Un delicioso mocha con una mezcla de espresso, chocolate y leche vaporizada.",
      price: 5.49,
      stock: 62,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "coffee/latte-macchiato.png",
      //    alt: "Café Vainilla",
      name: "Latte Macchiato",
      description: "Capas claramente definidas de leche, café y espuma",
      price: 7.29,
      stock: 19,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "coffee/moccha-white.png",
      //   alt: "Café de Filtro",
      name: "Mocha Blanco",
      description: "incorpora chocolate blanco en lugar del chocolate oscuro.",
      price: 13.99,
      stock: 123,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "coffee/latte-vanilla-skinny.png",
      //   alt: "Cold Brew",
      name: "Skinny Latte",
      description: "Un café suave y refrescante",
      price: 4.79,
      stock: 28,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "coffee/flat-white.png",
      //  alt: "Cold Brew con Nubes",
      name: "Flat White",
      description: "sabor equilibrado y su textura suave y sedosa.",
      price: 5.29,
      stock: 90,
      featured: false,
      categoryId: 1,
    },
  ];

  await Product.bulkCreate(productList);
  console.log("Product seeder has been ran.");
};
