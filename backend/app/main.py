from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(title="TruDrape API")
app.include_router(router)

