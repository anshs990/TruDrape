# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import user, measurement  # Import our new routers

app = FastAPI(title="TruDrape AI Backend")

# SETUP CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# CONNECT ROUTERS
# This adds the endpoints from user.py and measurement.py to the app
app.include_router(user.router)
app.include_router(measurement.router)

# Health Check
@app.get("/")
def read_root():
    return {"status": "Online", "service": "TruDrape API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)