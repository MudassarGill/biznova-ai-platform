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

    def google_login(self, token: str):
        """
        Verify Google token, create user if not exists, and return JWT.
        """
        import uuid
        from fastapi import HTTPException

        # For local testing without a real Google Client ID, we construct a fake JWT on frontend.
        if len(token.split('.')) == 3:
            try:
                import jwt as pyjwt
                idinfo = pyjwt.decode(token, options={"verify_signature": False})
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Invalid mock token: {str(e)}")
        else:
            # It's a real Google access token from useGoogleLogin
            import requests
            resp = requests.get("https://www.googleapis.com/oauth2/v3/userinfo", headers={"Authorization": f"Bearer {token}"})
            if not resp.ok:
                raise HTTPException(status_code=400, detail="Invalid Google access token")
            idinfo = resp.json()

        email = idinfo.get("email")
        if not email:
            raise HTTPException(status_code=400, detail="Google token does not contain email")

        full_name = idinfo.get("name", "")

        user = self.db.query(User).filter(User.email == email).first()
        if not user:
            # Create user with random password since they use Google
            hashed_password = hash_password(str(uuid.uuid4()))
            user = User(
                email=email,
                hashed_password=hashed_password,
                full_name=full_name,
            )
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)

        access_token = create_access_token(data={"sub": user.email})
        
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "user": user
        }