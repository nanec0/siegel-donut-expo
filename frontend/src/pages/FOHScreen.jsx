import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";

const DONUTS = [
  { id: 1, name: "Classic Glazed",     type: "Original",  color: "bg-yellow-100", stock: 24 },
  { id: 2, name: "Strawberry Frosted", type: "Frosted",   color: "bg-pink-200",   stock: 18 },
  { id: 3, name: "Chocolate Ring",     type: "Chocolate", color: "bg-amber-800",  stock: 12 },
  { id: 4, name: "Blueberry Filled",   type: "Filled",    color: "bg-indigo-300", stock: 8  },
  { id: 5, name: "Maple Bacon",        type: "Specialty", color: "bg-orange-300", stock: 6  },
  { id: 6, name: "Matcha Dream",       type: "Specialty", color: "bg-green-300",  stock: 15 },
  { id: 7, name: "Cinnamon Sugar",     type: "Original",  color: "bg-amber-200",  stock: 20 },
  { id: 8, name: "Red Velvet",         type: "Frosted",   color: "bg-red-400",    stock: 3  },
];

export default function FOHScreen() {
  const navigate = useNavigate();
  const { createOrder } = useOrders();
  const [cart, setCart]     = useState([]);
  const [table, setTable]   = useState("");
  const [notes, setNotes]   = useState("");

  const addToCart = (d) =>
    setCart((c) => {
      const ex = c.find((i) => i.id === d.id);
      return ex ? c.map((i) => (i.id === d.id ? { ...i, qty: i.qty + 1 } : i)) : [...c, { ...d, qty: 1 }];
    });

  const submit = () => {
    if (!cart.length) return;
    createOrder({
      establishment: "siegel-default",
      table_number: table || null,
      items: cart.map((i) => ({ product_id: i.id, product_name: i.name, quantity: i.qty, unit_price: 1.75 })),
      notes: notes || null,
    });
    setCart([]); setTable(""); setNotes("");
    navigate("/expo");
  };

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-gray-900">🍩 FOH — New Order</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate("/expo")} className="px-4 py-2 bg-white border rounded-xl text-sm font-semibold">Expo →</button>
          <button onClick={() => navigate("/kds")}  className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold">KDS →</button>
        </div>
      </div>
      <div className="flex gap-6">
        <div className="flex-1 grid grid-cols-4 gap-3">
          {DONUTS.map((d) => (
            <button key={d.id} onClick={() => addToCart(d)}
              disabled={d.stock === 0}
              className="bg-white border-2 border-pink-200 p-4 rounded-2xl flex flex-col items-center gap-2 hover:border-pink-400 active:scale-95 transition-transform disabled:opacity-40">
              <div className={`w-14 h-14 rounded-full ${d.color} flex items-center justify-center text-2xl`}>🍩</div>
              <span className="font-bold text-sm text-gray-800 text-center">{d.name}</span>
              <span className="text-xs text-pink-500">{d.type}</span>
              <span className={`text-xs font-bold ${d.stock <= 5 ? "text-red-500" : "text-gray-400"}`}>{d.stock} left</span>
            </button>
          ))}
        </div>
        <div className="w-72 bg-white rounded-3xl shadow p-5 sticky top-6 h-fit">
          <h2 className="font-bold text-gray-700 mb-4">Order Details</h2>
          <input value={table} onChange={(e) => setTable(e.target.value)} placeholder="Table # (optional)"
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 outline-none focus:border-pink-400" />
          <div className="min-h-24 mb-3 space-y-2">
            {cart.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-6">Tap donuts to add</p>
            ) : cart.map((i) => (
              <div key={i.id} className="flex justify-between items-center bg-pink-50 rounded-xl px-3 py-2">
                <span className="text-sm font-semibold text-gray-800">{i.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-800">×{i.qty}</span>
                  <button onClick={() => setCart((c) => c.filter((x) => x.id !== i.id))} className="text-gray-400 hover:text-red-500">✕</button>
                </div>
              </div>
            ))}
          </div>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes..." rows={2}
            className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm mb-3 outline-none focus:border-pink-400 resize-none" />
          <button onClick={submit} disabled={!cart.length}
            className="w-full py-4 bg-pink-500 hover:bg-pink-600 text-white font-black text-lg rounded-2xl disabled:opacity-40 active:scale-95 transition-all">
            SEND TO EXPO 🍩
          </button>
        </div>
      </div>
    </div>
  );
}
