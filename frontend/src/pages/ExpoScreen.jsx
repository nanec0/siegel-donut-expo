import { useNavigate } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";
import { usePolling } from "../hooks/usePolling";

const COLS = [
  { status: "PENDING", label: "⏳ Waiting",      next: "IN_PREP", nextLabel: "Start",   color: "border-yellow-300 bg-yellow-50" },
  { status: "IN_PREP", label: "🔥 Preparing",    next: "READY",   nextLabel: "Ready",   color: "border-orange-300 bg-orange-50" },
  { status: "READY",   label: "✅ Ready",         next: "DONE",    nextLabel: "Deliver", color: "border-green-300 bg-green-50"  },
];

export default function ExpoScreen() {
  const navigate = useNavigate();
  const { orders, updateStatus, isLoading } = useOrders();
  usePolling();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-black text-gray-800">🍩 Expo Queue</h1>
        <div className="flex gap-2">
          <button onClick={() => navigate("/foh")} className="px-3 py-1.5 bg-white border rounded-xl text-sm font-semibold">← FOH</button>
          <button onClick={() => navigate("/kds")} className="px-3 py-1.5 bg-gray-900 text-white rounded-xl text-sm font-semibold">KDS →</button>
          <span className="text-sm text-gray-400 self-center">{isLoading ? "Syncing..." : `${orders.length} active`}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {COLS.map(({ status, label, next, nextLabel, color }) => {
          const col = orders.filter((o) => o.expo_status === status);
          return (
            <div key={status} className={`rounded-2xl border-2 ${color} p-3`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-700">{label}</span>
                <span className="text-xs bg-white rounded-full px-2 py-0.5 font-bold">{col.length}</span>
              </div>
              <div className="space-y-3 min-h-20">
                {col.length === 0 ? <p className="text-center text-gray-300 py-6 text-sm">Empty</p>
                  : col.map((o) => (
                    <div key={o.id} className="bg-white rounded-xl p-3 shadow-sm">
                      <div className="flex justify-between mb-2">
                        <span className="font-bold text-xs text-gray-500">#{String(o.id).padStart(3,"0")}</span>
                        {o.table_number && <span className="text-xs text-gray-400">Table {o.table_number}</span>}
                      </div>
                      {o.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.product_name}</span>
                          <span className="font-bold">×{item.quantity}</span>
                        </div>
                      ))}
                      {o.notes && <p className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1 mt-2">{o.notes}</p>}
                      <button onClick={() => updateStatus(o.id, next)}
                        className={`w-full mt-3 py-2 rounded-xl font-bold text-sm text-white active:scale-95 transition-all
                          ${next === "DONE" ? "bg-green-500 hover:bg-green-600" : "bg-pink-500 hover:bg-pink-600"}`}>
                        {nextLabel} →
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
