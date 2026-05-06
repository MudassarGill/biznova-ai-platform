@echo off
TITLE BizNova AI Platform - Launcher
color 0A

echo.
echo  ============================================
echo       🚀 BizNova AI Platform - Starting
echo  ============================================
echo.
echo  Created by: Mudassar Gill (MudssarGill)
echo.

echo [1/2] Starting Backend (FastAPI on port 8000)...
start "BizNova Backend" cmd /k "cd /d "%~dp0backend" && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 3 /nobreak > nul

echo [2/2] Starting Frontend (React on port 5173)...
start "BizNova Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo  ============================================
echo   Both servers are starting in new windows!
echo.
echo   Backend:  http://localhost:8000
echo   API Docs: http://localhost:8000/docs
echo   Frontend: http://localhost:5173
echo  ============================================
echo.
echo  Press any key to close this launcher window...
pause > nul
