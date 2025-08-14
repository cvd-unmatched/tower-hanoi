@echo off
setlocal enabledelayedexpansion

REM Tower of Hanoi Deployment Script for Windows
REM This script helps deploy the application to various environments

REM Configuration
set IMAGE_NAME=ghcr.io/cvd-unmatched/hanoi
set CONTAINER_NAME=tower-of-hanoi
set EXTERNAL_PORT=8080
set INTERNAL_PORT=80

REM Functions
:log_info
echo [INFO] %~1
goto :eof

:log_warn
echo [WARN] %~1
goto :eof

:log_error
echo [ERROR] %~1
goto :eof

REM Check if Docker is running
:check_docker
docker info >nul 2>&1
if errorlevel 1 (
    call :log_error "Docker is not running. Please start Docker and try again."
    exit /b 1
)
call :log_info "Docker is running"
goto :eof

REM Pull latest image
:pull_image
call :log_info "Pulling latest image from registry..."
docker pull %IMAGE_NAME%:latest
if errorlevel 1 (
    call :log_error "Failed to pull image"
    exit /b 1
)
call :log_info "Image pulled successfully"
goto :eof

REM Stop existing container
:stop_container
docker ps -q -f name=%CONTAINER_NAME% >nul 2>&1
if not errorlevel 1 (
    call :log_info "Stopping existing container..."
    docker stop %CONTAINER_NAME%
    docker rm %CONTAINER_NAME%
    call :log_info "Container stopped and removed"
)
goto :eof

REM Start new container
:start_container
call :log_info "Starting new container..."
docker run -d --name %CONTAINER_NAME% -p %EXTERNAL_PORT%:%INTERNAL_PORT% --restart unless-stopped %IMAGE_NAME%:latest
if errorlevel 1 (
    call :log_error "Failed to start container"
    exit /b 1
)
call :log_info "Container started successfully"
goto :eof

REM Check container health
:check_health
call :log_info "Checking container health..."
timeout /t 5 /nobreak >nul
docker ps -q -f name=%CONTAINER_NAME% >nul 2>&1
if not errorlevel 1 (
    call :log_info "Container is running"
    call :log_info "Application is available at: http://localhost:%EXTERNAL_PORT%"
) else (
    call :log_error "Container failed to start"
    exit /b 1
)
goto :eof

REM Show container logs
:show_logs
call :log_info "Container logs:"
docker logs %CONTAINER_NAME%
goto :eof

REM Main deployment function
:deploy
call :log_info "Starting deployment..."
call :check_docker
call :pull_image
call :stop_container
call :start_container
call :check_health
call :log_info "Deployment completed successfully!"
goto :eof

REM Show usage
:usage
echo Usage: %0 [COMMAND]
echo.
echo Commands:
echo   deploy     - Deploy the application ^(default^)
echo   pull       - Pull latest image
echo   stop       - Stop the container
echo   start      - Start the container
echo   restart    - Restart the container
echo   logs       - Show container logs
echo   status     - Show container status
echo   help       - Show this help message
goto :eof

REM Main script logic
if "%1"=="" goto deploy
if "%1"=="deploy" goto deploy
if "%1"=="pull" goto pull
if "%1"=="stop" goto stop
if "%1"=="start" goto start
if "%1"=="restart" goto restart
if "%1"=="logs" goto logs
if "%1"=="status" goto status
if "%1"=="help" goto usage
if "%1"=="-h" goto usage
if "%1"=="--help" goto usage

call :log_error "Unknown command: %1"
call :usage
exit /b 1

:restart
call :check_docker
call :stop_container
call :start_container
call :check_health
goto :eof

:logs
call :check_docker
call :show_logs
goto :eof

:status
call :check_docker
docker ps -f name=%CONTAINER_NAME%
goto :eof
