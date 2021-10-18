import { db } from "./db";

const absolute = (number: number) => {
  if (typeof number !== "number") throw new Error("Argument is not a number");
  return number >= 0 ? number : -number;
};

export function applyDiscount(order: {
  customerId: string;
  totalPrice: number;
}) {
  const customer = db.getCustomerSync(order.customerId);

  if (customer.points >= 10) order.totalPrice *= 0.9;
}

export { absolute };
