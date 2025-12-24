@echo off
echo Starting Data Science Job Portal Services...
echo --------------------------------------------
echo 1. Starting Backend Server (Port 3000)...
start "Job Portal Server" cmd /k "npm start"
timeout /t 5
echo 2. Starting Automation Service (24/7)...
start "Job Portal Automation" cmd /k "npm run send-alerts"
echo --------------------------------------------
echo All services started! DO NOT CLOSE the popup windows if you want them to run 24/7.
pause
