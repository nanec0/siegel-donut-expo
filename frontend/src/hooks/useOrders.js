import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "../api/orders";

const ACTIVE = ["PENDING", "IN_PREP", "READY"];

export function useOrders() {
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", "active"],
    queryFn: () => ordersApi.list(),
    refetchInterval: 10_000,
    select: (data) => data.filter((o) => ACTIVE.includes(o.expo_status)),
  });

  const { mutate: createOrder } = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => qc.invalidateQueries(["orders"]),
  });

  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, expo_status }) => ordersApi.updateStatus(id, expo_status),
    onSuccess: () => qc.invalidateQueries(["orders"]),
  });

  return {
    orders,
    isLoading,
    createOrder,
    updateStatus: (id, expo_status) => updateStatus({ id, expo_status }),
  };
}
