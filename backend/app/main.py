from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.routers import orders, inventory, products

settings = get_settings()

app = FastAPI(
    title="Donut Expo API — Siegel Companies",
    version="0.1.0",
    description="Backend MVP: FOH -> Expo -> Revel inventory sync",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orders.router,    prefix="/api/v1")
app.include_router(inventory.router, prefix="/api/v1")
app.include_router(products.router,  prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok", "env": settings.APP_ENV, "mock": settings.REVEL_MOCK}
