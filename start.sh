#!/bin/bash

# Weather & City Info Hub - Quick Start Script
# This script helps you start both backend and frontend servers

echo "🌤️ Weather & City Info Hub - Quick Start"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  .env file not found in backend directory"
    echo "📝 Creating .env file with your OpenWeatherMap API key..."
    
    cat > backend/.env << EOF
# OpenWeatherMap API Configuration
OPENWEATHER_API_KEY=228f245028848493f6bea85b96a9edcd
OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5

# Unsplash API Configuration  
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
UNSPLASH_BASE_URL=https://api.unsplash.com

# GeoDB Cities API Configuration
GEODB_API_KEY=your_geodb_api_key_here
GEODB_BASE_URL=https://wft-geo-db.p.rapidapi.com/v1

# Server Configuration
PORT=3001
NODE_ENV=development

# Cache Configuration (in seconds)
CACHE_TTL=300
EOF
    
    echo "✅ .env file created with your OpenWeatherMap API key"
    echo "📋 Don't forget to add your Unsplash and GeoDB API keys!"
fi

# Install dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

echo ""
echo "🚀 Starting servers..."
echo ""

# Start backend server
echo "🔧 Starting backend server on port 3001..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting frontend server on port 8000..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are starting up!"
echo ""
echo "🌐 Frontend: http://localhost:8000"
echo "🔧 Backend API: http://localhost:3001/api"
echo ""
echo "📋 Available API endpoints:"
echo "   GET /api/weather?city=London&country=GB"
echo "   GET /api/city?city=London&country=GB"
echo "   GET /api/image?city=London&country=GB"
echo "   GET /api/health"
echo ""
echo "🛑 To stop servers, press Ctrl+C or run:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Wait for user to stop
wait
