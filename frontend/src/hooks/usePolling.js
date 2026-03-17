import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function usePolling(intervalMs = 10000) {
  const qc = useQueryClient();
  useEffect(() => {
    const tick = () => {
      if (!document.hidden) qc.invalidateQueries(["orders"]);
    };
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [qc, intervalMs]);
}
