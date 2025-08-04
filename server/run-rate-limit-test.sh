#!/bin/bash

# Script to run rate limit tests for OpenAI chatbot backend
# Make sure to run this from the server directory

echo "🚀 OpenAI Rate Limit Test Runner"
echo "================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Please create a .env file with your OpenAI API key:"
    echo "OPENAI_API_KEY=your_key_here"
    exit 1
fi

# Check if Node.js dependencies are installed
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server in background
echo "🌟 Starting server..."
npm start &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 5

# Check if server is running
if ! curl -s http://localhost:3002/api/chatbot/health > /dev/null; then
    echo "❌ Server failed to start or is not responding"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo "✅ Server is running on http://localhost:3002"

# Run the rate limit tests
echo "🧪 Running rate limit tests..."
node test-rate-limits.js

# Stop the server
echo "🛑 Stopping server..."
kill $SERVER_PID 2>/dev/null

echo "✅ Test completed!"