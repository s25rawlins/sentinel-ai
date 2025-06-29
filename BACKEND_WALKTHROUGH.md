# Sentinel AI Backend Code Walkthrough

## Overview

The Sentinel AI backend is a FastAPI-based Python application that provides a comprehensive AI governance and monitoring platform. It manages policies, events, violations, and provides real-time monitoring capabilities for AI systems.

## Architecture

### Technology Stack
- **Framework**: FastAPI 0.104.1 (Modern Python web framework)
- **Database**: SQLAlchemy 2.0.23 ORM with SQLite (development)
- **API Documentation**: Automatic OpenAPI/Swagger documentation
- **CORS**: Enabled for cross-origin requests
- **Real-time**: WebSocket support for live updates
- **Authentication**: Python-JOSE with cryptography support
- **Password Hashing**: Passlib with bcrypt
- **HTTP Client**: HTTPX for external API calls
- **File Handling**: Aiofiles for async file operations

### Project Structure
```
backend/
├── app/
│   ├── main.py              # Application entry point
│   ├── api/                 # API route handlers
│   │   ├── dashboard.py     # Dashboard statistics endpoints
│   │   ├── events.py        # Event management endpoints
│   │   ├── policies.py      # Policy management endpoints
│   │   └── violations.py    # Violation management endpoints
│   ├── core/
│   │   └── schemas.py       # Pydantic data models
│   ├── database/
│   │   └── base.py          # Database configuration
│   ├── models/              # SQLAlchemy database models
│   │   ├── event.py         # Event data model
│   │   ├── policy.py        # Policy data model
│   │   ├── policy_template.py  # Policy template model
│   │   ├── user.py          # User data model
│   │   └── violation.py     # Violation data model
│   └── services/
│       └── data_seeder.py   # Database seeding utilities
├── requirements.txt         # Python dependencies
└── alembic/                # Database migrations
```

## Core Components

### 1. Application Entry Point (main.py)

The main application file sets up the FastAPI application with all necessary configurations:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.base import engine, Base
from app.api import policies, events, dashboard, violations
from app.services.data_seeder import seed_database

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SentinelAI AI Governance Platform",
    description="Real-time AI behavior monitoring and enforcement platform",
    version="1.0.0"
)
```

**Key Features:**
- **CORS Configuration**: Allows cross-origin requests for frontend integration
- **Router Integration**: Includes all API routers with proper prefixes
- **Database Initialization**: Creates tables on startup
- **Health Checks**: Provides `/health` endpoint for monitoring
- **Data Seeding**: Automatically seeds database with initial data

### 2. Data Models

#### Policy Model (models/policy.py)

The Policy model represents governance rules and policies:

```python
class Policy(Base):
    __tablename__ = "policies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    definition = Column(Text, nullable=False)
    category = Column(Enum(PolicyCategory), nullable=False)
    status = Column(Enum(PolicyStatus), default=PolicyStatus.DRAFT)
    severity = Column(Enum(PolicySeverity), default=PolicySeverity.MEDIUM)
    performance_mode = Column(Enum(PerformanceMode), default=PerformanceMode.BALANCED)
```

**Key Features:**
- **Categories**: Data security, privacy, compliance, governance, etc.
- **Status Management**: Draft, open, acknowledged, closed
- **Severity Levels**: Low, medium, high, critical
- **Performance Modes**: Robust, balanced, fast
- **Cost Tracking**: Estimated cost per event and latency metrics
- **Intervention Types**: Notification, block, redact capabilities

#### Event Model (models/event.py)

Events represent activities or incidents in the AI system:

```python
class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String, unique=True, nullable=False, index=True)
    event_type = Column(Enum(EventType), nullable=False)
    severity = Column(Enum(EventSeverity), default=EventSeverity.LOW)
    title = Column(String, nullable=False)
    description = Column(Text)
    event_data = Column(Text)  # JSON data
    trigger_date = Column(DateTime(timezone=True), nullable=False)
```

**Key Features:**
- **Event Types**: User interaction, system alert, policy trigger, etc.
- **Severity Classification**: Low, medium, high, critical
- **Status Tracking**: Open, acknowledged, investigating, resolved
- **Relationships**: Links to policies and users
- **Audit Trail**: Creation and update timestamps

#### Violation Model (models/violation.py)

Violations represent breaches of laws or policies:

```python
class Violation(Base):
    __tablename__ = "violations"
    
    id = Column(Integer, primary_key=True, index=True)
    violation_type = Column(Enum(ViolationType), nullable=False)
    severity = Column(Enum(ViolationSeverity), nullable=False)
    status = Column(Enum(ViolationStatus), default=ViolationStatus.DETECTED)
    title = Column(String, nullable=False)
    description = Column(Text)
    confidence_score = Column(Float, default=0.0)
```

**Key Features:**
- **Violation Types**: Data leak, prompt injection, policy breach, etc.
- **Confidence Scoring**: ML-based confidence levels (0.0 to 1.0)
- **Evaluation Scores**: Legal advice, controversial topics, code prompts
- **Acknowledgment System**: User acknowledgment tracking
- **Relationships**: Links to events and policies

### 3. API Endpoints

#### Violations API (api/violations.py)

Manages violation lifecycle and provides statistics:

```python
@router.get("/", response_model=List[Violation])
def get_violations(
    skip: int = 0,
    limit: int = 100,
    status: Optional[ViolationStatus] = None,
    severity: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all violations with optional filtering"""
    query = db.query(ViolationModel)
    
    if status:
        query = query.filter(ViolationModel.status == status)
    if severity:
        query = query.filter(ViolationModel.severity == severity)
    
    violations = query.order_by(ViolationModel.created_at.desc()).offset(skip).limit(limit).all()
    return violations
```

**Key Endpoints:**
- `GET /api/violations/` - List violations with filtering
- `GET /api/violations/{id}` - Get specific violation
- `PUT /api/violations/{id}` - Update violation status
- `GET /api/violations/stats/summary` - Get violation statistics

#### Dashboard API (api/dashboard.py)

Provides aggregated statistics and metrics for the dashboard:

**Key Endpoints:**
- `GET /api/dashboard/stats` - Overall system statistics
- `GET /api/dashboard/events/timeline` - Events over time
- `GET /api/dashboard/recent-activity` - Recent system activity
- `GET /api/dashboard/performance-metrics` - System performance data
- `GET /api/dashboard/violations/by-category` - Violation categorization
- `GET /api/dashboard/policies/by-status` - Policy status distribution

### 4. Data Schemas (core/schemas.py)

Pydantic models define the API contract and data validation:

```python
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

class Violation(ViolationBase):
    id: int
    status: ViolationStatus
    event_id: int
    policy_id: int
    acknowledged_by: Optional[int] = None
    acknowledged_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
```

**Key Features:**
- **Input Validation**: Automatic validation of request data
- **Type Safety**: Strong typing for all API operations
- **Documentation**: Automatic API documentation generation
- **Serialization**: Consistent JSON serialization

### 5. Database Configuration (database/base.py)

Manages database connections and session handling:

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "sqlite:///./sentinel_ai.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

## Key Features

### 1. Real-time Monitoring
- WebSocket connections for live updates
- Event streaming capabilities
- Real-time violation detection

### 2. Comprehensive Governance
- Policy definition and management
- Policy enforcement mechanisms
- Compliance tracking and reporting

### 3. Advanced Analytics
- Performance metrics tracking
- Cost analysis per event
- Trend analysis and reporting

### 4. Security & Compliance
- User authentication and authorization
- Audit trails for all operations
- Data privacy and security controls

### 5. Scalability
- Efficient database queries with pagination
- Optimized API endpoints
- Configurable performance modes

## API Documentation

The backend automatically generates comprehensive API documentation available at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Database Schema

The application uses a relational database with the following key relationships:
- **Users** create and manage **Policies**
- **Events** are monitored against **Policies**
- **Violations** are generated when **Events** breach **Policies**
- **Policy Templates** provide reusable policy definitions

## Error Handling

The API implements comprehensive error handling:
- **404 Not Found**: For non-existent resources
- **422 Validation Error**: For invalid input data
- **500 Internal Server Error**: For system errors
- **401 Unauthorized**: For authentication failures

## Performance Considerations

- **Database Indexing**: Strategic indexes on frequently queried fields
- **Pagination**: All list endpoints support pagination
- **Caching**: Potential for Redis caching implementation
- **Query Optimization**: Efficient SQLAlchemy queries with proper joins

## Deployment

The backend can be deployed using:
- **Docker**: Containerized deployment
- **Uvicorn**: ASGI server for production
- **Gunicorn**: Multi-worker deployment
- **Cloud Platforms**: AWS, GCP, Azure compatible

## Security Features

- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Pydantic model validation
- **SQL Injection Protection**: SQLAlchemy ORM protection
- **Authentication Ready**: Token-based auth infrastructure
