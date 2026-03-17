from fastapi import APIRouter, Depends
from app.services.inventory_service import InventoryService
from app.dependencies import get_inventory_service

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("/")
async def get_inventory(svc: InventoryService = Depends(get_inventory_service)):
    return await svc.get_all()
