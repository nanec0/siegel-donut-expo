from fastapi import HTTPException


class RevelAPIError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=502, detail=f"Revel API error: {detail}")


class OrderNotFound(HTTPException):
    def __init__(self, order_id: int):
        super().__init__(status_code=404, detail=f"Order {order_id} not found")
