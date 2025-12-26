# # from fastapi import FastAPI
# # from app.api.routes import router

# # app = FastAPI(title="TruDrape API")
# # app.include_router(router)

# # from fastapi import FastAPI, UploadFile, File, Form
# # import shutil
# # import os

# # app = FastAPI()

# # # 1. Endpoint to handle the measurements and photo
# # @app.post("/generate-avatar")
# # async def generate_avatar(
# #     height: float = Form(...), 
# #     weight: float = Form(...),
# #     photo: UploadFile = File(...)
# # ):
# #     # SAVE PHOTO LOCALLY
# #     photo_path = f"uploads/{photo.filename}"
# #     with open(photo_path, "wb") as buffer:
# #         shutil.copyfileobj(photo.file, buffer)

# #     # LOGIC: In a real app, you'd send this to an AI model.
# #     # For now, we return a "Success" and the URL to a base model.
# #     # You can later replace this with a logic that scales a GLB file.

# #     avatar_url = "http://localhost:5173/models/avatar.glb"

# #     return {
# #         "status": "success",
# #         "avatarUrl": avatar_url,
# #         "measurements": {"height": height, "weight": weight}
# #     }

# # from fastapi import FastAPI, UploadFile, File, Form
# # from fastapi.middleware.cors import CORSMiddleware

# # app = FastAPI()

# # # Enable CORS so your React app can talk to this API
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins=["*"],
# #     allow_methods=["*"],
# #     allow_headers=["*"],
# # )

# # @app.get("/")
# # def root():
# #     return {"message": "TruDrape Backend is Running!"}

# # @app.post("/generate")
# # async def generate(height: int = Form(...), photo: UploadFile = File(...)):
# #     return {
# #         "status": "success",
# #         "message": f"Received height {height} and file {photo.filename}"
# #     }

# from fastapi import FastAPI, UploadFile, File, Form
# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.post("/generate")
# async def generate(
#     height: int = Form(...), 
#     photo: UploadFile = File(...)
# ):
#     # This prints in your Python Terminal
#     print(f"Received Height: {height}")
#     print(f"Received Photo: {photo.filename}")
    
#     return {
#         "status": "success",
#         "message": f"Avatar scaling to {height}cm with photo {photo.filename}",
#         "avatar_url": "/models/avatar.glb"
#     }


from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn
import os

app = FastAPI(title="TruDrape AI Backend")

# 1. SETUP CORS (Cross-Origin Resource Sharing)
# This allows your React Frontend (on port 5173) to talk to this Python API (on port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, you would put your Azure URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. DEFINE DATA MODELS
# This defines what a "User Measurement" looks like
class MeasurementUpdate(BaseModel):
    gender: str
    height: float
    chest: float
    waist: float
    hips: float

# 3. API ENDPOINTS

# Health Check (To see if backend is running)
@app.get("/")
def read_root():
    return {"status": "Online", "service": "TruDrape API"}

# Endpoint to Save/Process Measurements
@app.post("/api/measurements")
async def save_measurements(data: MeasurementUpdate):
    print(f"Received Measurements for {data.gender}:")
    print(f"H: {data.height}, C: {data.chest}, W: {data.waist}, H: {data.hips}")
    
    # Here you would typically save to a database like Azure SQL or CosmosDB
    return {
        "message": "Measurements saved successfully",
        "received_data": data
    }

# Endpoint for "Generate Avatar" (Handling both Form Data and potential Photos)
@app.post("/api/generate")
async def generate_avatar(
    gender: str = Form(...),
    height: float = Form(...),
    chest: float = Form(...),
    waist: float = Form(...),
    hips: float = Form(...),
    photo: Optional[UploadFile] = File(None) # Optional if you decide to use it
):
    try:
        # 1. Log the incoming data
        print(f"Generating Avatar: {gender}, {height}cm")
        
        if photo:
            print(f"Processing photo: {photo.filename}")
            # Logic to save photo locally or to Azure Blob Storage would go here
            
        # 2. Return the result
        # In the future, this would return a URL to a specific generated 3D file
        return {
            "status": "success",
            "message": f"Avatar parameters processed for {gender}",
            "avatar_url": f"/models/{gender}.glb", # Redirects to your base mesh
            "calculations": {
                "bmi_estimate": round(70 / ((height/100)**2), 2), # Example calc
                "fit_type": "Regular"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 4. RUNNER
if __name__ == "__main__":
    # Run the server on localhost port 8000
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)