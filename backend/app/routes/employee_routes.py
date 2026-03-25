from fastapi import APIRouter, HTTPException
from app.config.db import db
from app.schemas.employee_schema import EmployeeCreate
from app.utils.serializer import employee_serializer

router = APIRouter()

employees_collection = db["employees"]

@router.post("/employees")
async def add_employee(employee: EmployeeCreate):
    try:
        # Check duplicate
        existing = await employees_collection.find_one({
            "employee_id": employee.employee_id
        })

        if existing:
            raise HTTPException(status_code=400, detail="Employee already exists")

        data = employee.model_dump()

        # ✅ CONVERT DATE
        data["joining_date"] = str(data["joining_date"])

        await employees_collection.insert_one(data)

        return {"message": "Employee added"}

    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))
@router.get("/employees")
async def get_employees():
    try:
        employees = []
        async for emp in employees_collection.find():
            employees.append(employee_serializer(emp))
        return employees
    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/employees/{employee_id}")
async def delete_employee(employee_id: str):
    result = await employees_collection.delete_one({"employee_id": employee_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Employee not found")

    return {"message": "Employee deleted successfully"}