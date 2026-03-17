from fastapi import APIRouter, HTTPException, Depends
from app.models.order import OrderCreate, OrderStatusUpdate
from app.services.order_service import OrderService
from app.services.inventory_service import InventoryService
from app.dependencies import get_order_service, get_inventory_service

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", status_code=201)
async def create_order(body: OrderCreate, svc: OrderService = Depends(get_order_service)):
    try:
        return await svc.create(body)
    except Exception as e:
        raise HTTPException(502, detail=str(e))


@router.get("/")
async def list_orders(expo_status: str | None = None, svc: OrderService = Depends(get_order_service)):
    return await svc.list_active(expo_status)


@router.get("/{order_id}")
async def get_order(order_id: int, svc: OrderService = Depends(get_order_service)):
    order = await svc.get(order_id)
    if not order:
        raise HTTPException(404, detail="Order not found")
    return order


@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: int,
    body: OrderStatusUpdate,
    order_svc: OrderService = Depends(get_order_service),
    inv_svc: InventoryService = Depends(get_inventory_service),
):
    order = await order_svc.get(order_id)
    if not order:
        raise HTTPException(404, detail="Order not found")
    updated = await order_svc.update_status(order_id, body)
    if body.expo_status == "DONE":
        await inv_svc.decrement_for_order(order)
    return updated
