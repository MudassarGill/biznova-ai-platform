@echo off
TITLE BizNova Launcher
color 0A

echo =========================================
echo       Starting BizNova AI Platform
echo =========================================
echo.

echo [1/2] Starting Backend (FastAPI)...
start "BizNova Backend" cmd /k "cd backend && venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --reload"

echo [2/2] Starting Frontend (React)...
start "BizNova Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Both servers are starting up in separate windows!
echo Please wait a few seconds, then open: http://localhost:5173 
echo.
pause
