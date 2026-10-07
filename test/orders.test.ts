import assert from "node:assert/strict";
import { describe, it } from "node:test";

import request from "supertest";

import { app } from "../src/app.js";

describe("GET /api/orders", () => {
  it("uses the default pagination when parameters are omitted", async () => {
    const response = await request(app).get("/api/orders").expect(200);

    assert.equal(response.body.total, 24);
    assert.equal(response.body.data.length, 20);
    assert.equal(response.body.data[0].id, "ORD-1024");
    assert.equal(response.body.data[19].id, "ORD-1005");
    assert.equal(response.body.page, 1);
    assert.equal(response.body.pageSize, 20);
  });

  it("returns a stable requested page without duplicate orders", async () => {
    const firstPage = await request(app)
      .get("/api/orders")
      .query({ page: 1, pageSize: 10 })
      .expect(200);
    const secondPage = await request(app)
      .get("/api/orders")
      .query({ page: 2, pageSize: 10 })
      .expect(200);

    assert.equal(firstPage.body.data.length, 10);
    assert.equal(secondPage.body.data.length, 10);
    assert.equal(firstPage.body.data[9].id, "ORD-1015");
    assert.equal(secondPage.body.data[0].id, "ORD-1014");
    assert.equal(
      firstPage.body.data.some((firstPageOrder: { id: string }) =>
        secondPage.body.data.some(
          (secondPageOrder: { id: string }) =>
            secondPageOrder.id === firstPageOrder.id,
        ),
      ),
      false,
    );
  });

  it("filters orders by customer and status", async () => {
    const response = await request(app)
      .get("/api/orders")
      .query({ customerId: "CUST-002", status: "paid" })
      .expect(200);

    assert.equal(response.body.total, 1);
    assert.equal(response.body.data[0].id, "ORD-1002");
    assert.equal(response.body.page, 1);
    assert.equal(response.body.pageSize, 20);
  });

  it("rejects an invalid status", async () => {
    const response = await request(app)
      .get("/api/orders")
      .query({ status: "unknown" })
      .expect(400);

    assert.match(response.body.error, /status/);
  });

  it("rejects invalid page values", async () => {
    for (const page of ["0", "-1", "1.5", "invalid"]) {
      const response = await request(app)
        .get("/api/orders")
        .query({ page })
        .expect(400);

      assert.match(response.body.error, /page/);
    }
  });

  it("rejects invalid pageSize values", async () => {
    for (const pageSize of ["0", "-1", "1.5", "101", "invalid"]) {
      const response = await request(app)
        .get("/api/orders")
        .query({ pageSize })
        .expect(400);

      assert.match(response.body.error, /pageSize/);
    }
  });

  it("returns an empty list for a page beyond the available results", async () => {
    const response = await request(app)
      .get("/api/orders")
      .query({ page: 4, pageSize: 10 })
      .expect(200);

    assert.equal(response.body.total, 24);
    assert.deepEqual(response.body.data, []);
    assert.equal(response.body.page, 4);
    assert.equal(response.body.pageSize, 10);
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
