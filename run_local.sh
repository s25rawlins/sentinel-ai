#!/bin/bash

# Sentinel AI Local Development Script
# This script sets up and runs both backend and frontend services locally

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Python
    if ! command_exists python3; then
        print_error "Python 3 is required but not installed."
        exit 1
    fi
    
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
    print_status "Found Python $PYTHON_VERSION"
    
    # Check Node.js
    if ! command_exists node; then
        print_error "Node.js is required but not installed."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_status "Found Node.js $NODE_VERSION"
    
    # Check npm
    if ! command_exists npm; then
        print_error "npm is required but not installed."
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_status "Found npm $NPM_VERSION"
    
    print_success "All prerequisites are installed!"
}

# Function to setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
        print_success "Virtual environment created!"
    else
        print_status "Virtual environment already exists."
    fi
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    source venv/bin/activate
    
    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    print_success "Backend dependencies installed!"
    
    cd ..
}

# Function to setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        print_status "Installing Node.js dependencies..."
        npm install
        print_success "Frontend dependencies installed!"
    else
        print_status "Node.js dependencies already installed."
    fi
    
    cd ..
}

# Function to start backend
start_backend() {
    print_status "Starting backend server..."
    
    cd backend
    source venv/bin/activate
    
    # Start the backend server in background
    print_status "Starting FastAPI server on http://localhost:8000"
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    
    # Wait a moment for server to start
    sleep 3
    
    # Check if backend is running
    if curl -s http://localhost:8000/health > /dev/null; then
        print_success "Backend server is running! (PID: $BACKEND_PID)"
        print_status "API Documentation: http://localhost:8000/docs"
    else
        print_error "Failed to start backend server"
        exit 1
    fi
    
    cd ..
}

# Function to start frontend
start_frontend() {
    print_status "Starting frontend server..."
    
    cd frontend
    
    # Start the frontend server in background
    print_status "Starting React development server on http://localhost:3000"
    npm start &
    FRONTEND_PID=$!
    
    # Wait a moment for server to start
    sleep 5
    
    print_success "Frontend server is starting! (PID: $FRONTEND_PID)"
    print_status "Application will be available at: http://localhost:3000"
    
    cd ..
}

# Function to cleanup processes
cleanup() {
    print_status "Shutting down servers..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        print_status "Backend server stopped"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        print_status "Frontend server stopped"
    fi
    
    # Kill any remaining processes on the ports
    pkill -f "uvicorn app.main:app" 2>/dev/null || true
    pkill -f "react-scripts start" 2>/dev/null || true
    
    print_success "Cleanup completed!"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  start     Start both backend and frontend servers (default)"
    echo "  backend   Start only the backend server"
    echo "  frontend  Start only the frontend server"
    echo "  setup     Setup dependencies for both backend and frontend"
    echo "  clean     Clean up running processes"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                # Start both servers"
    echo "  $0 start          # Start both servers"
    echo "  $0 backend        # Start only backend"
    echo "  $0 frontend       # Start only frontend"
    echo "  $0 setup          # Setup dependencies only"
}

# Trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Main execution
main() {
    echo "=================================================="
    echo "    Sentinel AI Local Development Environment"
    echo "=================================================="
    echo ""
    
    # Parse command line arguments
    case "${1:-start}" in
        "start")
            check_prerequisites
            setup_backend
            setup_frontend
            start_backend
            start_frontend
            
            echo ""
            print_success "🚀 Sentinel AI is now running locally!"
            echo ""
            echo "📊 Frontend Application: http://localhost:3000"
            echo "🔧 Backend API: http://localhost:8000"
            echo "📚 API Documentation: http://localhost:8000/docs"
            echo ""
            print_status "Press Ctrl+C to stop all servers"
            
            # Wait for user to stop
            wait
            ;;
        "backend")
            check_prerequisites
            setup_backend
            start_backend
            
            echo ""
            print_success "🔧 Backend server is running!"
            echo "🔧 Backend API: http://localhost:8000"
            echo "📚 API Documentation: http://localhost:8000/docs"
            echo ""
            print_status "Press Ctrl+C to stop the server"
            
            wait
            ;;
        "frontend")
            check_prerequisites
            setup_frontend
            start_frontend
            
            echo ""
            print_success "📊 Frontend server is running!"
            echo "📊 Frontend Application: http://localhost:3000"
            echo ""
            print_status "Press Ctrl+C to stop the server"
            
            wait
            ;;
        "setup")
            check_prerequisites
            setup_backend
            setup_frontend
            print_success "✅ Setup completed! Run '$0 start' to start the servers."
            ;;
        "clean")
            cleanup
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
