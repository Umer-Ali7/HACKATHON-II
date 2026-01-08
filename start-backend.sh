#!/bin/bash

# Hackathon Todo - Backend Startup Script

echo "🚀 Starting Hackathon Todo Backend API..."
echo ""

cd backend

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: backend/.env file not found!"
    echo "Please create it from .env.example"
    exit 1
fi

# Check if venv exists
if [ ! -d .venv ]; then
    echo "📦 Installing dependencies..."
    uv sync
fi

echo "✅ Starting FastAPI server on http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uv run uvicorn app.main:app --reload --port 8000
