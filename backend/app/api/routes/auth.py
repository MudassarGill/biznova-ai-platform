from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import UserCreate, UserLogin, GoogleLoginRequest, UserResponse, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user account."""
    auth_service = AuthService(db)
    new_user = auth_service.register_user(user)
    return new_user

@router.post("/login", response_model=TokenResponse)
async def login(user_in: UserLogin, db: Session = Depends(get_db)):
    """Login with email and password. Returns JWT access token."""
    auth_service = AuthService(db)
    return auth_service.login_user(user_in)

@router.post("/google", response_model=TokenResponse)
async def google_login(request: GoogleLoginRequest, db: Session = Depends(get_db)):
    """Login with Google OAuth token. Returns JWT access token."""
    auth_service = AuthService(db)
    return auth_service.google_login(request.token)
