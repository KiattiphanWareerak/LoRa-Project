@echo off
setlocal enabledelayedexpansion

REM Prompt the user to enter the COM port number
set /p portNum=Enter the COM port number:

REM Prompt the user to select the action
set /p action=Enter 1 to erase flash or 2 to write firmware:

REM Check the user's action choice and execute the corresponding esptool command
if "%action%"=="1" (
    esptool --chip esp32 --port COM%portNum% erase_flash
) else if "%action%"=="2" (
    esptool --chip esp32 --port COM%portNum% write_flash -z 0x1000 ESP32_v1.19.1.bin
) else (
    echo Invalid action choice. Please enter 1 or 2.
)

pause