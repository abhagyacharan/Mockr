# app/schemas/resume.py
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

class ResumeResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    filename: str
    original_filename: str
    file_type: str
    file_size: Optional[str]
    parsed_data: Optional[Dict[str, Any]]
    created_at: datetime
    
    class Config:
        orm_mode = True

class ResumeCreate(BaseModel):
    content: str
    parsed_data: Optional[Dict[str, Any]] = None