# SentinelAI AI Governance Platform

A complete working prototype of an AI governance and monitoring platform inspired by SentinelAI, built with Python/FastAPI backend and React frontend.

## Features

### Dashboard
- Real-time statistics (Total Policies, Active Policies, Events, Violations)
- Recent activity feed with severity indicators
- Clean, professional UI matching SentinelAI design

### Policies Management
- Complete CRUD operations for governance policies
- Policy categories: Data Security, Privacy, Compliance, Governance, Incident Detection
- Status tracking: Draft, Open, Acknowledged, Closed
- Severity levels: Low, Medium, High, Critical
- Performance modes: Fast, Balanced, Robust

### Events Monitoring
- Real-time event tracking with unique event IDs
- Event types: LLM Request/Response, Policy Violations, Interventions
- Comprehensive event details with timestamps
- Status management and acknowledgment workflow

### Backend API
- FastAPI with automatic OpenAPI documentation
- SQLAlchemy ORM with SQLite database
- Real-time WebSocket support for live updates
- Comprehensive data models and relationships
- Sample data seeding for demonstration

### Frontend Interface
- React-based single-page application
- Responsive design with Tailwind CSS
- Real-time data fetching and display
- Professional SentinelAI-inspired UI/UX

## Architecture

```
sentinelai-platform/
├── backend/                 # Python/FastAPI Backend
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   ├── models/         # SQLAlchemy database models
│   │   ├── core/           # Pydantic schemas
│   │   ├── services/       # Business logic and data seeding
│   │   ├── database/       # Database configuration
│   │   └── main.py         # FastAPI application entry point
│   ├── requirements.txt    # Python dependencies
│   └── venv/              # Virtual environment
└── frontend/
    └── index.html         # React frontend application
```

## Technology Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations
- **SQLite** - Lightweight database for development
- **Uvicorn** - ASGI server implementation

### Frontend
- **React 18** - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **Font Awesome** - Icon library
- **Babel** - JavaScript compiler for JSX transformation

## Getting Started

### Prerequisites
- Python 3.12+
- Modern web browser

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd sentinelai-platform/backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   pip install email-validator
   ```

4. **Start the server:**
   ```bash
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Open the frontend:**
   ```bash
   # Open in browser
   open sentinelai-platform/frontend/index.html
   # Or navigate to: file:///path/to/sentinelai-platform/frontend/index.html
   ```

## Sample Data

The application comes pre-loaded with realistic sample data:

- **10 Governance Policies** across different categories
- **50 AI Events** with various severity levels
- **20 Policy Violations** with detailed tracking
- **4 Sample Users** with different roles

## API Endpoints

### Core APIs
- `GET /` - API information
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation

### Policies
- `GET /api/policies/` - List all policies
- `POST /api/policies/` - Create new policy
- `GET /api/policies/{id}` - Get specific policy
- `PUT /api/policies/{id}` - Update policy
- `DELETE /api/policies/{id}` - Delete policy

### Events
- `GET /api/events/` - List all events
- `POST /api/events/` - Create new event
- `GET /api/events/{id}` - Get specific event
- `PUT /api/events/{id}` - Update event
- `WebSocket /api/events/ws` - Real-time event updates

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/recent-activity` - Recent activity feed
- `GET /api/dashboard/events/timeline` - Event timeline data

## Key Features Demonstrated

### 1. Real-time Monitoring
- Live dashboard with actual data from backend
- WebSocket support for real-time updates
- Event tracking with timestamps and severity

### 2. Governance Policies
- Comprehensive policy management system
- Multiple categories and performance modes
- Status workflow (Draft → Open → Acknowledged → Closed)

### 3. AI Event Processing
- Event ingestion and processing
- Violation detection and tracking
- Intervention management (block, redact, notify)

### 4. Professional UI/UX
- Clean, modern interface matching SentinelAI design
- Responsive layout with proper navigation
- Status badges and severity indicators
- Professional color scheme and typography

## Development

### Backend Development
```bash
# Run with auto-reload
uvicorn app.main:app --reload

# Access API docs
open http://localhost:8000/docs
```

### Database
- SQLite database automatically created on first run
- Sample data seeded automatically
- Database file: `sentinelai.db`

## Future Enhancements

- User authentication and authorization
- Advanced analytics and reporting
- Real LLM integration for live monitoring
- Advanced rule engine for policy evaluation
- Export capabilities for compliance reporting
- Multi-tenant support for enterprise deployment

## Demo

The application successfully demonstrates:

1. **Dashboard Overview** - Real-time statistics and activity feed
2. **Policies Management** - Complete governance policy lifecycle
3. **Events Monitoring** - AI interaction tracking and violation detection
4. **Professional UI** - Production-ready interface design

This prototype provides a solid foundation for building a comprehensive AI governance platform similar to SentinelAI's vision.
