# app/models/mock_session.py
from sqlalchemy import Column, String, DateTime, Integer, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base
import uuid
from datetime import datetime, timezone

class MockSession(Base):
    __tablename__ = "mock_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    source_type = Column(String(50), nullable=False)  # 'resume' or 'job_description'
    source_id = Column(UUID(as_uuid=True), nullable=False)
    session_name = Column(String(255))
    questions = Column(JSONB, nullable=False)
    total_questions = Column(Integer, nullable=False)
    answered_questions = Column(Integer, default=0)
    status = Column(String(50), default='active')  # active, completed, abandoned
    difficulty_level = Column(String(20), default='medium')
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    completed_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="mock_sessions")
    responses = relationship("UserResponse", back_populates="session", cascade="all, delete-orphan")

class UserResponse(Base):
    __tablename__ = "user_responses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("mock_sessions.id"), nullable=False)
    question_index = Column(Integer, nullable=False)
    question_text = Column(String(1000), nullable=False)
    question_type = Column(String(50), nullable=False)
    user_answer = Column(String(5000))
    is_correct = Column(String(20))  # For MCQ: correct/incorrect, For open: good/average/poor
    score = Column(Integer)  # 0-100
    feedback = Column(String(1000))
    time_taken = Column(Integer)  # in seconds
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    session = relationship("MockSession", back_populates="responses")