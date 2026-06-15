@echo off
cd /d "%~dp0"
echo ===================================================
echo Preparing to start Hansoll AI Portal local server...
echo ===================================================

REM Check if port 3000 is already listening
netstat -ano | find "LISTENING" | find ":3000" >nul
if %errorlevel% equ 0 goto already_running

echo [STARTING] Starting local server and file watcher (Auto-sync)...
start /min cmd /c "node scripts/watch.js"
start /min cmd /c "npm.cmd run dev"

echo [WAITING] Waiting for the server to be fully ready (Max 30s)...
set /a counter=0

:wait_loop
timeout /t 2 >nul
netstat -ano | find "LISTENING" | find ":3000" >nul
if %errorlevel% equ 0 goto server_ready

set /a counter+=2
if %counter% geq 30 goto timeout_reached
goto wait_loop

:already_running
echo [OK] Local server is already running.
goto open_browser

:server_ready
REM Additional wait for Next.js internal routing to prepare
timeout /t 3 >nul
goto open_browser

:timeout_reached
echo [WARNING] Server start might be delayed or failed. Opening portal anyway.
goto open_browser

:open_browser
echo [OK] Opening the portal page...
start "" "http://localhost:3000/index.html"
exit
