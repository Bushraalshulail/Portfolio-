@echo off
echo Setting up Redis for GymFinder Riyadh Backend...
echo.

echo Installing Redis using Chocolatey...
powershell -Command "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))"

echo.
echo Installing Redis...
choco install redis-64 -y

echo.
echo Starting Redis service...
net start redis

echo.
echo Redis setup complete!
echo Redis should now be running on localhost:6379
echo.
pause

