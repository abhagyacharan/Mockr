# app/routers/resumes.py
from uuid import uuid4
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.schemas.resume import ResumeResponse
from app.models.mock_session import MockSession
from app.core.auth import get_current_user
from app.services.file_processor import FileProcessor
import json
from datetime import datetime, timezone

from app.schemas.mock_session import MockSessionResponse

router = APIRouter()

ALLOWED_FILE_TYPES = {
    "application/pdf": "pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "text/plain": "txt",
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post(
    "/upload", response_model=MockSessionResponse, status_code=status.HTTP_201_CREATED
)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload and process resume file"""

    # Validate file type
    if file.content_type not in ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file.content_type} not allowed. Allowed types: PDF, DOCX, TXT",
        )

    # Read file content
    content = await file.read()

    # Validate file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File size too large. Maximum size: {MAX_FILE_SIZE // 1024 // 1024}MB",
        )

    # Extract text based on file type
    file_type = ALLOWED_FILE_TYPES[file.content_type]
    try:
        if file_type == "pdf":
            text_content = FileProcessor.extract_text_from_pdf(content)
        elif file_type == "docx":
            text_content = FileProcessor.extract_text_from_docx(content)
        elif file_type == "txt":
            text_content = FileProcessor.extract_text_from_txt(content)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing file: {str(e)}",
        )

    if not text_content.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File appears to be empty or unreadable",
        )

    # Parse resume content
    parsed_data = FileProcessor.parse_resume_with_llm(text_content)

    # Create resume record
    db_resume = Resume(
        user_id=current_user.id,
        filename=f"{current_user.id}_{file.filename}",
        original_filename=file.filename,
        content=text_content,
        parsed_data=parsed_data,
        file_type=file_type,
        file_size=FileProcessor.get_file_size_string(len(content)),
    )

    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)

    # return db_resume

    # ➕ Create mock session automatically
    questions = await FileProcessor.generate_mcq_questions(
        json.dumps(parsed_data), difficulty="medium"
    )

    if not questions:
        raise HTTPException(
            status_code=500, detail="Failed to generate mock questions."
        )

    mock_session_id = uuid4()
    session = MockSession(
        id=mock_session_id,
        user_id=current_user.id,
        source_type="resume",
        source_id=db_resume.id,
        session_name=f"Resume Session {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M')}",
        questions=questions,
        total_questions=len(questions),
        answered_questions=0,
        status="ongoing",
        difficulty_level="medium",
        created_at=datetime.now(timezone.utc),
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return session


@router.get("/", response_model=List[ResumeResponse])
async def get_user_resumes(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    """Get all resumes for current user"""
    resumes = db.query(Resume).filter(Resume.user_id == current_user.id).all()
    return resumes


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get specific resume by ID"""
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id, Resume.user_id == current_user.id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found"
        )

    return resume


@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Delete specific resume"""
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id, Resume.user_id == current_user.id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found"
        )

    db.delete(resume)
    db.commit()

    return {"message": "Resume deleted successfully"}


@router.get("/{resume_id}/content")
async def get_resume_content(
    resume_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get resume content (text)"""
    resume = (
        db.query(Resume)
        .filter(Resume.id == resume_id, Resume.user_id == current_user.id)
        .first()
    )

    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found"
        )

    return {"content": resume.content, "parsed_data": resume.parsed_data}
