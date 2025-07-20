from re import sub
from fastapi import APIRouter, Depends
from sqlalchemy import func, cast, Float
from sqlalchemy.orm import Session
from app.core.auth import get_current_user
from app.database import get_db
from app.models.user import User
from app.models.mock_session import MockSession, UserResponse

router = APIRouter()


@router.get("/")
def get_user_metrics(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    # Average of average scores per session
    avg_score = (
    db.query(func.avg(sub.c.session_score))
    .select_from(
        db.query(
            UserResponse.session_id,
            func.avg(UserResponse.score).label("session_score")
        )
        .join(MockSession, MockSession.id == UserResponse.session_id)
        .filter(MockSession.user_id == current_user.id, MockSession.status == "completed")
        .group_by(UserResponse.session_id)
        .subquery()
    )
    .scalar()
)

    best_score = (
        db.query(
            func.max(
                (MockSession.answered_questions * 100.0) / MockSession.total_questions
            )
        )
        .filter(
            MockSession.user_id == current_user.id, MockSession.status == "completed"
        )
        .scalar()
    )

    total_time_spent = (
        db.query(
            func.sum(
                func.extract("epoch", MockSession.completed_at)
                - func.extract("epoch", MockSession.created_at)
            )
        )
        .filter(
            MockSession.user_id == current_user.id, MockSession.status == "completed"
        )
        .scalar()
    )

    completed_sessions_count = (
        db.query(func.count())
        .filter(
            MockSession.user_id == current_user.id,
            MockSession.status == "completed"
        )
        .scalar()
    )

    return {
        "average_score": round(avg_score or 0, 2),
        "best_score": round(best_score or 0, 2),
        "time_spent_minutes": int(total_time_spent // 60) if total_time_spent else 0,
        "completed_sessions_count": completed_sessions_count or 0,
    }
