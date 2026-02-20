@echo off
chcp 65001 >nul
title Service Manager

:menu
cls
echo ==============================
echo Service Manager
echo ==============================
echo 1 - Запустить все сервисы
echo 2 - Остановить все сервисы
echo 3 - Запустить player
echo 4 - Запустить stat
echo 5 - Запустить auth
echo 6 - Остановить player
echo 7 - Остановить stat
echo 8 - Остановить auth
echo 0 - Выход
echo ==============================
set /p choice=Выбери действие: 

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto stop_all
if "%choice%"=="3" goto start_player
if "%choice%"=="4" goto start_stat
if "%choice%"=="5" goto start_auth
if "%choice%"=="6" goto stop_player
if "%choice%"=="7" goto stop_stat
if "%choice%"=="8" goto stop_auth
if "%choice%"=="0" exit

goto menu


:start_all
call :start_player
call :start_stat
call :start_auth
goto menu


:stop_all
echo Stopping all services...
call :stop_player
call :stop_stat
call :stop_auth
echo Done.
pause
goto menu


:start_player
call venv\Scripts\activate
start "player_service api" cmd /k "cd player_service && python -m app.main"
start "player_frontend" cmd /k "cd player_service\frontend && python -m http.server 5501"
goto :eof


:start_stat
call venv\Scripts\activate
start "stat_service api" cmd /k "cd stat_service && python -m app.main"
start "stat_frontend" cmd /k "cd stat_service\frontend && python -m http.server 5500"
goto :eof


:start_auth
call venv\Scripts\activate
start "auth_service api" cmd /k "cd auth_service && python -m app.main"
start "auth_frontend" cmd /k "cd auth_service\frontend && python -m http.server 5502"
goto :eof


:stop_player
taskkill /FI "WINDOWTITLE eq player_service api*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq player_frontend*" /T /F >nul 2>&1
echo Player stopped.
goto :eof


:stop_stat
taskkill /FI "WINDOWTITLE eq stat_service api*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq stat_frontend*" /T /F >nul 2>&1
echo Stat stopped.
goto :eof


:stop_auth
taskkill /FI "WINDOWTITLE eq auth_service api*" /T /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq auth_frontend*" /T /F >nul 2>&1
echo Auth stopped.
goto :eof