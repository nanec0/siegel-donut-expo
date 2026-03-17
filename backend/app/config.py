from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    REVEL_API_URL: str = "https://placeholder.revelup.com"
    REVEL_API_KEY: str = "mock_key"
    REVEL_API_SECRET: str = "mock_secret"
    REVEL_MOCK: bool = True
    APP_ENV: str = "development"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:5173"]
    LOW_STOCK_THRESHOLD: int = 10

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache
def get_settings() -> Settings:
    return Settings()
