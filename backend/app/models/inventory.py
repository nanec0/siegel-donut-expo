from pydantic import BaseModel


class InventoryItem(BaseModel):
    id: int
    product: int
    quantity: float
