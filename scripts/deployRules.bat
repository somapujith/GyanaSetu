@echo off
REM Firebase Setup Script for Windows
REM This script applies Firestore security rules to your Firebase project

echo.
echo ========================================
echo   Firebase Firestore Setup
echo ========================================
echo.

REM Check if firebase-tools is installed
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Firebase CLI not found
    echo Install it with: npm install -g firebase-tools
    exit /b 1
)

echo Checking Firebase CLI version...
firebase --version

echo.
echo Checking for .firebaserc file...
if not exist ".firebaserc" (
    echo No .firebaserc found. Initializing Firebase project...
    firebase init
) else (
    echo Firebase project already configured
)

echo.
echo Checking for firestore.rules file...
if not exist "firestore.rules" (
    echo Error: firestore.rules file not found!
    exit /b 1
)

echo.
echo Deploying Firestore security rules...
firebase deploy --only firestore:rules

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  SUCCESS! Rules deployed
    echo ========================================
    echo.
) else (
    echo.
    echo ========================================
    echo  ERROR! Check output above
    echo ========================================
    exit /b 1
)
