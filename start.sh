#!/bin/bash
# ============================================================
#  Student Companion - Start Both Servers (Mac/Linux)
#  Runs backend + frontend in one terminal
# ============================================================

set -e

echo ""
echo "=========================================="
echo "  Student Companion - Starting..."
echo "=========================================="

# Check .env
if [ ! -f "backend/.env" ]; then
    echo "[ERROR] backend/.env not found!"
    echo "  Run: cp backend/.env.example backend/.env"
    echo "  Then edit it with your credentials."
    exit 1
fi

# Cleanup on exit
cleanup() {
    echo ""
    echo ">> Shutting down..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID 2>/dev/null
    wait $FRONTEND_PID 2>/dev/null
    echo ">> All servers stopped."
}
trap cleanup EXIT INT TERM

# Start backend
echo ""
echo ">> Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to initialize
sleep 3

# Start frontend
echo ""
echo ">> Starting frontend server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "=========================================="
echo "  Both servers are starting!"
echo "=========================================="
echo ""
echo "  Backend  -> http://localhost:5001"
echo "  Frontend -> http://localhost:3000"
echo ""
echo "  Press Ctrl+C to stop both servers"
echo ""

# Wait for either process to exit
wait $BACKEND_PID $FRONTEND_PID
