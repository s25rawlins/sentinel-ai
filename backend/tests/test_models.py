"""Tests for database models."""

import pytest
from datetime import datetime
from app.models.policy import Policy, PolicyStatus, PolicySeverity, PolicyCategory, PerformanceMode
from app.models.event import Event
from app.models.violation import Violation


@pytest.mark.unit
@pytest.mark.database
class TestPolicyModel:
    """Test cases for Policy model."""

    def test_create_policy(self, db_session):
        """Test creating a policy with required fields."""
        policy = Policy(
            name="Test Policy",
            definition="Test policy definition",
            category=PolicyCategory.DATA_SECURITY,
            created_by=1
        )
        
        db_session.add(policy)
        db_session.commit()
        db_session.refresh(policy)
        
        assert policy.id is not None
        assert policy.name == "Test Policy"
        assert policy.definition == "Test policy definition"
        assert policy.category == PolicyCategory.DATA_SECURITY
        assert policy.status == PolicyStatus.DRAFT  # Default value
        assert policy.severity == PolicySeverity.MEDIUM  # Default value
        assert policy.performance_mode == PerformanceMode.BALANCED  # Default value
        assert policy.created_at is not None
        assert isinstance(policy.created_at, datetime)

    def test_policy_enums(self, db_session):
        """Test that policy enums work correctly."""
        policy = Policy(
            name="Test Policy",
            definition="Test definition",
            category=PolicyCategory.PRIVACY,
            status=PolicyStatus.OPEN,
            severity=PolicySeverity.HIGH,
            performance_mode=PerformanceMode.ROBUST,
            created_by=1
        )
        
        db_session.add(policy)
        db_session.commit()
        db_session.refresh(policy)
        
        assert policy.category == PolicyCategory.PRIVACY
        assert policy.status == PolicyStatus.OPEN
        assert policy.severity == PolicySeverity.HIGH
        assert policy.performance_mode == PerformanceMode.ROBUST

    def test_policy_cost_metrics(self, db_session):
        """Test policy cost and performance metrics."""
        policy = Policy(
            name="Test Policy",
            definition="Test definition",
            category=PolicyCategory.COMPLIANCE,
            estimated_cost_per_event=150.5,
            estimated_latency_ms=75.2,
            created_by=1
        )
        
        db_session.add(policy)
        db_session.commit()
        db_session.refresh(policy)
        
        assert policy.estimated_cost_per_event == 150.5
        assert policy.estimated_latency_ms == 75.2

    def test_policy_intervention_settings(self, db_session):
        """Test policy intervention configuration."""
        intervention_config = '{"threshold": 0.8, "action": "block"}'
        
        policy = Policy(
            name="Test Policy",
            definition="Test definition",
            category=PolicyCategory.CONTENT_FILTERING,
            intervention_type="block",
            intervention_config=intervention_config,
            created_by=1
        )
        
        db_session.add(policy)
        db_session.commit()
        db_session.refresh(policy)
        
        assert policy.intervention_type == "block"
        assert policy.intervention_config == intervention_config

    def test_policy_string_representations(self):
        """Test string representations of enum values."""
        assert str(PolicyStatus.DRAFT) == "draft"
        assert str(PolicySeverity.CRITICAL) == "critical"
        assert str(PolicyCategory.DATA_SECURITY) == "data_security"
        assert str(PerformanceMode.FAST) == "fast"

    def test_policy_enum_values(self):
        """Test that all enum values are accessible."""
        # PolicyStatus
        assert PolicyStatus.DRAFT == "draft"
        assert PolicyStatus.OPEN == "open"
        assert PolicyStatus.ACKNOWLEDGED == "acknowledged"
        assert PolicyStatus.CLOSED == "closed"
        
        # PolicySeverity
        assert PolicySeverity.LOW == "low"
        assert PolicySeverity.MEDIUM == "medium"
        assert PolicySeverity.HIGH == "high"
        assert PolicySeverity.CRITICAL == "critical"
        
        # PolicyCategory
        assert PolicyCategory.DATA_SECURITY == "data_security"
        assert PolicyCategory.PRIVACY == "privacy"
        assert PolicyCategory.COMPLIANCE == "compliance"
        assert PolicyCategory.GOVERNANCE == "governance"
        assert PolicyCategory.INCIDENT_DETECTION == "incident_detection"
        assert PolicyCategory.CONTENT_FILTERING == "content_filtering"
        
        # PerformanceMode
        assert PerformanceMode.ROBUST == "robust"
        assert PerformanceMode.BALANCED == "balanced"
        assert PerformanceMode.FAST == "fast"


@pytest.mark.unit
@pytest.mark.database
class TestEventModel:
    """Test cases for Event model."""

    def test_create_event(self, db_session):
        """Test creating an event."""
        # First create a policy
        policy = Policy(
            name="Test Policy",
            definition="Test definition",
            category=PolicyCategory.DATA_SECURITY,
            created_by=1
        )
        db_session.add(policy)
        db_session.commit()
        
        # Create an event
        event = Event(
            event_type="text_generation",
            source="test_model",
            content="Test content",
            policy_id=policy.id,
            event_metadata='{"user_id": "test_user"}'
        )
        
        db_session.add(event)
        db_session.commit()
        db_session.refresh(event)
        
        assert event.id is not None
        assert event.event_type == "text_generation"
        assert event.source == "test_model"
        assert event.content == "Test content"
        assert event.policy_id == policy.id
        assert event.created_at is not None


@pytest.mark.unit
@pytest.mark.database
class TestViolationModel:
    """Test cases for Violation model."""

    def test_create_violation(self, db_session):
        """Test creating a violation."""
        # Create a policy
        policy = Policy(
            name="Test Policy",
            definition="Test definition",
            category=PolicyCategory.DATA_SECURITY,
            created_by=1
        )
        db_session.add(policy)
        db_session.commit()
        
        # Create an event
        event = Event(
            event_type="text_generation",
            source="test_model",
            content="Test content",
            policy_id=policy.id
        )
        db_session.add(event)
        db_session.commit()
        
        # Create a violation
        violation = Violation(
            policy_id=policy.id,
            event_id=event.id,
            violation_type="content_violation",
            severity="medium",
            confidence_score=0.85,
            description="Test violation"
        )
        
        db_session.add(violation)
        db_session.commit()
        db_session.refresh(violation)
        
        assert violation.id is not None
        assert violation.policy_id == policy.id
        assert violation.event_id == event.id
        assert violation.violation_type == "content_violation"
        assert violation.severity == "medium"
        assert violation.confidence_score == 0.85
        assert violation.description == "Test violation"
        assert violation.created_at is not None


@pytest.mark.unit
class TestModelRelationships:
    """Test model relationships."""

    def test_policy_event_relationship(self, db_session):
        """Test the relationship between Policy and Event."""
        policy = Policy(
            name="Test Policy",
            definition="Test definition",
            category=PolicyCategory.DATA_SECURITY,
            created_by=1
        )
        db_session.add(policy)
        db_session.commit()
        
        event = Event(
            event_type="test",
            source="test_source",
            content="test content",
            policy_id=policy.id
        )
        db_session.add(event)
        db_session.commit()
        
        # Test relationship access
        db_session.refresh(policy)
        assert len(policy.events) == 1
        assert policy.events[0].id == event.id
        
        db_session.refresh(event)
        assert event.policy.id == policy.id

    def test_policy_violation_relationship(self, db_session):
        """Test the relationship between Policy and Violation."""
        policy = Policy(
            name="Test Policy",
            definition="Test definition",
            category=PolicyCategory.DATA_SECURITY,
            created_by=1
        )
        db_session.add(policy)
        db_session.commit()
        
        event = Event(
            event_type="test",
            source="test_source",
            content="test content",
            policy_id=policy.id
        )
        db_session.add(event)
        db_session.commit()
        
        violation = Violation(
            policy_id=policy.id,
            event_id=event.id,
            violation_type="content_violation",
            severity="low",
            confidence_score=0.5,
            description="Test violation"
        )
        db_session.add(violation)
        db_session.commit()
        
        # Test relationship access
        db_session.refresh(policy)
        assert len(policy.violations) == 1
        assert policy.violations[0].id == violation.id
        
        db_session.refresh(violation)
        assert violation.policy.id == policy.id
