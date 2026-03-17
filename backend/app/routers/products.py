from fastapi import APIRouter
from app.services.revel_client import revel

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/")
async def get_products():
    return await revel.get_products()
