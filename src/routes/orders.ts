import { Router } from "express";

import { orders } from "../data/orders.js";
import { orderStatuses, type OrderStatus } from "../models/order.js";

export const ordersRouter = Router();

ordersRouter.get("/", (request, response) => {
  const { customerId, status } = request.query;

  if (typeof customerId !== "undefined" && typeof customerId !== "string") {
    response.status(400).json({ error: "customerId 必须是字符串" });
    return;
  }

  if (
    typeof status !== "undefined" &&
    (typeof status !== "string" ||
      !orderStatuses.includes(status as OrderStatus))
  ) {
    response.status(400).json({
      error: `status 必须是以下值之一: ${orderStatuses.join(", ")}`,
    });
    return;
  }

  const result = orders.filter(
    (order) =>
      (!customerId || order.customerId === customerId) &&
      (!status || order.status === status),
  );

  response.json({
    data: result,
    total: result.length,
  });
});
