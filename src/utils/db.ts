const getCustomerSync = (customerId: string) => {
  console.log("Reading a customer from a database");
  return { id: customerId, points: 10 };
};

const db = { getCustomerSync };

export { db };
