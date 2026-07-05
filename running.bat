@echo off
REM Run docker compose up with build and detached mode

echo Starting Docker Compose (build ^& detached)...
        REM Pull latest code and run docker compose up with build and detached mode


echo Resetting to latest from git...
git reset --hard
if %errorlevel% neq 0 (
    echo Git reset failed.
    exit /b %errorlevel%
)

echo Pulling latest code from git...
git pull
if %errorlevel% neq 0 (
    echo Git pull failed.
    exit /b %errorlevel%
)

echo Starting Go Download...
cd backend
go mod tidy
cd ..

echo Starting Docker Compose (build ^& detached)...
docker compose up -d --build
if %errorlevel% neq 0 (
    echo Failed to start Docker Compose.
    exit /b %errorlevel%
)
echo Docker Compose started successfully.
echo.
pause
