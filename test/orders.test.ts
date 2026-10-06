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
