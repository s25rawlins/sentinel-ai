from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from app.database.base import get_db
from app.core.schemas import Event, EventCreate, EventUpdate, Violation
from app.models.event import Event as EventModel, EventStatus, EventSeverity
from app.models.violation import Violation as ViolationModel
import json
import asyncio

router = APIRouter()

# WebSocket connection manager for real-time events
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove disconnected connections
                self.active_connections.remove(connection)

manager = ConnectionManager()

@router.get("/", response_model=List[Event])
def get_events(
    skip: int = 0,
    limit: int = 100,
    status: Optional[EventStatus] = None,
    severity: Optional[EventSeverity] = None,
    law_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get all events with optional filtering"""
    query = db.query(EventModel)
    
    if status:
        query = query.filter(EventModel.status == status)
    if severity:
        query = query.filter(EventModel.severity == severity)
    if law_id:
        query = query.filter(EventModel.law_id == law_id)
    
    events = query.order_by(EventModel.trigger_date.desc()).offset(skip).limit(limit).all()
    return events

@router.get("/{event_id}", response_model=Event)
def get_event(event_id: int, db: Session = Depends(get_db)):
    """Get a specific event by ID"""
    event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.post("/", response_model=Event)
async def create_event(event: EventCreate, db: Session = Depends(get_db)):
    """Create a new event"""
    db_event = EventModel(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    # Broadcast new event to WebSocket connections
    event_data = {
        "type": "new_event",
        "event": {
            "id": db_event.id,
            "event_id": db_event.event_id,
            "title": db_event.title,
            "severity": db_event.severity,
            "status": db_event.status,
            "trigger_date": db_event.trigger_date.isoformat()
        }
    }
    await manager.broadcast(json.dumps(event_data))
    
    return db_event

@router.put("/{event_id}", response_model=Event)
async def update_event(event_id: int, event_update: EventUpdate, db: Session = Depends(get_db)):
    """Update an existing event"""
    db_event = db.query(EventModel).filter(EventModel.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    update_data = event_update.dict(exclude_unset=True)
    
    # Handle acknowledgment
    if "acknowledged_by" in update_data:
        update_data["acknowledged_date"] = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(db_event, field, value)
    
    db.commit()
    db.refresh(db_event)
    
    # Broadcast event update
    event_data = {
        "type": "event_updated",
        "event": {
            "id": db_event.id,
            "status": db_event.status,
            "acknowledged_by": db_event.acknowledged_by
        }
    }
    await manager.broadcast(json.dumps(event_data))
    
    return db_event

@router.get("/{event_id}/violations", response_model=List[Violation])
def get_event_violations(event_id: int, db: Session = Depends(get_db)):
    """Get all violations for a specific event"""
    violations = db.query(ViolationModel).filter(ViolationModel.event_id == event_id).all()
    return violations

@router.get("/stats/summary")
def get_event_stats(db: Session = Depends(get_db)):
    """Get event statistics summary"""
    total_events = db.query(EventModel).count()
    open_events = db.query(EventModel).filter(EventModel.status == EventStatus.OPEN).count()
    
    # Events in last 24 hours
    yesterday = datetime.utcnow() - timedelta(days=1)
    events_24h = db.query(EventModel).filter(EventModel.trigger_date >= yesterday).count()
    
    # Critical events
    critical_events = db.query(EventModel).filter(EventModel.severity == EventSeverity.CRITICAL).count()
    
    return {
        "total_events": total_events,
        "open_events": open_events,
        "events_last_24h": events_24h,
        "critical_events": critical_events
    }

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time event updates"""
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
