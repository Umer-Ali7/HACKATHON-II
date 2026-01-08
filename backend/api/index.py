"""
Vercel serverless function entry point for FastAPI backend.
"""
import sys
import os
from pathlib import Path

# Add parent directory to path for imports
parent_dir = str(Path(__file__).parent.parent)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Set working directory for .env file detection
os.chdir(parent_dir)

from app.main import app

# Export the FastAPI app for Vercel (Vercel expects 'app' or 'handler')
app = app
