from pydantic import BaseModel, Field
from datetime import datetime


class OrderItem(BaseModel):
    product_id: int
    product_name: str
    quantity: int = Field(ge=1)
    unit_price: float = Field(ge=0)


class OrderCreate(BaseModel):
    establishment: str = "siegel-default"
    table_number: str | None = None
    server_name: str | None = None
    items: list[OrderItem]
    notes: str | None = None


class OrderStatusUpdate(BaseModel):
    expo_status: str
    revel_status: int | None = None


class OrderResponse(BaseModel):
    id: int
    revel_order_id: int
    establishment: str
    table_number: str | None
    server_name: str | None
    items: list[OrderItem]
    notes: str | None
    expo_status: str
    total: float
    created_at: str
    updated_at: str
