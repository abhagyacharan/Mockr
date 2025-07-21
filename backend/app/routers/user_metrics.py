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
    # Step 1: Subquery to calculate avg score per session
    session_score_subquery = (
        db.query(
            UserResponse.session_id, func.avg(UserResponse.score).label("session_score")
        )
        .join(MockSession, MockSession.id == UserResponse.session_id)
        .filter(
            MockSession.user_id == current_user.id, MockSession.status == "completed"
        )
        .group_by(UserResponse.session_id)
        .subquery()
    )

    # Step 2: Take average of those session-level averages
    avg_score = db.query(func.avg(session_score_subquery.c.session_score)).scalar()

    best_score = (
        db.query(MockSession, session_score_subquery.c.session_score)
        .join(
            session_score_subquery,
            MockSession.id == session_score_subquery.c.session_id,
        )
        .order_by(session_score_subquery.c.session_score.desc())
        .first()
    )

    best_score_val = round(best_score[1], 2) if best_score else 0

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
            MockSession.user_id == current_user.id, MockSession.status == "completed"
        )
        .scalar()
    )

    resume_sessions_count = (
        db.query(func.count())
        .filter(
            MockSession.user_id == current_user.id,
            MockSession.status == "completed",
            MockSession.source_type == "resume",
        )
        .scalar()
    )

    job_description_sessions_count = (
        db.query(func.count())
        .filter(
            MockSession.user_id == current_user.id,
            MockSession.status == "completed",
            MockSession.source_type == "job_description",
        )
        .scalar()
    )

    questions_practiced = (
        db.query(func.count(UserResponse.id))
        .join(MockSession, MockSession.id == UserResponse.session_id)
        .filter(
            MockSession.status == "completed", MockSession.user_id == current_user.id
        )
        .scalar()
    )

    return {
        "average_score": round(avg_score or 0, 2),
        "best_score": best_score_val,
        "time_spent_minutes": int(total_time_spent // 60) if total_time_spent else 0,
        "completed_sessions_count": completed_sessions_count or 0,
        "practiced_questions_count": questions_practiced or 0,
        "resume_sessions_count": resume_sessions_count or 0,
        "job_description_sessions_count": job_description_sessions_count or 0,
    }
