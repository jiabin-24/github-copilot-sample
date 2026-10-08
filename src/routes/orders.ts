import { Router } from "express";

import { orders } from "../data/orders.js";
import { orderStatuses, type OrderStatus } from "../models/order.js";

export const ordersRouter = Router();

const defaultPage = 1;
const defaultPageSize = 20;
const maximumPageSize = 100;

function parsePositiveInteger(value: unknown): number | undefined {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return undefined;
  }

  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : undefined;
}

ordersRouter.get("/", (request, response) => {
  const { customerId, status, page: pageQuery, pageSize: pageSizeQuery } =
    request.query;

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

  const page =
    typeof pageQuery === "undefined"
      ? defaultPage
      : parsePositiveInteger(pageQuery);
  if (typeof page === "undefined") {
    response.status(400).json({ error: "page 必须是正整数" });
    return;
  }

  const pageSize =
    typeof pageSizeQuery === "undefined"
      ? defaultPageSize
      : parsePositiveInteger(pageSizeQuery);
  if (typeof pageSize === "undefined" || pageSize > maximumPageSize) {
    response.status(400).json({
      error: `pageSize 必须是 1 到 ${maximumPageSize} 之间的整数`,
    });
    return;
  }

  const result = orders
    .filter(
      (order) =>
        (!customerId || order.customerId === customerId) &&
        (!status || order.status === status),
    )
    .sort(
      (left, right) =>
        right.createdAt.localeCompare(left.createdAt) ||
        right.id.localeCompare(left.id),
    );
  const offset = (page - 1) * pageSize;

  response.json({
    data: result.slice(offset, offset + pageSize),
    total: result.length,
    page,
    pageSize,
  });
});

ordersRouter.get("/:id", (request, response) => {
  const order = orders.find(({ id }) => id === request.params.id);

  if (!order) {
    response.status(404).json({ error: "订单不存在" });
    return;
  }

  response.json({ data: order });
});
