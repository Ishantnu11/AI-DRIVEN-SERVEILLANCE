#!/bin/bash

# AI Surveillance Dashboard - Setup Script
# This script sets up both the backend and frontend environments

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
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

# Check if Python is installed
check_python() {
    print_info "Checking Python installation..."
    if command -v python3 &> /dev/null; then
        PYTHON_CMD=python3
        print_success "Python3 found: $(python3 --version)"
    elif command -v python &> /dev/null; then
        PYTHON_CMD=python
        print_success "Python found: $(python --version)"
    else
        print_error "Python is not installed. Please install Python 3.8 or higher."
        exit 1
    fi
}

# Check if Node.js is installed
check_node() {
    print_info "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        print_success "Node.js found: $(node --version)"
        if command -v npm &> /dev/null; then
            print_success "npm found: $(npm --version)"
        else
            print_error "npm is not installed. Please install npm."
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
}

# Setup backend
setup_backend() {
    print_info "Setting up backend..."
    cd backend || exit 1
    
    # Check if virtual environment exists
    if [ ! -d "venv" ]; then
        print_info "Creating Python virtual environment..."
        $PYTHON_CMD -m venv venv
        print_success "Virtual environment created"
    else
        print_info "Virtual environment already exists"
    fi
    
    # Activate virtual environment
    print_info "Activating virtual environment..."
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi
    
    # Upgrade pip
    print_info "Upgrading pip..."
    pip install --upgrade pip --quiet
    
    # Install requirements
    print_info "Installing Python dependencies..."
    pip install -r requirements.txt
    print_success "Backend dependencies installed"
    
    # Run Django migrations
    print_info "Running Django migrations..."
    python manage.py migrate --noinput
    print_success "Database migrations completed"
    
    # Check for .env file
    if [ ! -f ".env" ]; then
        print_warning ".env file not found in backend directory"
        if [ -f ".env.example" ]; then
            print_info "Copying .env.example to .env..."
            cp .env.example .env
            print_warning "Please update .env with your GEMINI_API_KEY"
        else
            print_warning "Please create a .env file with your GEMINI_API_KEY"
        fi
    else
        print_success ".env file found"
    fi
    
    # Deactivate virtual environment
    deactivate 2>/dev/null || true
    
    cd ..
    print_success "Backend setup complete!"
}

# Setup frontend
setup_frontend() {
    print_info "Setting up frontend..."
    cd frontend || exit 1
    
    # Install npm dependencies
    print_info "Installing npm dependencies..."
    npm install
    print_success "Frontend dependencies installed"
    
    # Check for .env file
    if [ ! -f ".env" ]; then
        print_warning ".env file not found in frontend directory"
        if [ -f ".env.example" ]; then
            print_info "Copying .env.example to .env..."
            cp .env.example .env
            print_info "Default VITE_API_URL is set to http://localhost:8000"
        else
            print_warning "Please create a .env file with VITE_API_URL if needed"
        fi
    else
        print_success ".env file found"
    fi
    
    cd ..
    print_success "Frontend setup complete!"
}

# Main execution
main() {
    echo ""
    echo "=========================================="
    echo "  AI Surveillance Dashboard Setup"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    check_python
    check_node
    echo ""
    
    # Setup backend
    setup_backend
    echo ""
    
    # Setup frontend
    setup_frontend
    echo ""
    
    echo "=========================================="
    print_success "Setup completed successfully!"
    echo "=========================================="
    echo ""
    echo "To run the backend:"
    echo "  cd backend"
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
        echo "  venv\\Scripts\\activate"
    else
        echo "  source venv/bin/activate"
    fi
    echo "  python manage.py runserver"
    echo ""
    echo "To run the frontend:"
    echo "  cd frontend"
    echo "  npm run dev"
    echo ""
}

# Run main function
main

