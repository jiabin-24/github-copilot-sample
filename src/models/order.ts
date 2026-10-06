export const orderStatuses = [
  "pending",
  "paid",
  "shipped",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
}
