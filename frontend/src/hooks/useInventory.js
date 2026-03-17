import { useQuery } from "@tanstack/react-query";
import { inventoryApi } from "../api/inventory";

export function useInventory() {
  const { data, isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: inventoryApi.getAll,
    refetchInterval: 30_000,
  });

  const items = data?.objects || [];
  const lowStockItems = items.filter((i) => i.quantity <= 10);

  return { items, lowStockItems, isLoading };
}
