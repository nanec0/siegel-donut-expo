from app.services.revel_client import revel


class InventoryService:
    async def get_all(self) -> dict:
        return await revel.get_inventory()

    async def decrement_for_order(self, order: dict) -> None:
        """Decrement stock for every item in a completed order."""
        for item in order.get("items", []):
            await revel.adjust_inventory(item["product_id"], -item["quantity"])
