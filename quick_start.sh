#!/bin/bash

# WeatherVibe - Premium Weather Experience
# Quick Start Script

echo "🌤️ WeatherVibe - Premium Weather Experience"
echo "============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install --silent

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install --silent

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ All dependencies installed successfully"
echo ""

# Start backend server
echo "🚀 Starting backend server..."
cd ../backend
node server.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend server is running on port 3001"
else
    echo "❌ Backend server failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Start frontend server
echo "🌐 Starting frontend server..."
cd ../frontend
python3 -m http.server 8000 &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 2

# Check if frontend is running
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ Frontend server is running on port 8000"
else
    echo "❌ Frontend server failed to start"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 WeatherVibe is now running!"
echo ""
echo "📱 Frontend: http://localhost:8000"
echo "🔧 Backend API: http://localhost:3001/api"
echo ""
echo "✨ Features available:"
echo "   • Dynamic weather backgrounds"
echo "   • Glassmorphism UI design"
echo "   • Temperature unit toggle (°C/°F)"
echo "   • Favorites system"
echo "   • Pull-to-refresh functionality"
echo "   • Mobile responsive design"
echo "   • Beautiful city images"
echo "   • Real-time weather data"
echo ""
echo "🛑 To stop the servers, press Ctrl+C or run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Keep script running and handle Ctrl+C
trap 'echo ""; echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo "✅ Servers stopped"; exit 0' INT

# Wait for user to stop
wait
