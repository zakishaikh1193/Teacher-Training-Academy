@echo off
REM Script to run rate limit tests for OpenAI chatbot backend
REM Make sure to run this from the server directory

echo 🚀 OpenAI Rate Limit Test Runner
echo =================================

REM Check if .env file exists
if not exist .env (
    echo ⚠️  .env file not found!
    echo Please create a .env file with your OpenAI API key:
    echo OPENAI_API_KEY=your_key_here
    pause
    exit /b 1
)

REM Check if Node.js dependencies are installed
if not exist node_modules (
    echo 📦 Installing dependencies...
    npm install
)

REM Start the server in background
echo 🌟 Starting server...
start /B npm start

REM Wait for server to start
echo ⏳ Waiting for server to start...
timeout /t 5 /nobreak > nul

REM Check if server is running (simplified check)
echo ✅ Server should be running on http://localhost:3002

REM Run the rate limit tests
echo 🧪 Running rate limit tests...
node test-rate-limits.js

echo ✅ Test completed!
echo 📝 You may need to manually stop the server (Ctrl+C in the server window)
pause