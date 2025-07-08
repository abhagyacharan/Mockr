# app/routers/job_descriptions.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.job_description import JobDescription
from app.schemas.job_description import JobDescriptionCreate, JobDescriptionResponse
from app.core.auth import get_current_user
from app.services.file_processor import FileProcessor, JobDescriptionNormalizer

router = APIRouter()

@router.post("/", response_model=JobDescriptionResponse, status_code=status.HTTP_201_CREATED)
async def create_job_description(
    job_data: JobDescriptionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new job description"""
    
    if not job_data.content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description content cannot be empty"
        )
    # Normalize content
    normalized_content = JobDescriptionNormalizer.normalize_with_validation(job_data.content)

    # Parse job description content
    parsed_data = FileProcessor.parse_job_description_with_llm(normalized_content)
    
    # Create job description record
    db_job = JobDescription(
        user_id=current_user.id,
        title=job_data.title,
        company=job_data.company,
        content=job_data.content,
        parsed_data=parsed_data
    )
    
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    
    return db_job

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