@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   启动开发环境（前后端热更新）
echo ========================================
echo.

:: 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

echo [1/2] 正在启动后端开发服务器...
start "后端服务" cmd /k "cd /d %~dp0backend && npm run dev"

:: 等待后端启动
timeout /t 5 /nobreak >nul

echo [2/2] 正在启动前端开发服务器...
start "前端服务" cmd /k "cd /d %~dp0frontend && npm run dev"

:: 等待前端启动
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   开发服务器已启动！
echo ========================================
echo.
echo   后端：http://localhost:3000
echo   前端：http://localhost:5173
echo.
echo   默认测试账号：
echo   教师：admin / admin123
echo.
echo   正在打开浏览器...

:: 打开浏览器
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo   两个命令窗口会保持打开状态
echo   关闭它们即可停止开发服务器
echo.
pause
