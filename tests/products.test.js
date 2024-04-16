const request = require("supertest");
require("dotenv").config();
const express = require("express");
const app = express();

app.get("/products/", (req, res) => {
  res.json([]);
});
describe("GET /api/product/get", () => {
  it("should return all products", async () => {
    const response = await request(app).get("/products/").send();
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json");
    console.log(response.text);
  });
});

