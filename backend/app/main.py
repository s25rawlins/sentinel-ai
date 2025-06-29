from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.base import engine, Base
from app.api import policies, events, dashboard, violations
from app.services.data_seeder import seed_database

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SentinelAI AI Governance Platform",
    description="Real-time AI behavior monitoring and enforcement platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development only - restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(policies.router, prefix="/api/policies", tags=["policies"])
app.include_router(events.router, prefix="/api/events", tags=["events"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(violations.router, prefix="/api/violations", tags=["violations"])

@app.get("/")
def read_root():
    return {
        "message": "SentinelAI AI Governance Platform API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.on_event("startup")
async def startup_event():
    seed_database()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
