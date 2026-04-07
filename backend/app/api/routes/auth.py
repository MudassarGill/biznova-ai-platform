from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.routing import APIRouter
from app.services.auth_service import AuthService
from pydantic import BaseModel

router = APIRouter()

class User(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user: User):
    auth_service = AuthService()
    return auth_service.register(user)

@router.post("/login")
async def login(user: User):
    auth_service = AuthService()
    return auth_service.login(user)