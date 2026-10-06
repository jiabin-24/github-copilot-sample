import express from "express";

import { ordersRouter } from "./routes/orders.js";

export const app = express();

app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/orders", ordersRouter);

app.use((_request, response) => {
  response.status(404).json({ error: "接口不存在" });
});
