from bson import ObjectId

def employee_serializer(emp) -> dict:
    return {
        "id": str(emp["_id"]),
        "employee_id": emp.get("employee_id", ""),
        "full_name": emp.get("full_name", ""),
        "email": emp.get("email", ""),
        "department": emp.get("department", ""),
        "joining_date": str(emp.get("joining_date", "")),  # SAFE
    }
def attendance_serializer(att) -> dict:
    return {
        "id": str(att["_id"]),
        "employee_id": att["employee_id"],
        "date": str(att["date"]),
        "status": att["status"],
    }