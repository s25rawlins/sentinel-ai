from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base
import enum

class ViolationType(str, enum.Enum):
    DATA_LEAK = "data_leak"
    PROMPT_INJECTION = "prompt_injection"
    POLICY_BREACH = "policy_breach"
    CONTENT_VIOLATION = "content_violation"
    SECURITY_INCIDENT = "security_incident"
    COMPLIANCE_VIOLATION = "compliance_violation"

class ViolationSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class ViolationStatus(str, enum.Enum):
    DETECTED = "detected"
    ACKNOWLEDGED = "acknowledged"
    INVESTIGATING = "investigating"
    RESOLVED = "resolved"
    FALSE_POSITIVE = "false_positive"

class Violation(Base):
    __tablename__ = "violations"

    id = Column(Integer, primary_key=True, index=True)
    violation_type = Column(Enum(ViolationType), nullable=False)
    severity = Column(Enum(ViolationSeverity), nullable=False)
    status = Column(Enum(ViolationStatus), default=ViolationStatus.DETECTED)
    
    # Violation details
    title = Column(String, nullable=True)  # Make nullable for backward compatibility
    description = Column(Text)
    details = Column(Text)  # JSON details about the violation
    confidence_score = Column(Float, default=0.0)  # 0.0 to 1.0
    
    # Evaluation scores
    legal_advice_score = Column(Float)
    controversial_topics_score = Column(Float)
    code_prompt_score = Column(Float)
    safe_prompt_score = Column(Float)
    
    # Relationships
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    policy_id = Column(Integer, ForeignKey("policies.id"), nullable=False)
    acknowledged_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    acknowledged_date = Column(DateTime(timezone=True), nullable=True)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    event = relationship("Event", back_populates="violations")
    policy = relationship("Policy", back_populates="violations")
    acknowledged_user = relationship("User")
