const order1FromUser1 = {
  status: "pending",
  products: '[{ "id": 1, "qty": 10, "price": 321 }]',
  address: "canelones 1234",
  userId: 1,
};

const order2FromUser1 = {
  status: "pending",
  products: '[{ "id": 2, "qty": 100, "price": 123 }]',
  address: "canelones 1234",
  userId: 1,
};

const order1FromUser2 = {
  status: "pending",
  products: '[{ "id": 1, "qty": 1, "price": 321 }]',
  address: "canelones 1234",
  userId: 2,
};

const order2FromUser2 = {
  status: "pending",
  products: '[{ "id": 3, "qty": 3, "price": 11111 }]',
  address: "canelones 1234",
  userId: 3,
};

module.exports = {
  order1FromUser1,
  order2FromUser1,
  order1FromUser2,
  order2FromUser2,
};
