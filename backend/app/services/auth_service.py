from sqlalchemy.orm import Session
from app.db.models.user import User
from fastapi import HTTPException,status
from app.core.security import hash_password,verify_password
from app.schemas.user import UserCreate,UserLogin,UserResponse
from app.core.config import settings
from jose import jwt
from datetime import datetime,timedelta


class AuthService:
    def __init__(self,db:Session):
        self.db = db

    def register_user(self,user_in:UserCreate) -> User:
        """
        Regsiter and signup user function
        """

        db_user=self.db.query(User).filter(User.email==user_in.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already exists"
            )
        hashed_password=hash_password(user_in.password)
        db_user=User(
            email=user_in.email,
            hashed_password=hashed_password
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
        