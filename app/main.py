from fastapi import FastAPI
from app.api.router import router

app = FastAPI(title="Restaurant Match API")

app.include_router(router)
