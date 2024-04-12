const Product = require("../models/Product");
module.exports = async () => {
  const productList = [
    {
      name: "Margherita Pizza",
      description: "A classic pizza with tomato sauce and mozzarella cheese.",
      price: 12.99,
      stock: 25,
      featured: true,
      pic: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcRoeUqD7lgiXavof_C8DW2QeI-BHIzGPLKRPCWinurLGGMBT7GSml0le6bQro8yWjAa",
      categoryId: 1,
    },
    {
      name: "Pepperoni Pizza",
      description:
        "A delicious pizza with tomato sauce, mozzarella cheese, and pepperoni.",
      price: 14.99,
      stock: 18,
      featured: false,
      pic: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcRoeUqD7lgiXavof_C8DW2QeI-BHIzGPLKRPCWinurLGGMBT7GSml0le6bQro8yWjAa",
      categoryId: 1,
    },
    {
      name: "Hawaiian Pizza",
      description:
        "A sweet and savory pizza with tomato sauce, mozzarella cheese, ham, and pineapple.",
      price: 13.99,
      stock: 10,
      featured: true,
      pic: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcRoeUqD7lgiXavof_C8DW2QeI-BHIzGPLKRPCWinurLGGMBT7GSml0le6bQro8yWjAa",
      categoryId: 1,
    },
    {
      name: "Veggie Pizza",
      description:
        "A vegetarian pizza loaded with fresh vegetables like peppers, onions, mushrooms, and olives.",
      price: 15.99,
      stock: 32,
      featured: false,
      pic: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcRoeUqD7lgiXavof_C8DW2QeI-BHIzGPLKRPCWinurLGGMBT7GSml0le6bQro8yWjAa",
      categoryId: 1,
    },
    {
      name: "Meat Lovers Pizza",
      description:
        "A meaty pizza piled high with pepperoni, sausage, bacon, and ground beef.",
      price: 16.99,
      stock: 15,
      featured: true,
      pic: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcRoeUqD7lgiXavof_C8DW2QeI-BHIzGPLKRPCWinurLGGMBT7GSml0le6bQro8yWjAa",
      categoryId: 1,
    },
    {
      name: "Chocolate Chip Cookie Dough",
      description:
        "Creamy vanilla ice cream packed with chunks of chocolate chip cookie dough.",
      price: 5.99,
      stock: 40,
      featured: false,
      pic: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcRoeUqD7lgiXavof_C8DW2QeI-BHIzGPLKRPCWinurLGGMBT7GSml0le6bQro8yWjAa",
      categoryId: 2,
    },
    {
      name: "Strawberry",
      description:
        "Refreshing strawberry ice cream with real strawberry pieces.",
      price: 4.99,
      stock: 22,
      featured: true,
      pic: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcRoeUqD7lgiXavof_C8DW2QeI-BHIzGPLKRPCWinurLGGMBT7GSml0le6bQro8yWjAa",
      categoryId: 2,
    },
    {
      name: "Mint Chocolate Chip",
      description: "Cool and minty ice cream with dark chocolate chips.",
      price: 5.49,
      stock: 35,
      featured: false,
      pic: "https://t1.gstatic.com/licensed-image?q=tbn:ANd9GcRoeUqD7lgiXavof_C8DW2QeI-BHIzGPLKRPCWinurLGGMBT7GSml0le6bQro8yWjAa",
      categoryId: 2,
    },
  ];

  await Product.bulkCreate(productList);
  console.log("Product seeder has been ran.");
};
