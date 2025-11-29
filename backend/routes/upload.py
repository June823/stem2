from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil

router = APIRouter()

UPLOAD_DIR = "uploads/products"

@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Create folder if not exists
        os.makedirs(UPLOAD_DIR, exist_ok=True)

        file_location = f"{UPLOAD_DIR}/{file.filename}"

        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return {"file_url": f"/{file_location}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
