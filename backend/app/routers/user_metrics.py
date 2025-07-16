from fastapi import APIRouter, Depends
from sqlalchemy import func, cast, Float
from sqlalchemy.orm import Session
from app.core.auth import get_current_user
from app.database import get_db
from app.models.user import User
from app.models.mock_session import MockSession

router = APIRouter()


@router.get("/")
def get_user_metrics(
    db: Session = Depends(get_db), current_user: User = Depends(get_current_user)
):
    avg_score = (
        db.query(
            func.avg(
                cast(
                    MockSession.answered_questions
                    * 100.0
                    / MockSession.total_questions,
                    Float,
                )
            )
        )
        .filter(
            MockSession.user_id == current_user.id,
            MockSession.status == "completed",
            MockSession.total_questions > 0,
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

    return {
        "average_score": round(avg_score or 0, 2),
        "best_score": round(best_score or 0, 2),
        "time_spent_minutes": int(total_time_spent // 60) if total_time_spent else 0,
    }
