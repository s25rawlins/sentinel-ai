from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.base import get_db
from app.core.schemas import Policy, PolicyCreate, PolicyUpdate, PolicyTemplate
from app.models.policy import Policy as PolicyModel, PolicyStatus
from app.models.policy_template import PolicyTemplate as PolicyTemplateModel

router = APIRouter()

@router.get("/", response_model=List[Policy])
def get_policies(
    skip: int = 0,
    limit: int = 100,
    status: Optional[PolicyStatus] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all policies with optional filtering"""
    query = db.query(PolicyModel)
    
    if status:
        query = query.filter(PolicyModel.status == status)
    if category:
        query = query.filter(PolicyModel.category == category)
    
    policies = query.offset(skip).limit(limit).all()
    return policies

@router.get("/{policy_id}", response_model=Policy)
def get_policy(policy_id: int, db: Session = Depends(get_db)):
    """Get a specific policy by ID"""
    policy = db.query(PolicyModel).filter(PolicyModel.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy

@router.post("/", response_model=Policy)
def create_policy(policy: PolicyCreate, db: Session = Depends(get_db)):
    """Create a new policy"""
    # Calculate estimated costs based on performance mode
    cost_multipliers = {"fast": 0.5, "balanced": 1.0, "robust": 2.0}
    latency_multipliers = {"fast": 50, "balanced": 100, "robust": 200}
    
    db_policy = PolicyModel(
        **policy.dict(),
        estimated_cost_per_event=240 * cost_multipliers.get(policy.performance_mode, 1.0),
        estimated_latency_ms=latency_multipliers.get(policy.performance_mode, 100),
        created_by=1  # TODO: Get from authenticated user
    )
    
    db.add(db_policy)
    db.commit()
    db.refresh(db_policy)
    return db_policy

@router.put("/{policy_id}", response_model=Policy)
def update_policy(policy_id: int, policy_update: PolicyUpdate, db: Session = Depends(get_db)):
    """Update an existing policy"""
    db_policy = db.query(PolicyModel).filter(PolicyModel.id == policy_id).first()
    if not db_policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    update_data = policy_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_policy, field, value)
    
    db.commit()
    db.refresh(db_policy)
    return db_policy

@router.delete("/{policy_id}")
def delete_policy(policy_id: int, db: Session = Depends(get_db)):
    """Delete a policy"""
    db_policy = db.query(PolicyModel).filter(PolicyModel.id == policy_id).first()
    if not db_policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    db.delete(db_policy)
    db.commit()
    return {"message": "Policy deleted successfully"}

@router.get("/templates/", response_model=List[PolicyTemplate])
def get_policy_templates(db: Session = Depends(get_db)):
    """Get all policy templates"""
    templates = db.query(PolicyTemplateModel).filter(PolicyTemplateModel.is_active == "true").all()
    return templates

@router.post("/{policy_id}/test")
def test_policy(policy_id: int, test_data: dict, db: Session = Depends(get_db)):
    """Test a policy against sample data"""
    policy = db.query(PolicyModel).filter(PolicyModel.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    
    # Simple mock evaluation
    result = {
        "policy_id": policy_id,
        "test_passed": True,
        "confidence_score": 0.85,
        "evaluation_time_ms": 150,
        "violations_detected": 0,
        "details": "Mock evaluation completed successfully"
    }
    
    return result
