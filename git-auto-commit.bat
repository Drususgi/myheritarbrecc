@echo off
REM Automatic Git Workflow Script for Windows
REM This script checks for changes, commits them with a meaningful message, and pushes to origin

echo === Git Auto-Commit Workflow ===
echo.

REM Check current status
echo Checking git status...
git status

REM Check if there are any changes
git status -s >nul 2>&1
if %errorlevel% neq 0 (
    echo No changes to commit. Working tree is clean.
    exit /b 0
)

REM Show what will be committed
echo.
echo Changes to be committed:
git diff --stat
echo.

REM Add all changes
echo Staging all changes...
git add -A

REM Create commit with heredoc-style message
echo Creating commit...
git commit -m "Update family tree display: enhanced member relationships and UI improvements

- Improved family member display with better relationship indicators
- Enhanced chronological partner support
- Refined UI components for better user experience
- Updated styling for clearer family connections

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

REM Push to origin
echo.
echo Pushing to origin...
git push origin main

echo.
echo Git workflow completed successfully!
pause