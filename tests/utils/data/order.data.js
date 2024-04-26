const order1FromUser1 = {
  status: "pending",
  products: "{productId: 1, qty:100}",
  address: "canelones 1234",
  userId: 1,
};

const order2FromUser1 = {
  status: "pending",
  products: "{productId: 2, qty:100}",
  address: "canelones 1234",
  userId: 1,
};

const order1FromUser2 = {
  status: "pending",
  products: "{productId: 3, qty:100}",
  address: "canelones 1234",
  userId: 2,
};

const order2FromUser2 = {
  status: "pending",
  products: "{productId: 4, qty:100}",
  address: "canelones 1234",
  userId: 3,
};

module.exports = {
  order1FromUser1,
  order2FromUser1,
  order1FromUser2,
  order2FromUser2,
};
