import { absolute } from "../src/utils/lib";

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
