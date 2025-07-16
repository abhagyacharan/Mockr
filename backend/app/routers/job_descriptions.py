# app/routers/job_descriptions.py
from datetime import datetime, timezone
import json
from uuid import uuid4
from fastapi import APIRouter, Depends, Form, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.job_description import JobDescription
from app.models.mock_session import MockSession
from app.schemas.job_description import JobDescriptionCreate, JobDescriptionResponse
from app.core.auth import get_current_user
from app.services.file_processor import FileProcessor, JobDescriptionNormalizer
from app.schemas.mock_session import MockSessionResponse

router = APIRouter()

@router.post("/upload", response_model=MockSessionResponse, status_code=status.HTTP_201_CREATED)
async def upload_job_description(
    title: str = Form(...),
    company: str = Form(""),
    content: str = Form(...),
    mock_name: str = Form(...),
    num_questions: str = Form(...),
    difficulty: str = Form(...),
    practice_mode: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload job description content and create a mock interview session"""

    if not content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description content cannot be empty",
        )

    # Normalize + parse JD
    normalized_content = JobDescriptionNormalizer.normalize_with_validation(content)
    parsed_data = FileProcessor.parse_job_description_with_llm(normalized_content)

    # Save job description
    db_job = JobDescription(
        user_id=current_user.id,
        title=title,
        company=company,
        content=content,
        parsed_data=parsed_data,
        created_at=datetime.now(timezone.utc),
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    # Generate MCQ questions
    questions = await FileProcessor.generate_questions(
        json.dumps(parsed_data),
        difficulty=difficulty,
        practice_mode=practice_mode,
        num_questions=num_questions
    )
    if not questions:
        raise HTTPException(
            status_code=500, detail="Failed to generate mock questions from JD."
        )

    # Create session
    mock_session_id = uuid4()
    session = MockSession(
        id=mock_session_id,
        user_id=current_user.id,
        source_type="job_description",
        source_id=db_job.id,
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

@router.get("/", response_model=List[JobDescriptionResponse])
async def get_user_job_descriptions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all job descriptions for current user"""
    jobs = db.query(JobDescription).filter(JobDescription.user_id == current_user.id).all()
    return jobs

@router.get("/{job_id}", response_model=JobDescriptionResponse)
async def get_job_description(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific job description by ID"""
    job = db.query(JobDescription).filter(
        JobDescription.id == job_id,
        JobDescription.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found"
        )
    
    return job

@router.put("/{job_id}", response_model=JobDescriptionResponse)
async def update_job_description(
    job_id: str,
    job_data: JobDescriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update specific job description"""
    job = db.query(JobDescription).filter(
        JobDescription.id == job_id,
        JobDescription.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found"
        )
    
    # Parse updated content
    parsed_data = FileProcessor.parse_job_description_with_llm(job_data.content)
    
    # Update job description
    job.title = job_data.title
    job.company = job_data.company
    job.content = job_data.content
    job.parsed_data = parsed_data
    
    db.commit()
    db.refresh(job)
    
    return job

@router.delete("/{job_id}")
async def delete_job_description(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete specific job description"""
    job = db.query(JobDescription).filter(
        JobDescription.id == job_id,
        JobDescription.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found"
        )
    
    db.delete(job)
    db.commit()
    
    return {"message": "Job description deleted successfully"}