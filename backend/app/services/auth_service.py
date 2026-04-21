from sqlalchemy.orm import Session
from app.db.models.user import User
from fastapi import HTTPException, status
from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.user import UserCreate, UserLogin


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register_user(self, user_in: UserCreate) -> User:
        """
        Register and signup user function.
        Checks for existing email, hashes password, saves to DB.
        """
        db_user = self.db.query(User).filter(User.email == user_in.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already exists"
            )
        hashed_password = hash_password(user_in.password)
        db_user = User(
            email=user_in.email,
            hashed_password=hashed_password,
            full_name=user_in.full_name or "",
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def login_user(self, user_in: UserLogin):
        """
        Login user function.
        Verifies email + password, returns JWT token + user info.
        """
        user = self.db.query(User).filter(User.email == user_in.email).first()
        if not user:
            raise HTTPException(status_code=401, detail="Email or Password incorrect!")
            
        if not verify_password(user_in.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Email or Password incorrect!")
            
        access_token = create_access_token(data={"sub": user.email})
        
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user": user
        }