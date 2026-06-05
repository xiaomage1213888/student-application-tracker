@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   一键重新构建并重启服务
echo ========================================
echo.

:: 1. 停止旧的 Node 进程（后端服务）
echo [1/4] 正在停止旧的后端服务...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo   已停止后端服务
) else (
    echo   没有运行中的后端服务
)
timeout /t 2 >nul

:: 2. 构建前端
echo [2/4] 正在构建前端...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo 前端构建失败！
    pause
    exit /b 1
)
cd ..

:: 3. 构建后端
echo [3/4] 正在构建后端...
cd backend
call npm run build
if %errorlevel% neq 0 (
    echo 后端构建失败！
    pause
    exit /b 1
)

:: 复制生产环境配置
copy /Y .env.production .env >nul

:: 4. 启动后端服务
echo [4/4] 正在启动后端服务...
set NODE_ENV=production
start "学生投递记录管理系统" node dist/index.js
cd ..

echo.
echo ========================================
echo   服务已重启！
echo ========================================
echo.
echo   访问地址：
echo     本地：http://localhost:5173/
echo     局域网：http://192.168.30.230:5173/
echo.
echo   如需停止服务，关闭弹出的命令窗口即可
echo.
pause
