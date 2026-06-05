@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   快速构建（仅构建，不安装依赖）
echo ========================================
echo.

:: 1. 构建前端
echo [1/2] 正在构建前端...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo 前端构建失败！
    pause
    exit /b 1
)
cd ..

:: 2. 构建后端
echo [2/2] 正在构建后端...
cd backend
call npm run build
if %errorlevel% neq 0 (
    echo 后端构建失败！
    pause
    exit /b 1
)

:: 3. 复制生产环境配置
copy /Y .env.production .env >nul

cd ..

echo.
echo ========================================
echo   构建完成！
echo ========================================
echo.
echo   后端服务如果正在运行，需要重启：
echo   1. 按 Ctrl+C 停止当前的 start.bat
echo   2. 重新运行 start.bat
echo.
pause
