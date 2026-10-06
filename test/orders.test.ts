import assert from "node:assert/strict";
import { describe, it } from "node:test";

import request from "supertest";

import { app } from "../src/app.js";

describe("GET /api/orders", () => {
  it("returns all orders without pagination", async () => {
    const response = await request(app).get("/api/orders").expect(200);

    assert.equal(response.body.total, 24);
    assert.equal(response.body.data.length, 24);
    assert.equal(response.body.data[0].id, "ORD-1024");
    assert.equal(response.body.page, undefined);
    assert.equal(response.body.pageSize, undefined);
  });

  it("filters orders by customer and status", async () => {
    const response = await request(app)
      .get("/api/orders")
      .query({ customerId: "CUST-002", status: "paid" })
      .expect(200);

    assert.equal(response.body.total, 1);
    assert.equal(response.body.data[0].id, "ORD-1002");
  });

  it("rejects an invalid status", async () => {
    const response = await request(app)
      .get("/api/orders")
      .query({ status: "unknown" })
      .expect(400);

    assert.match(response.body.error, /status/);
  });
});

describe("GET /api/orders/:id", () => {
  it("returns the requested order", async () => {
    const response = await request(app).get("/api/orders/ORD-1002").expect(200);

    assert.equal(response.body.data.id, "ORD-1002");
    assert.equal(response.body.data.customerId, "CUST-002");
    assert.equal(response.body.data.status, "paid");
  });

  it("returns 404 when the order does not exist", async () => {
    const response = await request(app)
      .get("/api/orders/ORD-9999")
      .expect(404);

    assert.equal(response.body.error, "订单不存在");
  });
});
