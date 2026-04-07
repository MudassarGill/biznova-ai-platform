

from pydantic import BaseModel,Field,EmailStr
from typing import List,Optional
from datetime import datetime


class UserBase(BaseModel):
    """Email to create user"""
    email: EmailStr = Field(...,description="Email address of the user")
    

class UserCreate(UserBase):
    """Password to create user"""
    password: str = Field(...,min_length=8,max_length=20,description="Password of the user")

class UserLogin(UserBase):

    """Password to login and also Email"""
    password: str = Field(...,min_length=8,max_length=20,description="Password of the user")
   

class UserResponse(UserBase):
    """Response model for user"""
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True
