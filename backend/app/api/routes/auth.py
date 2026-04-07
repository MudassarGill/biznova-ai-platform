from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import UserCreate,UserLogin,UserResponse
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register",response_model=UserResponse)
async def register(user:UserCreate,db:Session=Depends(get_db)):
    auth_service = AuthService(db)
    
    new_user=auth_service.register_user(user)
    return new_user

@router.post("/login")
async def login(user_in: UserLogin, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.login_user(user_in)
