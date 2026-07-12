@echo off
REM Build and start the local Docker Compose stack.

echo Installing Go module metadata...
cd backend
go mod tidy
if %errorlevel% neq 0 (
    echo go mod tidy failed.
    exit /b %errorlevel%
)
cd ..

echo Starting Docker Compose...
docker compose up -d --build
if %errorlevel% neq 0 (
    echo Failed to start Docker Compose.
    exit /b %errorlevel%
)

echo Docker Compose started successfully.
pause
