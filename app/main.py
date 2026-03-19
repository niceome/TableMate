from fastapi import FastAPI
from app.api.router import router

app = FastAPI(title="TableMate API")

app.include_router(router)
