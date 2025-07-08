from pydantic import BaseModel
from pydantic.networks import EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.user import UserRole
from app.models.policy import PolicyStatus, PolicySeverity, PolicyCategory, PerformanceMode
from app.models.event import EventType, EventSeverity, EventStatus
from app.models.violation import ViolationType, ViolationSeverity, ViolationStatus

class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: UserRole = UserRole.VIEWER

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PolicyBase(BaseModel):
    name: str
    definition: str
    category: PolicyCategory
    severity: PolicySeverity = PolicySeverity.MEDIUM
    performance_mode: PerformanceMode = PerformanceMode.BALANCED
    intervention_type: str = "notification"
    intervention_config: Optional[str] = None

class PolicyCreate(PolicyBase):
    pass

class PolicyUpdate(BaseModel):
    name: Optional[str] = None
    definition: Optional[str] = None
    category: Optional[PolicyCategory] = None
    status: Optional[PolicyStatus] = None
    severity: Optional[PolicySeverity] = None
    performance_mode: Optional[PerformanceMode] = None
    intervention_type: Optional[str] = None
    intervention_config: Optional[str] = None

class Policy(PolicyBase):
    id: int
    status: PolicyStatus
    estimated_cost_per_event: float
    estimated_latency_ms: float
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class EventBase(BaseModel):
    event_id: str
    event_type: EventType
    severity: EventSeverity = EventSeverity.LOW
    title: str
    description: Optional[str] = None
    event_data: Optional[str] = None
    trigger_date: datetime

class EventCreate(EventBase):
    policy_id: Optional[int] = None
    user_id: Optional[int] = None

class EventUpdate(BaseModel):
    status: Optional[EventStatus] = None
    acknowledged_by: Optional[int] = None

class Event(EventBase):
    id: int
    status: EventStatus
    policy_id: Optional[int] = None
    user_id: Optional[int] = None
    acknowledged_by: Optional[int] = None
    acknowledged_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ViolationBase(BaseModel):
    violation_type: ViolationType
    severity: ViolationSeverity
    title: str
    description: Optional[str] = None
    details: Optional[str] = None
    confidence_score: float = 0.0

class ViolationCreate(ViolationBase):
    event_id: int
    policy_id: int

class ViolationUpdate(BaseModel):
    status: Optional[ViolationStatus] = None
    acknowledged_by: Optional[int] = None

class Violation(ViolationBase):
    id: int
    status: ViolationStatus
    event_id: int
    policy_id: int
    acknowledged_by: Optional[int] = None
    acknowledged_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class PolicyTemplateBase(BaseModel):
    name: str
    category: PolicyCategory
    description: str
    template_code: str
    default_severity: PolicySeverity = PolicySeverity.MEDIUM
    default_performance_mode: PerformanceMode = PerformanceMode.BALANCED
    tags: Optional[str] = None

class PolicyTemplateCreate(PolicyTemplateBase):
    pass

class PolicyTemplate(PolicyTemplateBase):
    id: int
    is_active: str

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_policies: int
    active_policies: int
    total_events: int
    open_violations: int
    events_last_24h: int
    critical_violations: int

class EventSummary(BaseModel):
    date: str
    count: int
    severity_breakdown: dict

# Authentication Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True
