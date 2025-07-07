# app/models/job_description.py
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from app.database import Base
import uuid
from datetime import datetime, timezone

class JobDescription(Base):
    __tablename__ = "job_descriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    company = Column(String(255))
    content = Column(Text, nullable=False)
    parsed_data = Column(JSONB)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    # Relationships
    user = relationship("User", back_populates="job_descriptions")