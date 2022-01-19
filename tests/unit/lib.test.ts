import { db } from "../../src/utils/db";
import { absolute, applyDiscount } from "../../src/utils/lib";

console.log(process.env.NODE_ENV);

describe("absolute", () => {
  it("should return a zero when input is zero", () => {
    const result = absolute(0);
    expect(result).toBe(0);
  });
  test("should return a positive number when input is negative number", () => {
    expect(absolute(-1)).toBe(1);
  });
  test("should return a positive number when input is positive number", () => {
    expect(absolute(1)).toBe(1);
  });
  test("should throw an exception if input is not a number", () => {
    [null, undefined, false, {}, [], () => {}, "gay"].forEach((notANumber) => {
      expect(() => {
        absolute(notANumber);
      }).toThrow();
    });
  });
});

db.getCustomerSync = (customerId: string) => {
  return { id: customerId, points: 13 };
};
describe("mockfunc", () => {
  test("should apply discount on order whose customer has a points that is more than or equal to 10", () => {
    const order = { customerId: "123", totalPrice: 10 };

    db.getCustomerSync = jest
      .fn()
      .mockReturnValue({ id: "12", points: 20 })
      .mockImplementation(() => {
        return { id: "12", points: 60 };
      });

    applyDiscount(order);
    expect(order).toHaveProperty("totalPrice", 9);
  });
});
