---
title: Todo AI Chatbot API
emoji: ✅
colorFrom: blue
colorTo: purple
sdk: docker
app_port: 7860
dockerfile: Dockerfile.hf
pinned: false
license: mit
---

# Todo AI Chatbot API

A FastAPI backend for an AI-powered todo chatbot application with natural language task management.

## Features

- 🔐 User authentication with JWT
- ✅ Natural language todo management via AI chatbot
- 💬 Conversational interface for task operations
- 📊 Task statistics and analytics
- 🗃️ PostgreSQL database with asyncpg
- 🤖 AI agent powered by Groq LLM

## API Endpoints

- `/api/auth/*` - Authentication endpoints
- `/api/chat` - Chat with AI assistant
- `/api/tasks/*` - Task management
- `/api/conversations/*` - Conversation history
- `/api/stats` - User statistics
- `/api/profile` - User profile management
- `/health` - Health check

## Environment Variables

Configure these in your Space settings:

- `DATABASE_URL` - PostgreSQL connection string
- `GROQ_API_KEY` - Groq API key for AI
- `AUTH_SECRET` - JWT secret key (min 32 chars)
- `FRONTEND_URL` - Frontend URL for CORS
- `ENVIRONMENT` - Set to "production"

## Deployment

This Space uses Docker. The application runs on port 7860.
