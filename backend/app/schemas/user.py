

from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime


class UserBase(BaseModel):
    """Email to create user"""
    email: EmailStr = Field(..., description="Email address of the user")
    

class UserCreate(UserBase):
    """Signup schema - email, password, and optional full name"""
    password: str = Field(..., min_length=8, max_length=20, description="Password of the user")
    full_name: Optional[str] = Field(None, max_length=100, description="Full name of the user")

class UserLogin(UserBase):
    """Password to login and also Email"""
    password: str = Field(..., min_length=8, max_length=20, description="Password of the user")

class GoogleLoginRequest(BaseModel):
    """Google OAuth login token"""
    token: str = Field(..., description="Google ID Token")


class UserUpdate(BaseModel):
    """Schema for updating user profile fields"""
    full_name: Optional[str] = Field(None, max_length=100, description="Full name of the user")
    email: Optional[EmailStr] = Field(None, description="New email address")


class UserResponse(UserBase):
    """Response model for user"""
    id: int
    full_name: Optional[str] = None
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Response model for login - returns JWT token and user info"""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
