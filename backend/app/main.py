from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine, Base
from app.api.routes import auth, users
from app.core.config import settings

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BizNova AI Platform",
    description="AI-Powered Business Intelligence Platform",
    version="1.0.0",
)

# ─── CORS Middleware ───
# Allow the frontend (Vite dev server) to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Route Registration ───
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])


@app.get("/")
async def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME}
