import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone
from app.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.resume import Resume
from app.models.mock_session import MockSession, UserResponse
from app.schemas.mock_session import AnswerSubmission, UserResponseResponse
from app.services.llm_grader import LLMGrader
from app.models.job_description import JobDescription

router = APIRouter()

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
