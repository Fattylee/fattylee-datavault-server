const absolute = (number: number) => {
  if (typeof number !== "number") throw new Error("Argument is not a number");
  return number >= 0 ? number : -number;
};

export { absolute };
