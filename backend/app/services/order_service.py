from datetime import datetime
from app.services.revel_client import revel
from app.models.order import OrderCreate, OrderStatusUpdate

_ORDERS: dict = {}
_COUNTER = [1]


class OrderService:
    async def create(self, body: OrderCreate) -> dict:
        revel_resp = await revel.create_order({
            "establishment": body.establishment,
            "items": [i.model_dump() for i in body.items],
            "notes": body.notes,
        })
        order_id = _COUNTER[0]; _COUNTER[0] += 1
        order = {
            "id": order_id,
            "revel_order_id": revel_resp.get("id", 0),
            "establishment": body.establishment,
            "table_number": body.table_number,
            "server_name": body.server_name,
            "items": [i.model_dump() for i in body.items],
            "notes": body.notes,
            "expo_status": "PENDING",
            "total": sum(i.unit_price * i.quantity for i in body.items),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        _ORDERS[order_id] = order
        return order

    async def list_active(self, expo_status: str | None = None) -> list:
        orders = list(_ORDERS.values())
        if expo_status:
            orders = [o for o in orders if o["expo_status"] == expo_status]
        return orders

    async def get(self, order_id: int) -> dict | None:
        return _ORDERS.get(order_id)

    async def update_status(self, order_id: int, body: OrderStatusUpdate) -> dict:
        order = _ORDERS[order_id]
        order["expo_status"] = body.expo_status
        order["updated_at"] = datetime.utcnow().isoformat()
        if body.revel_status is not None:
            await revel.update_order_status(order["revel_order_id"], body.revel_status)
        return order
