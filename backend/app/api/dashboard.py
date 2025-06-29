from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.database.base import get_db
from app.core.schemas import DashboardStats, EventSummary
from app.models.policy import Policy as PolicyModel, PolicyStatus
from app.models.event import Event as EventModel, EventSeverity
from app.models.violation import Violation as ViolationModel, ViolationStatus

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total_policies = db.query(PolicyModel).count()
    active_policies = db.query(PolicyModel).filter(PolicyModel.status == PolicyStatus.OPEN).count()
    
    total_events = db.query(EventModel).count()
    
    yesterday = datetime.utcnow() - timedelta(days=1)
    events_last_24h = db.query(EventModel).filter(EventModel.trigger_date >= yesterday).count()
    
    open_violations = db.query(ViolationModel).filter(
        ViolationModel.status.in_([ViolationStatus.DETECTED, ViolationStatus.INVESTIGATING])
    ).count()
    
    critical_violations = db.query(ViolationModel).filter(
        ViolationModel.severity == "critical"
    ).count()
    
    return DashboardStats(
        total_policies=total_policies,
        active_policies=active_policies,
        total_events=total_events,
        open_violations=open_violations,
        events_last_24h=events_last_24h,
        critical_violations=critical_violations
    )

@router.get("/events/timeline")
def get_events_timeline(days: int = 7, db: Session = Depends(get_db)):
    start_date = datetime.utcnow() - timedelta(days=days)
    
    events_by_date = db.query(
        func.date(EventModel.trigger_date).label('date'),
        EventModel.severity,
        func.count(EventModel.id).label('count')
    ).filter(
        EventModel.trigger_date >= start_date
    ).group_by(
        func.date(EventModel.trigger_date),
        EventModel.severity
    ).all()
    
    # Structure data for frontend charting library
    timeline_data = {}
    for event_date, severity, count in events_by_date:
        date_str = event_date.strftime('%Y-%m-%d')
        if date_str not in timeline_data:
            timeline_data[date_str] = {
                'date': date_str,
                'total': 0,
                'severity_breakdown': {
                    'low': 0,
                    'medium': 0,
                    'high': 0,
                    'critical': 0
                }
            }
        
        timeline_data[date_str]['total'] += count
        timeline_data[date_str]['severity_breakdown'][severity] = count
    
    return list(timeline_data.values())

@router.get("/violations/by-category")
def get_violations_by_category(db: Session = Depends(get_db)):
    
    violations_by_type = db.query(
        ViolationModel.violation_type,
        func.count(ViolationModel.id).label('count')
    ).group_by(ViolationModel.violation_type).all()
    
    return [
        {"category": violation_type, "count": count}
        for violation_type, count in violations_by_type
    ]

@router.get("/policies/by-status")
def get_policies_by_status(db: Session = Depends(get_db)):
    
    policies_by_status = db.query(
        PolicyModel.status,
        func.count(PolicyModel.id).label('count')
    ).group_by(PolicyModel.status).all()
    
    return [
        {"status": status, "count": count}
        for status, count in policies_by_status
    ]

@router.get("/recent-activity")
def get_recent_activity(limit: int = 10, db: Session = Depends(get_db)):
    recent_events = db.query(EventModel).order_by(
        EventModel.trigger_date.desc()
    ).limit(limit).all()
    
    recent_violations = db.query(ViolationModel).order_by(
        ViolationModel.created_at.desc()
    ).limit(limit).all()
    
    activities = []
    
    for event in recent_events:
        activities.append({
            "type": "event",
            "id": event.id,
            "title": event.title,
            "severity": event.severity,
            "timestamp": event.trigger_date,
            "status": event.status
        })
    
    for violation in recent_violations:
        activities.append({
            "type": "violation",
            "id": violation.id,
            "title": violation.title,
            "severity": violation.severity,
            "timestamp": violation.created_at,
            "status": violation.status
        })
    
    activities.sort(key=lambda x: x["timestamp"], reverse=True)
    return activities[:limit]

@router.get("/performance-metrics")
def get_performance_metrics(db: Session = Depends(get_db)):
    avg_duration = db.query(func.avg(EventModel.duration_ms)).scalar() or 0
    
    policy_performance = db.query(
        PolicyModel.performance_mode,
        func.avg(PolicyModel.estimated_latency_ms).label('avg_latency'),
        func.avg(PolicyModel.estimated_cost_per_event).label('avg_cost'),
        func.count(PolicyModel.id).label('count')
    ).group_by(PolicyModel.performance_mode).all()
    
    performance_data = []
    for mode, avg_latency, avg_cost, count in policy_performance:
        performance_data.append({
            "mode": mode,
            "avg_latency_ms": round(avg_latency or 0, 2),
            "avg_cost_per_event": round(avg_cost or 0, 4),
            "policy_count": count
        })
    
    return {
        "avg_event_duration_ms": round(avg_duration, 2),
        "policy_performance": performance_data
    }
