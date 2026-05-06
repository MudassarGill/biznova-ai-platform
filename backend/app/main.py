"""
BizNova AI Platform — Application Entry Point
================================================

This is the main FastAPI application factory module. It creates and configures
the FastAPI application instance, sets up middleware, registers all API route
modules, and initializes the database schema.

Application Startup Flow
--------------------------
1. Import all SQLAlchemy models so they register with ``Base.metadata``
2. Call ``Base.metadata.create_all()`` to create any missing database tables
3. Create the FastAPI app instance with metadata (title, description, version)
4. Add CORS middleware to allow the React frontend to communicate
5. Register all route modules under their respective URL prefixes

Route Modules
-------------
- ``/api/auth``     — Authentication (register, login, Google OAuth)
- ``/api/users``    — User profile management (get/update profile)
- ``/api/ideas``    — AI-powered business idea generation
- ``/api/analysis`` — Market analysis, forecasting, business plan generation
- ``/api/chat``     — AI chat assistant (streaming, LTM, CRAG document Q&A)

Database
--------
Uses SQLite by default (``biznova.db`` in the working directory). The
database is automatically created on first run via ``create_all()``.

Models registered:
- ``User`` — Authentication and user profiles
- ``ChatSession`` — Conversation threads (LTM)
- ``ChatMessage`` — Individual messages within sessions (LTM)
- ``Document`` — Uploaded business documents (CRAG)
- ``DocumentChunk`` — Text chunks from documents (CRAG)

CORS Configuration
------------------
CORS origins are configured via the ``CORS_ORIGINS`` environment variable.
Default: ``http://localhost:5173`` (Vite dev server).

Usage
-----
Start the server::

    uvicorn app.main:app --reload

The API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.session import engine, Base
from app.core.config import settings

# ─── Import all models so SQLAlchemy registers them with Base.metadata ───
# Without these imports, create_all() won't know about the tables and
# they won't be created in the database.
from app.db.models.user import User           # noqa: F401
from app.db.models.chat import ChatSession, ChatMessage  # noqa: F401
from app.db.models.document import Document, DocumentChunk  # noqa: F401

# ─── Import route modules ───
from app.api.routes import auth, users, ideas, analysis, chat

# Create all database tables (no-op if they already exist)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BizNova AI Platform",
    description="AI-Powered Business Intelligence Platform with Streaming Chat, LTM, and CRAG",
    version="2.0.0",
)

# ─── CORS Middleware ───
# Allow the frontend (Vite dev server) to communicate with the backend.
# This is required because the frontend runs on a different port (5173)
# than the backend (8000).
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
app.include_router(ideas.router, prefix="/api/ideas", tags=["Business Ideas"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Market Analysis"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI Chat"])


@app.get("/")
async def health_check():
    """
    Health check endpoint.

    Used by monitoring tools and the frontend to verify that the backend
    is running and responsive. Returns the project name and status.

    Returns:
        dict: ``{"status": "ok", "project": "BizNova AI Platform"}``
    """
    return {"status": "ok", "project": settings.PROJECT_NAME}
