from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

SECRET_KEY = "my_super_secret_biznova_key" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def verify_password(plain_password:str,hashed_password:str) -> bool:
    """Verify a plain password against a hashed password"""
    return pwd_context.verify(plain_password,hashed_password)

def hash_password(plain_password:str) -> str:
    """Hash a plain password"""
    return pwd_context.hash(plain_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt