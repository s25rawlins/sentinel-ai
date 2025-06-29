from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import uuid
from app.database.base import SessionLocal
from app.models.user import User, UserRole
from app.models.policy import Policy, PolicyStatus, PolicySeverity, PolicyCategory, PerformanceMode
from app.models.event import Event, EventType, EventSeverity, EventStatus
from app.models.violation import Violation, ViolationType, ViolationSeverity, ViolationStatus
from app.models.policy_template import PolicyTemplate

def seed_database():
    """Seed the database with initial sample data"""
    db = SessionLocal()
    
    try:
        if db.query(User).count() > 0:
            return  # Data already seeded
        
        users = [
            User(
                username="admin",
                email="admin@sentinelai.ai",
                hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",  # Password: "secret"
                role=UserRole.ADMIN
            ),
            User(
                username="jimmy.sanchez",
                email="jimmy@sentinelai.ai",
                hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                role=UserRole.ANALYST
            ),
            User(
                username="george.torres",
                email="george@sentinelai.ai",
                hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                role=UserRole.ANALYST
            ),
            User(
                username="clarence.bell",
                email="clarence@sentinelai.ai",
                hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
                role=UserRole.VIEWER
            )
        ]
        
        for user in users:
            db.add(user)
        db.commit()
        
        policy_templates = [
            PolicyTemplate(
                name="Prompt Injection Prevention",
                category=PolicyCategory.DATA_SECURITY,
                description="Protect against malicious attempts to manipulate the LLM via prompt injection.",
                template_code="response.completion has sentinelai.sunshine_acceptable_use_violation and scope.app is Sunshine",
                default_severity=PolicySeverity.MEDIUM,
                tags="injection,manipulation,security"
            ),
            PolicyTemplate(
                name="Data Leakage Prevention",
                category=PolicyCategory.PRIVACY,
                description="Prevent unauthorized exposure and leakage of sensitive data.",
                template_code="response.completion has sentinelai.data_leakage and scope.app is DataApp",
                default_severity=PolicySeverity.HIGH,
                tags="leakage,data protection,unauthorized access"
            ),
            PolicyTemplate(
                name="Legal Compliance Monitoring",
                category=PolicyCategory.COMPLIANCE,
                description="Ensure compliance with relevant laws and regulations.",
                template_code="response.completion has sentinelai.legal_compliance and scope.app is LegalBot",
                default_severity=PolicySeverity.HIGH,
                tags="legal compliance,monitoring,regulation"
            ),
            PolicyTemplate(
                name="Intellectual Property Protection",
                category=PolicyCategory.GOVERNANCE,
                description="Safeguard intellectual property in LLM outputs.",
                template_code="response.completion has sentinelai.ip_protection and scope.app is IPGuard",
                default_severity=PolicySeverity.MEDIUM,
                tags="IP protection,intellectual property,copyright"
            )
        ]
        
        for template in policy_templates:
            db.add(template)
        db.commit()
        
        policies = [
            Policy(
                name="Sunshine Acceptable Use Policy",
                definition="response.completion has sentinelai.sunshine_acceptable_use_violation and scope.app is Sunshine",
                category=PolicyCategory.DATA_SECURITY,
                status=PolicyStatus.OPEN,
                severity=PolicySeverity.LOW,
                performance_mode=PerformanceMode.BALANCED,
                estimated_cost_per_event=240.0,
                estimated_latency_ms=100.0,
                intervention_type="notification",
                created_by=1
            ),
            Policy(
                name="Legal Compliance Monitoring Policy",
                definition="response.completion has sentinelai.legal_compliance and scope.app is LegalBot",
                category=PolicyCategory.COMPLIANCE,
                status=PolicyStatus.OPEN,
                severity=PolicySeverity.LOW,
                performance_mode=PerformanceMode.BALANCED,
                estimated_cost_per_event=240.0,
                estimated_latency_ms=100.0,
                intervention_type="notification",
                created_by=2
            ),
            Policy(
                name="Incident Detection and Response Policy",
                definition="response.completion has sentinelai.incident_detection and scope.app is SecurityBot",
                category=PolicyCategory.INCIDENT_DETECTION,
                status=PolicyStatus.ACKNOWLEDGED,
                severity=PolicySeverity.MEDIUM,
                performance_mode=PerformanceMode.ROBUST,
                estimated_cost_per_event=480.0,
                estimated_latency_ms=200.0,
                intervention_type="block",
                created_by=2
            ),
            Policy(
                name="Prompt Injection Prevention Policy",
                definition="response.completion has sentinelai.prompt_injection and scope.app is ChatBot",
                category=PolicyCategory.DATA_SECURITY,
                status=PolicyStatus.OPEN,
                severity=PolicySeverity.MEDIUM,
                performance_mode=PerformanceMode.BALANCED,
                estimated_cost_per_event=240.0,
                estimated_latency_ms=100.0,
                intervention_type="redact",
                created_by=1
            ),
            Policy(
                name="Governance Policy Enforcement Policy",
                definition="response.completion has sentinelai.governance_policy and scope.app is PolicyBot",
                category=PolicyCategory.GOVERNANCE,
                status=PolicyStatus.ACKNOWLEDGED,
                severity=PolicySeverity.MEDIUM,
                performance_mode=PerformanceMode.BALANCED,
                estimated_cost_per_event=240.0,
                estimated_latency_ms=100.0,
                intervention_type="notification",
                created_by=3
            ),
            Policy(
                name="Intellectual Property Protection Policy",
                definition="response.completion has sentinelai.ip_protection and scope.app is ContentBot",
                category=PolicyCategory.GOVERNANCE,
                status=PolicyStatus.OPEN,
                severity=PolicySeverity.LOW,
                performance_mode=PerformanceMode.FAST,
                estimated_cost_per_event=120.0,
                estimated_latency_ms=50.0,
                intervention_type="notification",
                created_by=4
            ),
            Policy(
                name="Security and Data Protection Policy",
                definition="response.completion has sentinelai.data_protection and scope.app is DataBot",
                category=PolicyCategory.PRIVACY,
                status=PolicyStatus.OPEN,
                severity=PolicySeverity.LOW,
                performance_mode=PerformanceMode.BALANCED,
                estimated_cost_per_event=240.0,
                estimated_latency_ms=100.0,
                intervention_type="notification",
                created_by=4
            ),
            Policy(
                name="Data Leakage Prevention Policy",
                definition="response.completion has sentinelai.data_leakage and scope.app is SecureBot",
                category=PolicyCategory.PRIVACY,
                status=PolicyStatus.OPEN,
                severity=PolicySeverity.LOW,
                performance_mode=PerformanceMode.BALANCED,
                estimated_cost_per_event=240.0,
                estimated_latency_ms=100.0,
                intervention_type="block",
                created_by=1
            ),
            Policy(
                name="CSR Compliance Policy",
                definition="response.completion has sentinelai.csr_compliance and scope.app is CSRBot",
                category=PolicyCategory.COMPLIANCE,
                status=PolicyStatus.OPEN,
                severity=PolicySeverity.LOW,
                performance_mode=PerformanceMode.BALANCED,
                estimated_cost_per_event=240.0,
                estimated_latency_ms=100.0,
                intervention_type="notification",
                created_by=3
            ),
            Policy(
                name="Data Minimization Policy",
                definition="response.completion has sentinelai.data_minimization and scope.app is MinimalBot",
                category=PolicyCategory.PRIVACY,
                status=PolicyStatus.ACKNOWLEDGED,
                severity=PolicySeverity.MEDIUM,
                performance_mode=PerformanceMode.BALANCED,
                estimated_cost_per_event=240.0,
                estimated_latency_ms=100.0,
                intervention_type="redact",
                created_by=2
            )
        ]
        
        for policy in policies:
            db.add(policy)
        db.commit()
        
        base_time = datetime.utcnow()
        events = []
        
        for i in range(50):
            event_time = base_time - timedelta(
                days=random.randint(0, 30),
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59)
            )
            
            event = Event(
                event_id=f"evt_{uuid.uuid4().hex[:8]}",
                event_type=random.choice(list(EventType)),
                severity=random.choice(list(EventSeverity)),
                status=random.choice(list(EventStatus)),
                title=f"Event {i+1}: {random.choice(['Policy Violation', 'Data Leak', 'Prompt Injection', 'Compliance Issue'])}",
                description=f"Automated detection of potential issue in AI interaction {i+1}",
                trigger_date=event_time,
                policy_id=random.choice([policy.id for policy in policies]),
                user_id=random.choice([user.id for user in users]),
                model_name=random.choice(["gpt-3.5-turbo-0125", "gpt-4", "claude-3"]),
                request_tokens=random.randint(50, 500),
                response_tokens=random.randint(20, 200),
                duration_ms=random.uniform(50, 300)
            )
            events.append(event)
        
        for event in events:
            db.add(event)
        db.commit()
        
        violations = []
        for i, event in enumerate(events[:20]):  # Only first 20 events to keep demo data manageable
            violation = Violation(
                violation_type=random.choice(list(ViolationType)),
                severity=random.choice(list(ViolationSeverity)),
                status=random.choice(list(ViolationStatus)),
                title=f"Violation {i+1}: {event.title}",
                description=f"Policy violation detected in event {event.event_id}",
                confidence_score=random.uniform(0.6, 0.95),
                event_id=event.id,
                policy_id=event.policy_id,
                legal_advice_score=random.uniform(0.1, 0.9),
                controversial_topics_score=random.uniform(0.1, 0.8),
                code_prompt_score=random.uniform(0.1, 0.7),
                safe_prompt_score=random.uniform(0.2, 0.9)
            )
            violations.append(violation)
        
        for violation in violations:
            db.add(violation)
        db.commit()
        
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()
