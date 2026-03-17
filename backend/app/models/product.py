from pydantic import BaseModel


class Product(BaseModel):
    id: int
    name: str
    active: bool = True
    price: float = 0.0
