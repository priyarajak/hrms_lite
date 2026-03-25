from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import employee_routes, attendance_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # IMPORTANT
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee_routes.router)
app.include_router(attendance_routes.router)