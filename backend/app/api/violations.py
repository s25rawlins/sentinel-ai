from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.base import get_db
from app.core.schemas import Violation, ViolationUpdate
from app.models.violation import Violation as ViolationModel, ViolationStatus

router = APIRouter()

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

@router.get("/{violation_id}", response_model=Violation)
def get_violation(violation_id: int, db: Session = Depends(get_db)):
    """Get a specific violation by ID"""
    violation = db.query(ViolationModel).filter(ViolationModel.id == violation_id).first()
    if not violation:
        raise HTTPException(status_code=404, detail="Violation not found")
    return violation

@router.put("/{violation_id}", response_model=Violation)
def update_violation(violation_id: int, violation_update: ViolationUpdate, db: Session = Depends(get_db)):
    """Update an existing violation"""
    db_violation = db.query(ViolationModel).filter(ViolationModel.id == violation_id).first()
    if not db_violation:
        raise HTTPException(status_code=404, detail="Violation not found")
    
    update_data = violation_update.dict(exclude_unset=True)
    
    # Handle acknowledgment
    if "acknowledged_by" in update_data:
        from datetime import datetime
        update_data["acknowledged_date"] = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(db_violation, field, value)
    
    db.commit()
    db.refresh(db_violation)
    return db_violation

@router.get("/stats/summary")
def get_violation_stats(db: Session = Depends(get_db)):
    """Get violation statistics summary"""
    total_violations = db.query(ViolationModel).count()
    open_violations = db.query(ViolationModel).filter(
        ViolationModel.status.in_([ViolationStatus.DETECTED, ViolationStatus.INVESTIGATING])
    ).count()
    
    # Violations by severity
    critical_violations = db.query(ViolationModel).filter(ViolationModel.severity == "critical").count()
    high_violations = db.query(ViolationModel).filter(ViolationModel.severity == "high").count()
    
    return {
        "total_violations": total_violations,
        "open_violations": open_violations,
        "critical_violations": critical_violations,
        "high_violations": high_violations
    }
