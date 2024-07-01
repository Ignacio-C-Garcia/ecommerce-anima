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
      pic: "coffee/latte.png",
      //     alt: "Latte",
      name: "Latte",
      description:
        "Un latte suave y cremoso con la mezcla perfecta de espresso y leche vaporizada, con un toque de vainilla.",
      price: 4.49,
      stock: 10,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "coffee/americano.png",
      //  alt: "Americano",
      name: "Americano",
      description:
        "Los shots de espresso cubiertos con agua caliente crean una ligera capa de crema que culmina en esta taza maravillosamente rica con profundidad y matices.",
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
      name: "Mocha de Chocolate Blanco",
      description:
        "incorpora chocolate blanco en lugar del chocolate oscuro, manteniendo la misma esencia del mocha tradicional.",
      price: 13.99,
      stock: 123,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "coffee/caramel-crunch-frappuccino.png",
      //   alt: "Cold Brew",
      name: "Frappuccino de Caramelo",
      description:
        "Mezcla de salsa de caramelo oscuro, frappuccino asado, leche y hielo. ¡Cubierto con crema batida, llovizna de caramelo y azúcar caramelo!",
      price: 4.79,
      stock: 28,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "coffee/flat-white.png",
      //  alt: "Cold Brew con Nubes",
      name: "Flat White",
      description: "Sabor equilibrado y su textura suave y sedosa.",
      price: 5.29,
      stock: 90,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "coffee/caramel-macchiato.png",
      name: "Macchiato de Caramelo",
      description:
        "Una combinacion de jarabe cremoso con sabor a vainilla, leche recién vaporizada con una cobertura de espuma aterciopelada, un toque intenso de nuestro Espresso Roast, un final de llovizna de caramelo mantecoso.",
      price: 4.99,
      stock: 45,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "coffee/espresso.png",
      name: "Espresso",
      description:
        "Descubre el sabor auténtico de nuestro café espresso: intenso, suave y con una rica crema dorada. Perfecto para disfrutar solo o como base para tus bebidas favoritas.",
      price: 1.99,
      stock: 75,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "cofee/latte-matcha.png",
      name: "Latte Matcha",
      description:
        "La ceremonia del té japonesa enfatiza las virtudes de la humildad, la moderación y la sencillez, y su práctica se rige por un conjunto de acciones altamente ritualizadas. Pero esta bebida suave y cremosa a base de matcha se puede disfrutar como quieras.",
      price: 6.99,
      stock: 25,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "coffee/mocha-frappe.png",
      name: "Frappe Mocha",
      description:
        "Si aprovechar al máximo el clima soleado es una prioridad para usted en el verano, debería pensar en esta bebida deliciosa y decadente. Es dulce, cremoso y frío, tal como debería ser un buen capricho de verano. Y ofrece el rico y satisfactorio sabor del chocolate y el café.",
      price: 5.49,
      stock: 34,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "coffee/tea-english.png",
      name: "Té negro inglés",
      description:
        "Los atrevidos tés maltosos de la India se combinan con tés brillantes y sabrosos de Sri Lanka y con el suave y ahumado Keemun chino en una mezcla de hojas enteras finamente equilibrada.",
      price: 0,
      stock: 0,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "coffee/ultra-caramel.png",
      name: "Frappuccino Ultra Caramelo",
      description:
        "El Mocha Frappuccino® está envuelto entre capas de crema batida infusionada con café frío. Sobre cada capa de crema batida montada hay una porción de rica salsa de caramelo oscuro. Estas capas garantizan que cada sorbo sea tan bueno como el anterior, hasta el final.",
      price: 12.99,
      stock: 15,
      featured: false,
      categoryId: 1,
    },
    {
      pic: "bakery/tarta-de-vanilla.png",
      name: "Bizcocho de Vainilla",
      description: "Bizcocho suave y esponjoso con sabor a vainilla.",
      price: 3.5,
      stock: 20,
      featured: false,
      categoryId: 2,
    },
    {
      pic: "bakery/croissant-chocolate.png",
      name: "Croissant relleno con chispas de chocolate y avellanas.",
      description:
        "Croissant de mantequilla pura, relleno de una deliciosa crema de cacao y avellanas, rociado con chispas de chocolate y avellanas crujientes.",
      price: 2.0,
      stock: 15,
      featured: false,
      categoryId: 2,
    },
    {
      pic: "bakery/brownie-chocolate.png",
      name: "Brownie de Chocolate",
      description: "Delicioso brownie de chocolate con nueces.",
      price: 2.75,
      stock: 12,
      featured: false,
      categoryId: 2,
    },
    {
      name: "Paquete de Granos de Café Arábica",
      description: "Paquete de 500g de granos de café Arábica de alta calidad.",
      price: 15.0,
      stock: 30,
      featured: false,
      categoryId: 3,
    },
    {
      name: "Paquete de Granos de Café Robusta",
      description:
        "Paquete de 500g de granos de café Robusta con un sabor fuerte y rico.",
      price: 12.0,
      stock: 25,
      featured: false,
      categoryId: 3,
    },
    {
      name: "Paquete de Granos de Café Mezcla Especial",
      description:
        "Paquete de 500g de una mezcla especial de granos Arábica y Robusta.",
      price: 18.0,
      stock: 20,
      featured: false,
      categoryId: 3,
    },
  ];

  await Product.bulkCreate(productList);
  console.log("Product seeder has been ran.");
};
