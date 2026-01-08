#!/bin/bash

# Hackathon Todo - Frontend Startup Script

echo "🚀 Starting Hackathon Todo Frontend..."
echo ""

cd frontend

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: frontend/.env.local file not found!"
    echo "Please create it from .env.local.example"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "✅ Starting Next.js dev server on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
