from fastapi import APIRouter, Depends, Form, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from typing import List, Optional
from app.core.auth import get_current_user
from app.database import get_db
from app.models.user import User
from app.models.resume import Resume
from app.models.job_description import JobDescription
from app.services.llm_grader import LLMGrader
from app.models.mock_session import MockSession, UserResponse
from app.schemas.mock_session import AnswerSubmission, MockSessionCreate, MockSessionResponse, UserResponseResponse
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

@router.post("/{session_id}/submit", response_model=UserResponseResponse)
async def submit_answer(
    session_id: UUID,
    answer_data: AnswerSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit an answer for a specific question in a mock session"""

    session = db.query(MockSession).filter(
        MockSession.id == session_id,
        MockSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Mock session not found")

    if session.status != "ongoing":
        raise HTTPException(status_code=400, detail="Session is already completed or inactive")

    # Prevent duplicate submission
    existing = db.query(UserResponse).filter(
        UserResponse.session_id == session_id,
        UserResponse.question_index == answer_data.question_index
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Answer for this question already submitted")

    # Fetch the correct question
    try:
        question = session.questions[answer_data.question_index]
    except IndexError:
        raise HTTPException(status_code=400, detail="Invalid question index")

    # Default response
    is_correct = "ungraded"
    score = 0
    feedback = "Your answer will be reviewed."
    detailed_feedback = None

    # Determine question type and grade accordingly
    question_type = session.practice_mode or "mcq"
    
    if question_type == "mcq":
        # Existing MCQ logic
        correct_answer = question.get("answer")
        if correct_answer:
            user_ans = answer_data.user_answer.strip().lower()
            correct_ans = correct_answer.strip().lower()
            if user_ans == correct_ans:
                is_correct = "correct"
                score = 100
                feedback = "Good job!"
            else:
                is_correct = "incorrect"
                feedback = f"The correct answer was: {correct_answer}"
    
    elif question_type == "qa" or question_type == "open":
        try:
            # Get context from the session source
            context = await get_session_context(session, db)
            
            # Grade using LLM
            grading_result = await LLMGrader.grade_qa_answer(
                question=question.get("question", ""),
                user_answer=answer_data.user_answer,
                context=context,
                difficulty=session.difficulty_level
            )
            
            score = grading_result["score"]
            is_correct = grading_result["correctness_level"]
            feedback = grading_result["feedback"]
            detailed_feedback = {
                "strengths": grading_result.get("strengths", []),
                "improvements": grading_result.get("improvements", [])
            }
            
        except Exception as e:
            # Fallback if LLM grading fails
            is_correct = "ungraded"
            score = 0
            feedback = f"Unable to grade automatically: {str(e)}"

    # Record user response
    response = UserResponse(
        session_id=session_id,
        question_index=answer_data.question_index,
        question_text=answer_data.question_text,
        question_type=answer_data.question_type,
        user_answer=answer_data.user_answer,
        is_correct=is_correct,
        score=score,
        feedback=feedback,
        detailed_feedback=detailed_feedback,  # This should now work
        time_taken=answer_data.time_taken,
        created_at=datetime.now(timezone.utc)
    )

    db.add(response)

    # Update session progress
    session.answered_questions += 1
    if answer_data.question_index >= session.current_question_index:
        session.current_question_index = answer_data.question_index + 1

    if session.answered_questions >= session.total_questions:
        session.status = "completed"
        session.completed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(response)

    return response

# Helper function to get context for grading
async def get_session_context(session: MockSession, db: Session) -> str:
    """Get context information for LLM grading"""
    try:
        if session.source_type == "resume":
            resume = db.query(Resume).filter(Resume.id == session.source_id).first()
            if resume and resume.parsed_data:
                return f"Resume context: {json.dumps(resume.parsed_data)}"
        elif session.source_type == "job_description":
            jd = db.query(JobDescription).filter(JobDescription.id == session.source_id).first()
            if jd and jd.parsed_data:
                return f"Job description context: {json.dumps(jd.parsed_data)}"
        
        return "No additional context available"
    except Exception:
        return "No additional context available"

@router.get("/{session_id}/responses", response_model=List[UserResponseResponse])
async def get_responses_for_session(
    session_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return all user responses for a session"""
    session = db.query(MockSession).filter(
        MockSession.id == session_id,
        MockSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    return session.responses


@router.get("/active", response_model=Optional[MockSessionResponse])
async def get_active_mock_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = (
        db.query(MockSession)
        .filter(
            MockSession.user_id == current_user.id,
            MockSession.status.in_(["active", "ongoing"])  # support both
        )
        .order_by(MockSession.created_at.desc())
        .first()
    )

    if not session:
        return None

    return session


# @router.patch("/{session_id}/progress")
# async def update_session_progress(
#     session_id: UUID,
#     payload: SessionProgressUpdate,  # Pydantic model
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     session = db.query(MockSession).filter_by(id=session_id, user_id=current_user.id).first()
#     if not session:
#         raise HTTPException(status_code=404, detail="Session not found")

#     if payload.current_question_index is not None:
#         session.current_question_index = payload.current_question_index

#     if payload.status:
#         session.status = payload.status

#     db.commit()
#     return {"message": "Progress updated"}
