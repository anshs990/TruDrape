# backend/routers/measurement.py
from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import pyodbc
from database import get_conn_str

router = APIRouter()

# Data Model for Saving Measurements
class MeasurementUpdate(BaseModel):
    user_id: int
    gender: str
    height: float
    chest: float
    waist: float
    hip: float  # We use 'hip' (singular) to match the Database Column
    image_url: Optional[str] = None

# 1. SAVE to Database Endpoint
@router.post("/api/save_measurements")
def save_measurements(data: MeasurementUpdate):
    try:
        conn = pyodbc.connect(get_conn_str())
        cursor = conn.cursor()

        # Upsert Logic (Update if exists, Insert if new)
        cursor.execute("SELECT id FROM [trudrape].[user_measurement] WHERE user_id = ?", data.user_id)
        row = cursor.fetchone()

        if row:
            update_sql = """
                UPDATE [trudrape].[user_measurement]
                SET gender=?, height=?, waist=?, hip=?, chest=?, image_url=?, updated_at=GETDATE()
                WHERE user_id=?
            """
            cursor.execute(update_sql, (data.gender, data.height, data.waist, data.hip, data.chest, data.image_url, data.user_id))
            message = "Measurements Updated"
        else:
            insert_sql = """
                INSERT INTO [trudrape].[user_measurement] (user_id, gender, height, waist, hip, chest, image_url)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """
            cursor.execute(insert_sql, (data.user_id, data.gender, data.height, data.waist, data.hip, data.chest, data.image_url))
            message = "Measurements Saved"

        conn.commit()
        conn.close()
        return {"status": "success", "message": message}

    except Exception as e:
        print(f"Measurement DB Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# 2. GENERATE Avatar Endpoint (From your original file)
@router.post("/api/generate")
async def generate_avatar(
    gender: str = Form(...),
    height: float = Form(...),
    chest: float = Form(...),
    waist: float = Form(...),
    hips: float = Form(...),
    photo: Optional[UploadFile] = File(None)
):
    try:
        print(f"Generating Avatar: {gender}, {height}cm")
        if photo:
            print(f"Processing photo: {photo.filename}")

        return {
            "status": "success",
            "message": f"Avatar parameters processed for {gender}",
            "avatar_url": f"/models/{gender}.glb",
            "calculations": {
                "bmi_estimate": round(70 / ((height/100)**2), 2),
                "fit_type": "Regular"
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))