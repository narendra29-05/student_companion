#!/bin/bash

# ============================================================
#  Student Companion - Project Setup Script
#  Run this after cloning the repository
# ============================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_step() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}  STEP $1: $2${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_info() {
    echo -e "${CYAN}  ℹ  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}  ⚠  $1${NC}"
}

print_success() {
    echo -e "${GREEN}  ✓  $1${NC}"
}

print_error() {
    echo -e "${RED}  ✗  $1${NC}"
}

# ============================================================
#  WELCOME
# ============================================================
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                              ║${NC}"
echo -e "${GREEN}║           STUDENT COMPANION - PROJECT SETUP                  ║${NC}"
echo -e "${GREEN}║                                                              ║${NC}"
echo -e "${GREEN}║   This script will help you set up the project step by step  ║${NC}"
echo -e "${GREEN}║                                                              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ============================================================
#  STEP 0: Prerequisites Check
# ============================================================
print_step "0" "Checking Prerequisites"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js is NOT installed!"
    echo ""
    print_info "Install Node.js (v18 or higher) from: https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    print_success "npm found: v$NPM_VERSION"
else
    print_error "npm is NOT installed!"
    exit 1
fi

# Check git
if command -v git &> /dev/null; then
    print_success "Git found: $(git --version)"
else
    print_warning "Git is not installed (optional but recommended)"
fi

echo ""
print_success "Prerequisites check passed!"

# ============================================================
#  STEP 1: Backend Environment Setup
# ============================================================
print_step "1" "Setting Up Backend Environment Variables"

if [ -f "backend/.env" ]; then
    print_warning "backend/.env already exists!"
    read -p "  Do you want to overwrite it? (y/N): " OVERWRITE_BACKEND
    if [[ ! "$OVERWRITE_BACKEND" =~ ^[Yy]$ ]]; then
        print_info "Skipping backend .env creation"
        SKIP_BACKEND_ENV=true
    fi
fi

if [ "$SKIP_BACKEND_ENV" != true ]; then
    echo -e "${CYAN}  We need the following credentials. Press Enter to use defaults where shown.${NC}"
    echo ""

    # --- PORT ---
    read -p "  Backend Port [5001]: " PORT
    PORT=${PORT:-5001}

    # --- NODE_ENV ---
    read -p "  Node Environment [development]: " NODE_ENV
    NODE_ENV=${NODE_ENV:-development}

    # --- DATABASE ---
    echo ""
    echo -e "${YELLOW}  ── DATABASE (PostgreSQL) ──${NC}"
    print_info "You need a PostgreSQL database. Options:"
    print_info "  1. Local PostgreSQL: postgresql://user:password@localhost:5432/student_companion"
    print_info "  2. Neon (free cloud): Sign up at https://neon.tech and copy your connection string"
    echo ""
    read -p "  PostgreSQL DATABASE_URL: " DATABASE_URL
    while [ -z "$DATABASE_URL" ]; do
        print_error "DATABASE_URL is required!"
        read -p "  PostgreSQL DATABASE_URL: " DATABASE_URL
    done

    # --- JWT ---
    echo ""
    echo -e "${YELLOW}  ── JWT AUTHENTICATION ──${NC}"
    DEFAULT_JWT="sc_jwt_secret_$(openssl rand -hex 12 2>/dev/null || echo 'change_this_in_production')"
    read -p "  JWT Secret [$DEFAULT_JWT]: " JWT_SECRET
    JWT_SECRET=${JWT_SECRET:-$DEFAULT_JWT}

    read -p "  JWT Expiry [7d]: " JWT_EXPIRE
    JWT_EXPIRE=${JWT_EXPIRE:-7d}

    # --- FRONTEND URL ---
    echo ""
    read -p "  Frontend URL (for CORS) [http://localhost:3000]: " FRONTEND_URL
    FRONTEND_URL=${FRONTEND_URL:-http://localhost:3000}

    # --- EMAIL (SMTP) ---
    echo ""
    echo -e "${YELLOW}  ── EMAIL / SMTP CONFIGURATION ──${NC}"
    print_info "Used for sending welcome emails, drive notifications, deadline reminders."
    print_info "For Gmail: Enable 2-Step Verification, then generate an App Password at:"
    print_info "  https://myaccount.google.com/apppasswords"
    echo ""

    read -p "  SMTP Host [smtp.gmail.com]: " EMAIL_HOST
    EMAIL_HOST=${EMAIL_HOST:-smtp.gmail.com}

    read -p "  SMTP Port [587]: " EMAIL_PORT
    EMAIL_PORT=${EMAIL_PORT:-587}

    read -p "  Email Address (sender): " EMAIL_USER
    while [ -z "$EMAIL_USER" ]; do
        print_error "Email address is required for notifications!"
        read -p "  Email Address (sender): " EMAIL_USER
    done

    read -sp "  Email App Password (hidden): " EMAIL_PASS
    echo ""
    while [ -z "$EMAIL_PASS" ]; do
        print_error "Email password/app password is required!"
        read -sp "  Email App Password (hidden): " EMAIL_PASS
        echo ""
    done

    read -p "  Email From Name [Student Companion]: " EMAIL_FROM_NAME
    EMAIL_FROM_NAME=${EMAIL_FROM_NAME:-Student Companion}

    # --- CLOUDINARY (Optional) ---
    echo ""
    echo -e "${YELLOW}  ── CLOUDINARY (Optional - for file uploads) ──${NC}"
    print_info "Sign up at https://cloudinary.com (free tier available)"
    print_info "Press Enter to skip if not using Cloudinary."
    echo ""

    read -p "  Cloudinary Cloud Name (or Enter to skip): " CLOUDINARY_CLOUD_NAME
    if [ -n "$CLOUDINARY_CLOUD_NAME" ]; then
        read -p "  Cloudinary API Key: " CLOUDINARY_API_KEY
        read -sp "  Cloudinary API Secret (hidden): " CLOUDINARY_API_SECRET
        echo ""
    fi

    # --- Write backend .env ---
    cat > backend/.env << EOF
# Server Configuration
PORT=$PORT
NODE_ENV=$NODE_ENV

# PostgreSQL Database
DATABASE_URL=$DATABASE_URL

# JWT Authentication
JWT_SECRET=$JWT_SECRET
JWT_EXPIRE=$JWT_EXPIRE

# Frontend URL (CORS)
FRONTEND_URL=$FRONTEND_URL

# Email (SMTP)
EMAIL_HOST=$EMAIL_HOST
EMAIL_PORT=$EMAIL_PORT
EMAIL_USER=$EMAIL_USER
EMAIL_PASS=$EMAIL_PASS
EMAIL_FROM="$EMAIL_FROM_NAME <$EMAIL_USER>"
EOF

    # Append Cloudinary if provided
    if [ -n "$CLOUDINARY_CLOUD_NAME" ]; then
        cat >> backend/.env << EOF

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET
EOF
    fi

    print_success "backend/.env created successfully!"
fi

# ============================================================
#  STEP 2: Frontend Environment Setup
# ============================================================
print_step "2" "Setting Up Frontend Environment Variables"

if [ -f "frontend/.env" ]; then
    print_warning "frontend/.env already exists!"
    read -p "  Do you want to overwrite it? (y/N): " OVERWRITE_FRONTEND
    if [[ ! "$OVERWRITE_FRONTEND" =~ ^[Yy]$ ]]; then
        print_info "Skipping frontend .env creation"
        SKIP_FRONTEND_ENV=true
    fi
fi

if [ "$SKIP_FRONTEND_ENV" != true ]; then
    BACKEND_PORT=${PORT:-5001}
    read -p "  Backend API URL [http://localhost:$BACKEND_PORT/api]: " REACT_APP_API_URL
    REACT_APP_API_URL=${REACT_APP_API_URL:-http://localhost:$BACKEND_PORT/api}

    cat > frontend/.env << EOF
# Backend API URL
REACT_APP_API_URL=$REACT_APP_API_URL
EOF

    print_success "frontend/.env created successfully!"
fi

# ============================================================
#  STEP 3: Install Backend Dependencies
# ============================================================
print_step "3" "Installing Backend Dependencies"

cd backend
print_info "Running npm install in backend/..."
npm install
print_success "Backend dependencies installed!"
cd ..

# ============================================================
#  STEP 4: Install Frontend Dependencies
# ============================================================
print_step "4" "Installing Frontend Dependencies"

cd frontend
print_info "Running npm install in frontend/..."
npm install
print_success "Frontend dependencies installed!"
cd ..

# ============================================================
#  STEP 5: Create Upload Directories
# ============================================================
print_step "5" "Creating Required Directories"

mkdir -p backend/uploads/resumes
mkdir -p backend/uploads/profiles
print_success "Upload directories created!"

# ============================================================
#  DONE!
# ============================================================
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                              ║${NC}"
echo -e "${GREEN}║              SETUP COMPLETE! You're all set.                 ║${NC}"
echo -e "${GREEN}║                                                              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}  To start the application:${NC}"
echo ""
echo -e "${YELLOW}  Terminal 1 (Backend):${NC}"
echo "    cd backend && npm run dev"
echo ""
echo -e "${YELLOW}  Terminal 2 (Frontend):${NC}"
echo "    cd frontend && npm start"
echo ""
echo -e "${CYAN}  URLs:${NC}"
echo "    Frontend  → http://localhost:3000"
echo "    Backend   → http://localhost:${PORT:-5001}"
echo "    Health    → http://localhost:${PORT:-5001}/api/health"
echo ""
echo -e "${CYAN}  Useful Info:${NC}"
echo "    Departments : CSE, ECE, EEE, MECH, CIVIL, IT, AIDS, AIML"
echo "    Regulations : R20, R23"
echo "    Roles       : Student, Faculty"
echo ""
echo -e "${YELLOW}  Need help? Check README.md for more details.${NC}"
echo ""
