from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime, timezone
from app.database import get_db
from app.core.auth import get_current_user
from app.models.user import User
from app.models.mock_session import MockSession, UserResponse
from app.schemas.mock_session import AnswerSubmission, UserResponseResponse

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

    # Determine if MCQ grading is possible
    if question.get("type", "mcq") == "mcq":
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
