@echo off
chcp 65001 >nul
echo.
echo   正在启动学生投递记录管理系统...
echo.
cd backend
set NODE_ENV=production
node dist/index.js
pause
