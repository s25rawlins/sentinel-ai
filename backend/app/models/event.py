from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, Float, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base
import enum

class EventType(str, enum.Enum):
    LLM_REQUEST = "llm_request"
    LLM_RESPONSE = "llm_response"
    POLICY_VIOLATION = "policy_violation"
    INTERVENTION = "intervention"
    SYSTEM_EVENT = "system_event"

class EventSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class EventStatus(str, enum.Enum):
    OPEN = "open"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"
    CLOSED = "closed"

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String, unique=True, index=True, nullable=False)  # External event ID
    event_type = Column(Enum(EventType), nullable=False)
    severity = Column(Enum(EventSeverity), default=EventSeverity.LOW)
    status = Column(Enum(EventStatus), default=EventStatus.OPEN)
    
    # Event details
    title = Column(String, nullable=False)
    description = Column(Text)
    event_data = Column(Text)  # JSON data containing request/response details
    
    # LLM interaction details
    model_name = Column(String)
    request_tokens = Column(Integer)
    response_tokens = Column(Integer)
    completion_reason = Column(String)
    request_temperature = Column(Float)
    request_max_tokens = Column(Integer)
    
    # Timing and performance
    trigger_date = Column(DateTime(timezone=True), nullable=False)
    duration_ms = Column(Float)
    
    # Relationships
    policy_id = Column(Integer, ForeignKey("policies.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    acknowledged_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    acknowledged_date = Column(DateTime(timezone=True), nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    policy = relationship("Policy", back_populates="events")
    user = relationship("User", foreign_keys=[user_id])
    acknowledged_user = relationship("User", foreign_keys=[acknowledged_by])
    violations = relationship("Violation", back_populates="event")
