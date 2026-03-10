@echo off
REM ============================================================
REM  Student Companion - Install Dependencies (Windows)
REM  Run this ONCE after cloning the repository
REM ============================================================

echo.
echo ==========================================
echo   Student Companion - Installing...
echo ==========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo   Download from: https://nodejs.org/ ^(v18 or higher^)
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do echo [OK] Node.js %%i
for /f "tokens=*" %%i in ('npm -v') do echo [OK] npm v%%i

REM Check for .env
if not exist "backend\.env" (
    echo.
    echo [WARNING] backend\.env not found!
    echo   Copy the example and fill in your values:
    echo     copy backend\.env.example backend\.env
    echo   Then edit backend\.env with your credentials.
    echo.
)

REM Install backend
echo.
echo ^>^> Installing backend dependencies...
cd backend
call npm install
cd ..

REM Install frontend
echo.
echo ^>^> Installing frontend dependencies...
cd frontend
call npm install
cd ..

REM Create upload directories
if not exist "backend\uploads\resumes" mkdir "backend\uploads\resumes"
if not exist "backend\uploads\profiles" mkdir "backend\uploads\profiles"

echo.
echo ==========================================
echo   Installation Complete!
echo ==========================================
echo.
echo   Next steps:
echo   1. Make sure backend\.env has your credentials
echo   2. Run:  start.bat
echo.
pause
