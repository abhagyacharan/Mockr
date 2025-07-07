# app/models/resume.py
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base
import uuid
from datetime import datetime, timezone

class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    parsed_data = Column(JSONB)
    file_type = Column(String(10), nullable=False)  # pdf, docx, txt
    file_size = Column(String(20))
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    # Relationships
    user = relationship("User", back_populates="resumes")