from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def root():
    return {"status": "TruDrape backend running"}

