"""Pytest configuration and fixtures."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database.base import Base, get_db


# Create test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="session")
def db_engine():
    """Create test database engine."""
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session(db_engine):
    """Create a fresh database session for each test."""
    connection = db_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session):
    """Create test client with database override."""
    app.dependency_overrides[get_db] = lambda: db_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def sample_policy_data():
    """Sample policy data for testing."""
    return {
        "name": "Test Policy",
        "definition": "A test policy for unit testing",
        "category": "content_filtering",
        "performance_mode": "balanced"
    }


@pytest.fixture
def sample_event_data():
    """Sample event data for testing."""
    return {
        "event_type": "text_generation",
        "source": "test_model",
        "content": "This is a test message",
        "metadata": {"user_id": "test_user", "session_id": "test_session"},
        "timestamp": "2024-01-01T00:00:00Z"
    }


@pytest.fixture
def sample_violation_data():
    """Sample violation data for testing."""
    return {
        "policy_id": 1,
        "event_id": 1,
        "violation_type": "content_policy",
        "severity": "medium",
        "confidence_score": 0.85,
        "description": "Test violation description",
        "metadata": {"rule_triggered": "profanity_filter"}
    }
