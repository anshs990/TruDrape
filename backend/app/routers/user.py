# backend/routers/user.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import pyodbc
from database import get_conn_str

router = APIRouter()


# Data Model
class RegisterRequest(BaseModel):
    email: str
    password: Optional[str] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    google_id: Optional[str] = None


@router.post("/api/register_user")
def register_or_login(data: RegisterRequest):
    try:
        conn = pyodbc.connect(get_conn_str())
        cursor = conn.cursor()

        # 1. Check if User Exists (Login Logic)
        cursor.execute("SELECT id FROM [trudrape].[user] WHERE email_id = ?", data.email)
        row = cursor.fetchone()

        if row:
            # --- USER EXISTS (LOGIN SUCCESS) ---
            user_id = row[0]
            conn.close()
            return {"status": "success",
                    "message": "Login Successful",
                    "user_id": user_id,
                    }

        else:
            # --- USER NEW (REGISTRATION LOGIC) ---

            # A. Prepare Data for New User
            first_name = data.firstName
            last_name = data.lastName

            # B. Handle Google Login Edge Cases
            if data.google_id:
                # If Google didn't provide a Last Name, use empty string (don't fail!)
                if not last_name:
                    last_name = ""
                # If Google didn't provide a First Name, use the part of email before '@'
                if not first_name:
                    first_name = data.email.split("@")[0]

            # C. Safety Check for Standard Registration (Email/Pass)
            # Only block if it's NOT a Google login and names are missing
            if not data.google_id and (not first_name or not last_name):
                conn.close()
                # This error correctly shows when someone tries to "Login" with a wrong email
                raise HTTPException(status_code=400, detail="User not found. Please Sign Up first.")

            # D. Insert New User
            insert_sql = """
                         INSERT INTO [trudrape].[user] (first_name, last_name, email_id, google_id, password)
                             OUTPUT INSERTED.id
                         VALUES (?, ?, ?, ?, ?) \
                         """
            cursor.execute(insert_sql, (first_name, last_name, data.email, data.google_id, data.password))
            user_id = cursor.fetchone()[0]
            conn.commit()
            conn.close()

            return {"status": "success",
                    "message": "Account Created Successfully",
                    "user_id": user_id,
                    }

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"User DB Error: {e}")
        # Return 500 but include the specific error for debugging
        raise HTTPException(status_code=500, detail=str(e))
    
@router.post("/api/check_measurements")
def check_measurements(data:dict):
    try:
        conn = pyodbc.connect(get_conn_str())
        cursor = conn.cursor()

        user_id = data.get("user_id")

        if not user_id:
            raise HTTPException(status_code=400, detail="user_id is required")

        query = """
            SELECT *
            FROM [trudrape].[user_measurement]
            WHERE user_id = ?
        """
        cursor.execute(query, user_id)
        row = cursor.fetchone()

        if not row:
            conn.close()
            return {
                "status": "Data doesn't exists",
                "measurement_exists": False,
                "data": None
            }

        columns = [column[0] for column in cursor.description]
        measurement_data = dict(zip(columns, row))

        conn.close()

        return {
            "status": "success",
            "measurement_exists": True,
            "data": measurement_data
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Measurement Fetch Error: {e}")
        raise HTTPException(status_code=500, detail="Database error")