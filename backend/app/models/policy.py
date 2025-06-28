from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, ForeignKey, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database.base import Base
import enum

class PolicyStatus(str, enum.Enum):
    DRAFT = "draft"
    OPEN = "open"
    ACKNOWLEDGED = "acknowledged"
    CLOSED = "closed"
    
    def __str__(self):
        return self.value

class PolicySeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"
    
    def __str__(self):
        return self.value

class PolicyCategory(str, enum.Enum):
    DATA_SECURITY = "data_security"
    PRIVACY = "privacy"
    COMPLIANCE = "compliance"
    GOVERNANCE = "governance"
    INCIDENT_DETECTION = "incident_detection"
    CONTENT_FILTERING = "content_filtering"
    
    def __str__(self):
        return self.value

class PerformanceMode(str, enum.Enum):
    ROBUST = "robust"
    BALANCED = "balanced"
    FAST = "fast"
    
    def __str__(self):
        return self.value

class Policy(Base):
    __tablename__ = "policies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    definition = Column(Text, nullable=False)
    category = Column(Enum(PolicyCategory), nullable=False)
    status = Column(Enum(PolicyStatus), default=PolicyStatus.DRAFT)
    severity = Column(Enum(PolicySeverity), default=PolicySeverity.MEDIUM)
    performance_mode = Column(Enum(PerformanceMode), default=PerformanceMode.BALANCED)
    
    # Cost and performance metrics
    estimated_cost_per_event = Column(Float, default=0.0)
    estimated_latency_ms = Column(Float, default=0.0)
    
    # Intervention settings
    intervention_type = Column(String, default="notification")  # notification, block, redact
    intervention_config = Column(Text)  # JSON config for interventions
    
    # Metadata
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    creator = relationship("User", back_populates="created_policies")
    events = relationship("Event", back_populates="policy")
    violations = relationship("Violation", back_populates="policy")

# Add back reference to User model
from app.models.user import User
User.created_policies = relationship("Policy", back_populates="creator")
