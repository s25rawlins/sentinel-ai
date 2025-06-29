# Sentinel AI Governance Platform

An AI governance and monitoring platform built with Python/FastAPI backend and React frontend.

## Features

### Dashboard
- Real-time statistics (Total Policies, Active Policies, Events, Violations)
- Recent activity feed with severity indicators
- Clean, professional UI matching Sentinel AI design

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
- React TypeScript single-page application
- Responsive design with CSS custom properties
- Real-time data fetching and display
- Professional Sentinel AI-inspired UI/UX
- Dark/light theme support with persistent storage

## Architecture

```
sentinel-ai/
├── backend/                 # Python/FastAPI Backend
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   │   ├── dashboard.py    # Dashboard statistics endpoints
│   │   │   ├── events.py       # Event management endpoints
│   │   │   ├── policies.py     # Policy management endpoints
│   │   │   └── violations.py   # Violation management endpoints
│   │   ├── models/         # SQLAlchemy database models
│   │   │   ├── event.py        # Event data model
│   │   │   ├── policy.py       # Policy data model
│   │   │   ├── policy_template.py # Policy template model
│   │   │   ├── user.py         # User data model
│   │   │   └── violation.py    # Violation data model
│   │   ├── core/           # Pydantic schemas
│   │   │   └── schemas.py      # API data models
│   │   ├── services/       # Business logic and data seeding
│   │   │   └── data_seeder.py  # Database seeding utilities
│   │   ├── database/       # Database configuration
│   │   │   └── base.py         # Database setup and session management
│   │   └── main.py         # FastAPI application entry point
│   ├── tests/              # Test suite
│   │   ├── conftest.py         # Test configuration and fixtures
│   │   ├── test_main.py        # Main application tests
│   │   ├── test_api_policies.py # Policy API tests
│   │   └── test_models.py      # Database model tests
│   ├── alembic/            # Database migrations
│   ├── requirements.txt    # Python dependencies
│   ├── requirements-dev.txt # Development dependencies
│   ├── pyproject.toml      # Tool configurations
│   ├── pytest.ini         # Pytest configuration
│   ├── noxfile.py          # Nox test automation
│   └── .flake8            # Linting configuration
└── frontend/               # React TypeScript Frontend
    ├── public/             # Static assets
    │   ├── index.html          # Main HTML template
    │   ├── favicon.ico         # Application favicon
    │   └── manifest.json       # PWA manifest
    ├── src/
    │   ├── components/         # React components
    │   │   ├── Dashboard.tsx       # Dashboard overview component
    │   │   ├── Navigation.tsx      # Main navigation component
    │   │   ├── Policies.tsx        # Policies management component
    │   │   ├── Events.tsx          # Events monitoring component
    │   │   ├── Violations.tsx      # Violations management component
    │   │   └── __tests__/          # Component tests
    │   ├── services/           # API service layer
    │   │   ├── api.ts              # API client and methods
    │   │   └── __tests__/          # Service tests
    │   ├── mocks/              # MSW mock handlers
    │   │   ├── handlers.ts         # API mock handlers
    │   │   └── server.ts           # MSW server setup
    │   ├── App.tsx             # Main application component
    │   ├── App.css             # Global application styles
    │   ├── index.tsx           # Application entry point
    │   ├── index.css           # Global CSS reset and base styles
    │   └── setupTests.ts       # Test setup and configuration
    ├── package.json            # Dependencies and scripts
    ├── tsconfig.json          # TypeScript configuration
    └── README.md              # Frontend-specific documentation
```

## Technology Stack

### Backend
- **FastAPI** - Modern, fast web framework for building APIs
- **SQLAlchemy** - SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations
- **SQLite** - Lightweight database for development
- **Uvicorn** - ASGI server implementation

### Frontend
- **React 19** - JavaScript library for building user interfaces
- **TypeScript** - Static type checking for JavaScript
- **React Router DOM** - Client-side routing for single-page applications
- **Axios** - HTTP client for API communication
- **Recharts** - Data visualization and charting library
- **Lucide React** - Modern icon library
- **CSS Custom Properties** - Native CSS theming system

## Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
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
- Clean, modern interface matching Sentinel AI design
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

## Testing

This project includes a comprehensive testing suite for both backend and frontend components.

### Backend Testing

The backend uses **pytest** with **nox** for comprehensive testing:

```bash
cd backend

# Install test dependencies
pip install -r requirements-dev.txt

# Run all tests with nox (recommended)
nox

# Run specific test sessions
nox -s tests          # Run tests only
nox -s lint           # Run linting
nox -s type_check     # Run type checking
nox -s format         # Format code

# Run tests with pytest directly
pytest                # Run all tests
pytest --cov=app     # Run with coverage
pytest -m api        # Run API tests only
pytest -m unit       # Run unit tests only
```

**Test Coverage:**
- API endpoint testing with FastAPI TestClient
- Database model testing with SQLAlchemy
- Unit tests for business logic
- Integration tests for complete workflows
- Minimum 80% code coverage requirement

### Frontend Testing

The frontend uses **Jest** and **React Testing Library**:

```bash
cd frontend

# Run tests
npm test              # Interactive watch mode
npm run test:coverage # With coverage report
npm run test:ci       # CI mode (no watch)

# Debug tests
npm run test:debug
```

**Test Features:**
- Component testing with React Testing Library
- API mocking with Mock Service Worker (MSW)
- User interaction testing
- Accessibility testing
- Minimum 70% code coverage requirement

### Test Structure

```
backend/tests/
├── conftest.py              # Test configuration and fixtures
├── test_main.py            # Main application tests
├── test_api_policies.py    # Policy API tests
├── test_models.py          # Database model tests
└── ...

frontend/src/
├── components/__tests__/    # Component tests
├── services/__tests__/      # Service tests
├── mocks/                  # MSW mock handlers
└── setupTests.ts           # Test setup
```

### Continuous Integration

GitHub Actions workflow runs:
- Backend tests across Python 3.9, 3.10, 3.11
- Frontend tests across Node.js 18.x, 20.x
- Integration tests with PostgreSQL
- Security scanning with safety and bandit
- Code quality checks (linting, formatting, type checking)

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for detailed testing documentation.

## Future Enhancements

- User authentication and authorization
- Advanced analytics and reporting
- Real LLM integration for live monitoring
