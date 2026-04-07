from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import UserCreate,UserLogin,UserResponse
from app.services.auth_service import AuthService
import AuthService
router = APIRouter()

@router.post("/register",response_model=UserResponse)
async def register(user:UserCreate,db:Session=Depends(get_db)):
    auth_service = AuthService(db)
    
    new_user=auth_service.register_user(user_in)
    return new_user

