# Local Development Guide

This guide provides instructions for running the Sentinel AI application locally using the provided automation scripts.

## Quick Start

### For Linux/macOS Users
```bash
# Make the script executable (first time only)
chmod +x run_local.sh

# Start both backend and frontend
./run_local.sh
```

### For Windows Users
```cmd
# Start both backend and frontend
run_local.bat
```

## Prerequisites

Before running the application, ensure you have the following installed:

- **Python 3.9+** - For the FastAPI backend
- **Node.js 16+** - For the React frontend
- **npm** - Node package manager (comes with Node.js)

## Script Options

Both scripts (`run_local.sh` for Linux/macOS and `run_local.bat` for Windows) support the following commands:

### Start Both Services (Default)
```bash
# Linux/macOS
./run_local.sh
./run_local.sh start

# Windows
run_local.bat
run_local.bat start
```

This will:
1. Check prerequisites
2. Set up Python virtual environment (if needed)
3. Install backend dependencies
4. Install frontend dependencies
5. Start both backend and frontend servers

**Access Points:**
- Frontend Application: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Start Backend Only
```bash
# Linux/macOS
./run_local.sh backend

# Windows
run_local.bat backend
```

Starts only the FastAPI backend server on port 8000.

### Start Frontend Only
```bash
# Linux/macOS
./run_local.sh frontend

# Windows
run_local.bat frontend
```

Starts only the React development server on port 3000.

### Setup Dependencies Only
```bash
# Linux/macOS
./run_local.sh setup

# Windows
run_local.bat setup
```

Sets up all dependencies without starting the servers. Useful for initial setup or CI/CD environments.

### Clean Up Processes
```bash
# Linux/macOS
./run_local.sh clean

# Windows
run_local.bat clean
```

Stops all running backend and frontend processes.

### Help
```bash
# Linux/macOS
./run_local.sh help

# Windows
run_local.bat help
```

Shows usage information and available commands.

## What the Scripts Do

### Backend Setup
1. **Virtual Environment**: Creates a Python virtual environment in `backend/venv/` (if it doesn't exist)
2. **Dependencies**: Installs all required Python packages from `backend/requirements.txt`
3. **Database**: SQLite database is automatically created and seeded with sample data on first run
4. **Server**: Starts FastAPI server with auto-reload enabled for development

### Frontend Setup
1. **Dependencies**: Installs all Node.js packages from `frontend/package.json`
2. **Development Server**: Starts React development server with hot-reload enabled

### Process Management
- Both scripts handle process cleanup when stopped with Ctrl+C
- Background processes are properly terminated
- Port conflicts are resolved by killing existing processes

## Troubleshooting

### Common Issues

#### Port Already in Use
If you get port conflicts:
```bash
# Linux/macOS
./run_local.sh clean

# Windows
run_local.bat clean
```

#### Python/Node.js Not Found
Ensure Python 3.9+ and Node.js 16+ are installed and available in your PATH:
```bash
# Check versions
python3 --version  # or python --version on Windows
node --version
npm --version
```

#### Permission Denied (Linux/macOS)
Make sure the script is executable:
```bash
chmod +x run_local.sh
```

#### Virtual Environment Issues
If you encounter virtual environment problems, delete the existing one and let the script recreate it:
```bash
rm -rf backend/venv/  # Linux/macOS
rmdir /s backend\venv  # Windows
```

### Manual Setup (Alternative)

If the automated scripts don't work, you can set up manually:

#### Backend Manual Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Linux/macOS
# or
venv\Scripts\activate.bat  # Windows

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Manual Setup
```bash
cd frontend
npm install
npm start
```

## Development Features

### Hot Reload
- **Backend**: FastAPI server automatically reloads when Python files change
- **Frontend**: React development server automatically reloads when files change

### API Documentation
- Interactive API docs available at http://localhost:8000/docs
- Alternative docs at http://localhost:8000/redoc

### Sample Data
- Database is automatically seeded with sample data on first run
- Includes policies, events, violations, and users for testing

### CORS Configuration
- Backend is configured to allow requests from the frontend during development
- All origins are allowed in development mode (restrict in production)

## Production Considerations

These scripts are designed for local development only. For production deployment:

1. **Environment Variables**: Set proper environment variables for database, secrets, etc.
2. **CORS**: Restrict allowed origins in the FastAPI CORS middleware
3. **Database**: Use PostgreSQL or another production database instead of SQLite
4. **Process Management**: Use proper process managers like systemd, PM2, or Docker
5. **Reverse Proxy**: Use nginx or similar for serving static files and routing
6. **SSL/TLS**: Configure HTTPS for production

## File Structure

```
sentinel-ai/
├── run_local.sh          # Linux/macOS development script
├── run_local.bat         # Windows development script
├── LOCAL_DEVELOPMENT.md  # This file
├── backend/
│   ├── venv/            # Python virtual environment (created by script)
│   ├── requirements.txt # Python dependencies
│   ├── app/
│   │   └── main.py     # FastAPI application entry point
│   └── ...
├── frontend/
│   ├── node_modules/   # Node.js dependencies (created by script)
│   ├── package.json    # Node.js dependencies and scripts
│   ├── src/
│   │   └── App.tsx    # React application entry point
│   └── ...
└── ...
```

## Next Steps

After successfully running the application locally:

1. **Explore the API**: Visit http://localhost:8000/docs to explore the API endpoints
2. **Use the Frontend**: Navigate to http://localhost:3000 to use the web interface
3. **Review the Code**: Check out the backend and frontend code to understand the architecture
4. **Run Tests**: See [TESTING_GUIDE.md](TESTING_GUIDE.md) for information on running tests
5. **Make Changes**: Both servers support hot-reload for rapid development

## Support

If you encounter issues:

1. Check this troubleshooting section
2. Review the main [README.md](README.md) for additional context
3. Check the [TESTING_GUIDE.md](TESTING_GUIDE.md) for testing-related issues
4. Ensure all prerequisites are properly installed
