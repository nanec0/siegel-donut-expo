"""
Revel Client — MOCK MODE by default.
Set REVEL_MOCK=false + real credentials in .env for production.
"""
import os
import httpx
from datetime import datetime
from app.config import get_settings

settings = get_settings()
MOCK_MODE = settings.REVEL_MOCK

_MOCK_PRODUCTS = [
    {"id": 1, "name": "Classic Glazed",     "active": True, "price": 1.50},
    {"id": 2, "name": "Strawberry Frosted", "active": True, "price": 1.75},
    {"id": 3, "name": "Chocolate Ring",     "active": True, "price": 1.75},
    {"id": 4, "name": "Blueberry Filled",   "active": True, "price": 2.00},
    {"id": 5, "name": "Maple Bacon",        "active": True, "price": 2.50},
    {"id": 6, "name": "Matcha Dream",       "active": True, "price": 2.25},
    {"id": 7, "name": "Cinnamon Sugar",     "active": True, "price": 1.50},
    {"id": 8, "name": "Red Velvet",         "active": True, "price": 2.00},
]
_MOCK_INVENTORY = {p["id"]: {"id": p["id"], "product": p["id"], "quantity": 24.0} for p in _MOCK_PRODUCTS}
_MOCK_ORDERS: dict = {}


class RevelClient:
    def __init__(self):
        if not MOCK_MODE:
            self.base_url = f"{settings.REVEL_API_URL}/resources"
            self.auth = (settings.REVEL_API_KEY, settings.REVEL_API_SECRET)
            self.headers = {"Content-Type": "application/json", "Accept": "application/json"}

    def _client(self):
        return httpx.AsyncClient(base_url=self.base_url, auth=self.auth, headers=self.headers, timeout=15.0)

    async def get_products(self, active_only=True):
        if MOCK_MODE:
            items = [p for p in _MOCK_PRODUCTS if p["active"]] if active_only else _MOCK_PRODUCTS
            return {"meta": {"total_count": len(items)}, "objects": items}
        params = {"limit": 200, "format": "json", **({"active": "true"} if active_only else {})}
        async with self._client() as c:
            r = await c.get("/Product/", params=params); r.raise_for_status(); return r.json()

    async def get_inventory(self, product_id=None):
        if MOCK_MODE:
            items = list(_MOCK_INVENTORY.values())
            if product_id: items = [i for i in items if i["product"] == product_id]
            return {"meta": {"total_count": len(items)}, "objects": items}
        params = {"limit": 200, "format": "json", **({"product": product_id} if product_id else {})}
        async with self._client() as c:
            r = await c.get("/InventoryItem/", params=params); r.raise_for_status(); return r.json()

    async def adjust_inventory(self, item_id: int, quantity_delta: float):
        if MOCK_MODE:
            if item_id in _MOCK_INVENTORY:
                _MOCK_INVENTORY[item_id]["quantity"] = max(0.0, _MOCK_INVENTORY[item_id]["quantity"] + quantity_delta)
            return _MOCK_INVENTORY.get(item_id, {})
        async with self._client() as c:
            r = await c.get(f"/InventoryItem/{item_id}/", params={"format": "json"}); r.raise_for_status()
            new_qty = max(0, float(r.json().get("quantity", 0)) + quantity_delta)
            patch = await c.patch(f"/InventoryItem/{item_id}/", json={"quantity": new_qty}); patch.raise_for_status()
            return patch.json()

    async def create_order(self, payload: dict):
        if MOCK_MODE:
            mid = len(_MOCK_ORDERS) + 1000
            order = {"id": mid, "status": 0, "created_at": datetime.utcnow().isoformat(), **payload, "_mock": True}
            _MOCK_ORDERS[mid] = order; return order
        async with self._client() as c:
            r = await c.post("/Order/", json=payload); r.raise_for_status(); return r.json()

    async def get_order(self, order_id: int):
        if MOCK_MODE: return _MOCK_ORDERS.get(order_id, {"id": order_id, "status": 0, "_mock": True})
        async with self._client() as c:
            r = await c.get(f"/Order/{order_id}/", params={"format": "json"}); r.raise_for_status(); return r.json()

    async def update_order_status(self, order_id: int, status: int):
        if MOCK_MODE:
            if order_id in _MOCK_ORDERS: _MOCK_ORDERS[order_id]["status"] = status
            return _MOCK_ORDERS.get(order_id, {"id": order_id, "status": status})
        async with self._client() as c:
            r = await c.patch(f"/Order/{order_id}/", json={"status": status}); r.raise_for_status(); return r.json()


revel = RevelClient()
