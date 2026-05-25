@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   学生投递记录管理系统 - 一键部署
echo ========================================
echo.

:: 1. 构建前端
echo [1/4] 正在安装前端依赖...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo 前端依赖安装失败！
    pause
    exit /b 1
)

echo [2/4] 正在构建前端...
call npm run build
if %errorlevel% neq 0 (
    echo 前端构建失败！
    pause
    exit /b 1
)
cd ..

:: 2. 构建后端
echo [3/4] 正在安装后端依赖...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo 后端依赖安装失败！
    pause
    exit /b 1
)

echo [4/4] 正在构建后端...
call npm run build
if %errorlevel% neq 0 (
    echo 后端构建失败！
    pause
    exit /b 1
)

:: 3. 复制生产环境配置
copy /Y .env.production .env >nul

:: 4. 确保数据目录存在
if not exist "data" mkdir data
if not exist "uploads" mkdir uploads

cd ..

echo.
echo ========================================
echo   部署完成！
echo ========================================
echo.
echo   运行 start.bat 启动服务
echo.
pause
