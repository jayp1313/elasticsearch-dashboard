const mockProducts = [
  {
    id: "prod-2003",
    name: "Noise Cancelling Earbuds - White",
    category: "electronics",
    price: 299.99,
    stock: 12,
    in_stock: true,
  },
  {
    id: "prod-3004",
    name: "The Complete Guide to Home Brewing",
    category: "books",
    price: 49.99,
    stock: 7,
    in_stock: true,
  },
];

export const fetchAllProducts = async () => {
  const cleanTimestamp = (date: Date) => date.toISOString().split(".")[0] + "Z";

  return [
    {
      ...mockProducts[0],
      created_at: cleanTimestamp(new Date()), // Current time
    },
    {
      ...mockProducts[1],
      created_at: cleanTimestamp(new Date(Date.now() - 3 * 3600 * 1000)), // 1 day ago
    },
  ];
};
