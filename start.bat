@echo off
REM ============================================================
REM  Student Companion - Start Both Servers (Windows)
REM  Launches backend + frontend in separate windows
REM ============================================================

echo.
echo ==========================================
echo   Student Companion - Starting...
echo ==========================================

REM Check .env
if not exist "backend\.env" (
    echo [ERROR] backend\.env not found!
    echo   Run: copy backend\.env.example backend\.env
    echo   Then edit it with your credentials.
    pause
    exit /b 1
)

echo.
echo ^>^> Starting backend server...
start "Student Companion - Backend" cmd /k "cd backend && npm start"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

echo ^>^> Starting frontend server...
start "Student Companion - Frontend" cmd /k "cd frontend && npm start"

echo.
echo ==========================================
echo   Both servers are starting!
echo ==========================================
echo.
echo   Backend  -^> http://localhost:5001
echo   Frontend -^> http://localhost:3000
echo.
echo   Close the server windows to stop them.
echo.
pause
