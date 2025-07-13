# app/schemas/job_description.py
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import uuid

class JobDescriptionCreate(BaseModel):
    title: str
    company: Optional[str] = None
    content: str

class JobDescriptionResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    title: str
    company: Optional[str]
    content: str
    parsed_data: Optional[Dict[str, Any]]
    created_at: datetime
    
    class Config:
        from_attributes = True