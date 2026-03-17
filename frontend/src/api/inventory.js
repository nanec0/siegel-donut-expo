import client from "./client";

export const inventoryApi = {
  getAll: () => client.get("/inventory/"),
};
