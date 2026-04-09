@echo off
chcp 65001 > nul
echo ========================================
echo   学生秋招投递记录管理系统
echo   一键启动脚本
echo ========================================
echo.

REM 检查 Node.js 是否安装
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

echo [信息] 正在启动后端服务器...
echo.

REM 启动后端服务器
start "后端服务器" cmd /k "cd backend && npm run dev"

REM 等待后端服务器启动
echo [信息] 等待后端服务器初始化...
timeout /t 5 /nobreak > nul

echo.
echo [信息] 正在启动前端服务器...
echo.

REM 启动前端服务器
start "前端服务器" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   服务器启动中...
echo ========================================
echo.
echo   后端服务器：http://localhost:3000
echo   前端服务器：http://localhost:5173 (或 5174)
echo.
echo   默认账号:
echo   老师账号：admin / admin123
echo.
echo   按任意键打开浏览器...
pause > nul

REM 打开浏览器
start http://localhost:5173

echo.
echo [提示] 请保持这两个命令行窗口开启
echo [提示] 关闭它们将会停止服务器
echo.
echo 启动完成!
