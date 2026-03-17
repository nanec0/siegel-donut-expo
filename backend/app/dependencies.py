from app.services.order_service import OrderService
from app.services.inventory_service import InventoryService


def get_order_service() -> OrderService:
    return OrderService()


def get_inventory_service() -> InventoryService:
    return InventoryService()
