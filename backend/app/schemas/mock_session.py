# app/schemas/mock_session.py
from pydantic import BaseModel
from typing import List, Dict, Any, Literal, Optional
from datetime import datetime
import uuid

class MockSessionCreate(BaseModel):
    source_type: str  # 'resume' or 'job_description'
    source_id: uuid.UUID
    session_name: Optional[str] = None
    difficulty_level: str = 'medium'

class Question(BaseModel):
    id: int
    type: str
    question: str
    difficulty: str
    options: Optional[List[str]] = None  # For MCQ

class MockSessionResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    source_type: str
    source_id: uuid.UUID
    practice_mode: Literal["mcq", "qa"] = "mcq"
    session_name: Optional[str]
    questions: List[Dict[str, Any]]
    total_questions: int
    answered_questions: int
    status: str
    difficulty_level: str
    created_at: datetime
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class AnswerSubmission(BaseModel):
    question_index: int
    question_text: str
    question_type: str
    user_answer: str
    time_taken: Optional[int] = None

class UserResponseResponse(BaseModel):
    id: uuid.UUID
    session_id: uuid.UUID
    question_index: int
    question_text: str
    question_type: str
    user_answer: Optional[str]
    is_correct: Optional[str]
    score: Optional[int]
    feedback: Optional[str]
    detailed_feedback: Optional[Dict[str, List[str]]] = None
    time_taken: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True