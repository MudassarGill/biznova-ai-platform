from fastapi import FastAPI
from app.db.session import engine,Base
from app.api.routes import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title='BizNova AI Platform',description='AI Platform for BizNova',version='1.0.0')

app.include_router(auth.router,prefix="/api/auth",tags=["auth"])


@app.get("/")
async def health_check():
    return {"status":"ok"}
