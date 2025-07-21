from fastapi import APIRouter, Depends, Form, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from typing import List
from app.core.auth import get_current_user
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.job_description import JobDescription
from app.models.mock_session import MockSession, UserResponse
from app.schemas.mock_session import MockSessionCreate, MockSessionResponse
from app.services.file_processor import FileProcessor
from datetime import datetime, timezone
import uuid
import json



router = APIRouter()


@router.post("/", response_model=MockSessionResponse)
async def create_mock_session(
    source_id: UUID = Form(...),
    source_type: str = Form(...),  # "resume" or "job_description"
    mock_name: str = Form(...),
    difficulty: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new mock interview session from resume or job_description"""

    # Fetch and validate the source
    if source_type == "resume":
        resume = db.query(Resume).filter(
            Resume.id == source_id,
            Resume.user_id == current_user.id
        ).first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        parsed_data = resume.parsed_data

    elif source_type == "job_description":
        jd = db.query(JobDescription).filter(
            JobDescription.id == source_id,
            JobDescription.user_id == current_user.id
        ).first()
        if not jd:
            raise HTTPException(status_code=404, detail="Job description not found")
        parsed_data = jd.parsed_data

    else:
        raise HTTPException(status_code=400, detail="Invalid source type")

    # Generate questions from parsed JSON
    questions = await FileProcessor.generate_mcq_questions(
        json.dumps(parsed_data),
        difficulty=difficulty
    )

    if not questions:
        raise HTTPException(status_code=500, detail="Failed to generate questions")

    # Create mock session
    session_id = uuid4()
    session = MockSession(
        id=session_id,
        user_id=current_user.id,
        source_type=source_type,
        source_id=source_id,
        session_name=mock_name,
        questions=questions,
        total_questions=len(questions),
        answered_questions=0,
        status="ongoing",
        difficulty_level=difficulty,
        created_at=datetime.now(timezone.utc),
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


@router.get("/", response_model=List[MockSessionResponse])
async def list_user_mock_sessions(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get all mock sessions of current user"""
    return db.query(MockSession).filter(MockSession.user_id == current_user.id).all()


@router.get("/user-sessions", response_model=List[dict])
def get_user_sessions(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """
    Fetch mock sessions for the current user with calculated scores.
    """
    # Query sessions with aggregated scores from responses
    sessions_with_scores = (
        db.query(
            MockSession,
            func.avg(UserResponse.score).label("avg_score")
        )
        .outerjoin(UserResponse, MockSession.id == UserResponse.session_id)
        .filter(MockSession.user_id == current_user.id)
        .group_by(MockSession.id)
        .order_by(MockSession.created_at.desc())
        .all()
    )
    
    result = []
    for session, avg_score in sessions_with_scores:
        # Format the score
        if avg_score is not None:
            score = round(float(avg_score), 1)
        else:
            score = "N/A"
        
        result.append({
            "id": str(session.id),
            "session_name": session.session_name,
            "date": session.created_at.strftime("%Y-%m-%d"),
            "type": session.source_type,
            "totalQuestions": session.total_questions,
            "score": score,
            # "duration": (
            #     (
            #         session.completed_at.replace(tzinfo=None)
            #         - session.created_at.replace(tzinfo=None)
            #     ).total_seconds()
            #     // 60
            # ),
            "difficulty": session.difficulty_level,
            "status": session.status,
        })
    
    return result

@router.get("/{session_id}", response_model=MockSessionResponse)
async def get_mock_session(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get details of a specific session"""
    session = (
        db.query(MockSession)
        .filter(MockSession.id == session_id, MockSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Mock session not found")
    return session


@router.delete("/{session_id}")
async def delete_mock_session(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete a mock session"""
    session = (
        db.query(MockSession)
        .filter(MockSession.id == session_id, MockSession.user_id == current_user.id)
        .first()
    )
    if not session:
        raise HTTPException(status_code=404, detail="Mock session not found")

    db.delete(session)
    db.commit()
    return {"message": "Mock session deleted successfully"}
