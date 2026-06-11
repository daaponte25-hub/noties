@echo off
setlocal
cd /d "%~dp0"
echo Iniciando Noties desde frontend\NotiesBlazor.csproj...

dotnet watch --project "NotiesBlazor.csproj"

if errorlevel 1 (
    echo.
    echo Error: el comando dotnet watch finalizo con error.
    pause
)
endlocal
