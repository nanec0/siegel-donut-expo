import client from "./client";

export const ordersApi = {
  create:       (payload)            => client.post("/orders/", payload),
  list:         (expoStatus)         => client.get("/orders/", { params: expoStatus ? { expo_status: expoStatus } : undefined }),
  get:          (id)                 => client.get(`/orders/${id}`),
  updateStatus: (id, expoStatus, revelStatus = null) =>
    client.patch(`/orders/${id}/status`, { expo_status: expoStatus, revel_status: revelStatus }),
};
