@echo off
REM Sentinel AI Local Development Script for Windows
REM This script sets up and runs both backend and frontend services locally

setlocal enabledelayedexpansion

REM Function to print colored output (Windows doesn't support colors easily, so we'll use plain text)
echo ==================================================
echo     Sentinel AI Local Development Environment
echo ==================================================
echo.

REM Parse command line arguments
set "COMMAND=%~1"
if "%COMMAND%"=="" set "COMMAND=start"

if "%COMMAND%"=="start" goto :start
if "%COMMAND%"=="backend" goto :backend
if "%COMMAND%"=="frontend" goto :frontend
if "%COMMAND%"=="setup" goto :setup
if "%COMMAND%"=="clean" goto :clean
if "%COMMAND%"=="help" goto :help
if "%COMMAND%"=="-h" goto :help
if "%COMMAND%"=="--help" goto :help

echo [ERROR] Unknown option: %COMMAND%
goto :help

:start
echo [INFO] Starting both backend and frontend servers...
call :check_prerequisites
call :setup_backend
call :setup_frontend
call :start_backend
call :start_frontend

echo.
echo [SUCCESS] Sentinel AI is now running locally!
echo.
echo Frontend Application: http://localhost:3000
echo Backend API: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop all servers
pause
goto :cleanup

:backend
echo [INFO] Starting backend server only...
call :check_prerequisites
call :setup_backend
call :start_backend_only

echo.
echo [SUCCESS] Backend server is running!
echo Backend API: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
pause
goto :cleanup

:frontend
echo [INFO] Starting frontend server only...
call :check_prerequisites
call :setup_frontend
call :start_frontend_only

echo.
echo [SUCCESS] Frontend server is running!
echo Frontend Application: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
pause
goto :cleanup

:setup
echo [INFO] Setting up dependencies...
call :check_prerequisites
call :setup_backend
call :setup_frontend
echo [SUCCESS] Setup completed! Run 'run_local.bat start' to start the servers.
goto :end

:clean
echo [INFO] Cleaning up running processes...
call :cleanup
goto :end

:help
echo Usage: %~nx0 [OPTION]
echo.
echo Options:
echo   start     Start both backend and frontend servers (default)
echo   backend   Start only the backend server
echo   frontend  Start only the frontend server
echo   setup     Setup dependencies for both backend and frontend
echo   clean     Clean up running processes
echo   help      Show this help message
echo.
echo Examples:
echo   %~nx0                # Start both servers
echo   %~nx0 start          # Start both servers
echo   %~nx0 backend        # Start only backend
echo   %~nx0 frontend       # Start only frontend
echo   %~nx0 setup          # Setup dependencies only
goto :end

:check_prerequisites
echo [INFO] Checking prerequisites...

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is required but not installed.
    exit /b 1
)
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo [INFO] Found Python %PYTHON_VERSION%

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is required but not installed.
    exit /b 1
)
for /f %%i in ('node --version') do set NODE_VERSION=%%i
echo [INFO] Found Node.js %NODE_VERSION%

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is required but not installed.
    exit /b 1
)
for /f %%i in ('npm --version') do set NPM_VERSION=%%i
echo [INFO] Found npm %NPM_VERSION%

echo [SUCCESS] All prerequisites are installed!
goto :eof

:setup_backend
echo [INFO] Setting up backend...

cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
    echo [SUCCESS] Virtual environment created!
) else (
    echo [INFO] Virtual environment already exists.
)

REM Activate virtual environment and install dependencies
echo [INFO] Activating virtual environment and installing dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
echo [SUCCESS] Backend dependencies installed!

cd ..
goto :eof

:setup_frontend
echo [INFO] Setting up frontend...

cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Installing Node.js dependencies...
    npm install
    echo [SUCCESS] Frontend dependencies installed!
) else (
    echo [INFO] Node.js dependencies already installed.
)

cd ..
goto :eof

:start_backend
echo [INFO] Starting backend server...

cd backend
call venv\Scripts\activate.bat

REM Start the backend server
echo [INFO] Starting FastAPI server on http://localhost:8000
start /b uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

echo [SUCCESS] Backend server is starting!
echo [INFO] API Documentation: http://localhost:8000/docs

cd ..
goto :eof

:start_backend_only
echo [INFO] Starting backend server...

cd backend
call venv\Scripts\activate.bat

REM Start the backend server (blocking)
echo [INFO] Starting FastAPI server on http://localhost:8000
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

cd ..
goto :eof

:start_frontend
echo [INFO] Starting frontend server...

cd frontend

REM Start the frontend server
echo [INFO] Starting React development server on http://localhost:3000
start /b npm start

REM Wait a moment for server to start
timeout /t 5 /nobreak >nul

echo [SUCCESS] Frontend server is starting!
echo [INFO] Application will be available at: http://localhost:3000

cd ..
goto :eof

:start_frontend_only
echo [INFO] Starting frontend server...

cd frontend

REM Start the frontend server (blocking)
echo [INFO] Starting React development server on http://localhost:3000
npm start

cd ..
goto :eof

:cleanup
echo [INFO] Shutting down servers...

REM Kill processes by name (Windows equivalent)
taskkill /f /im "uvicorn.exe" >nul 2>&1
taskkill /f /im "node.exe" >nul 2>&1

REM Kill processes by port
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

echo [SUCCESS] Cleanup completed!
goto :eof

:end
endlocal
exit /b 0
