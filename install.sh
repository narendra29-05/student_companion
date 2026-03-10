#!/bin/bash
# ============================================================
#  Student Companion - Install Dependencies (Mac/Linux)
#  Run this ONCE after cloning the repository
# ============================================================

set -e

echo ""
echo "=========================================="
echo "  Student Companion - Installing..."
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "  Download from: https://nodejs.org/ (v18 or higher)"
    exit 1
fi
echo "[OK] Node.js $(node -v)"
echo "[OK] npm v$(npm -v)"

# Check for .env file
if [ ! -f "backend/.env" ]; then
    echo ""
    echo "[WARNING] backend/.env not found!"
    echo "  Copy the example and fill in your values:"
    echo "    cp backend/.env.example backend/.env"
    echo "  Then edit backend/.env with your credentials."
    echo ""
fi

# Install backend
echo ""
echo ">> Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend
echo ""
echo ">> Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create upload directories
mkdir -p backend/uploads/resumes
mkdir -p backend/uploads/profiles

echo ""
echo "=========================================="
echo "  Installation Complete!"
echo "=========================================="
echo ""
echo "  Next steps:"
echo "  1. Make sure backend/.env has your credentials"
echo "  2. Run:  ./start.sh"
echo ""
