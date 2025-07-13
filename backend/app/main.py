# app/main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.config import settings
import uvicorn

# Import routers (we'll create these next)
from app.routers import auth, users, resumes, job_descriptions, mock_sessions, mock_session_answers, file_parser

app = FastAPI(
    title="Mockr API",
    description="Mock Interview Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(resumes.router, prefix="/api/resumes", tags=["Resumes"])
app.include_router(job_descriptions.router, prefix="/api/job-descriptions", tags=["Job Descriptions"])
app.include_router(file_parser.router, prefix="/api/parse", tags=["File Parsing"])
app.include_router(mock_sessions.router, prefix="/api/mock-sessions", tags=["Mock Sessions"])
app.include_router(mock_session_answers.router, prefix="/api/mock-sessions", tags=["Mock Session Answers"])

@app.get("/")
async def root():
    return {"message": "Mockr API is running", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)