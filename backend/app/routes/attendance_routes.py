from fastapi import APIRouter, HTTPException
from app.config.db import db
from app.schemas.attendance_schema import AttendanceCreate

router = APIRouter()

attendance_collection = db["attendance"]
employees_collection = db["employees"]


@router.post("/attendance")
async def mark_attendance(attendance: AttendanceCreate):
    try:
        print("Incoming:", attendance)

        emp = await employees_collection.find_one({
            "employee_id": attendance.employee_id
        })
        
        if not emp:
            raise HTTPException(status_code=404, detail="Employee not found")
        
        existing = await attendance_collection.find_one({
            "employee_id": attendance.employee_id,
            "date": str(attendance.date)   # ✅ MATCH STRING
        })

        if existing:
            raise HTTPException(status_code=400, detail="Already marked for this date")

        data = attendance.model_dump()
        data["date"] = str(data["date"])   # ✅ FIX HERE

        await attendance_collection.insert_one(data)

        return {"message": "Attendance marked"}

    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/attendance/{employee_id}")
async def get_attendance(employee_id: str):
    try:
        records = []

        async for att in attendance_collection.find({
            "employee_id": employee_id
        }):
            records.append({
                "id": str(att["_id"]),
                "employee_id": att["employee_id"],
                "date": str(att["date"]),   # ✅ SAFE
                "status": att["status"]
            })

        return records

    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))