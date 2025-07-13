from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from app.core.auth import get_current_user
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.mock_session import MockSession
from app.schemas.mock_session import MockSessionCreate, MockSessionResponse
from app.services.file_processor import FileProcessor
from datetime import datetime, timezone
import uuid
import json

router = APIRouter()

@router.post("/", response_model=MockSessionResponse)
async def create_mock_session(
    session_data: MockSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new mock interview session (resume or job_description source)"""
    source_id = session_data.source_id
    source_type = session_data.source_type
    difficulty = session_data.difficulty_level

    if source_type == "resume":
        resume = db.query(Resume).filter(Resume.id == source_id, Resume.user_id == current_user.id).first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        parsed = resume.parsed_data
    else:
        raise HTTPException(status_code=400, detail="Unsupported source type (only 'resume' supported for now)")

    # Generate questions from parsed JSON
    questions = await FileProcessor.generate_mcq_questions(json.dumps(parsed), difficulty)

    if not questions:
        raise HTTPException(status_code=500, detail="Failed to generate questions")

    session_id = uuid.uuid4()
    db_session = MockSession(
        id=session_id,
        user_id=current_user.id,
        source_type=source_type,
        source_id=source_id,
        session_name=session_data.session_name or f"Mock Session {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M')}",
        questions=questions,
        total_questions=len(questions),
        answered_questions=0,
        status="ongoing",
        difficulty_level=session_data.difficulty_level,
        created_at=datetime.now(timezone.utc),
    )

    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.get("/", response_model=List[MockSessionResponse])
async def list_user_mock_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all mock sessions of current user"""
    return db.query(MockSession).filter(MockSession.user_id == current_user.id).all()

@router.get("/{session_id}", response_model=MockSessionResponse)
async def get_mock_session(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get details of a specific session"""
    session = db.query(MockSession).filter(MockSession.id == session_id, MockSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Mock session not found")
    return session

@router.delete("/{session_id}")
async def delete_mock_session(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a mock session"""
    session = db.query(MockSession).filter(MockSession.id == session_id, MockSession.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Mock session not found")
    
    db.delete(session)
    db.commit()
    return {"message": "Mock session deleted successfully"}
