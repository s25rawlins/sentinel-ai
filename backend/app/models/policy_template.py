from sqlalchemy import Column, Integer, String, Text, Enum
from app.database.base import Base
from app.models.policy import PolicyCategory, PolicySeverity, PerformanceMode

class PolicyTemplate(Base):
    __tablename__ = "policy_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(Enum(PolicyCategory), nullable=False)
    description = Column(Text, nullable=False)
    template_code = Column(Text, nullable=False)
    default_severity = Column(Enum(PolicySeverity), default=PolicySeverity.MEDIUM)
    default_performance_mode = Column(Enum(PerformanceMode), default=PerformanceMode.BALANCED)
    tags = Column(String)  # Comma-separated tags
    is_active = Column(String, default="true")  # Using string for SQLite compatibility
