#!/bin/bash
export PATH="$HOME/local/node-v20.11.0-darwin-arm64/bin:/usr/bin:/bin:$PATH"

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$ROOT_DIR/logs"
mkdir -p "$LOG_DIR"

echo "=== WellTrack Startup ==="

# 1. Check MongoDB
echo "[1/4] Checking MongoDB..."
if ! pgrep -x mongod > /dev/null; then
  echo "ERROR: MongoDB is not running."
  echo "  Start it with: mongod --dbpath ~/data/db"
  exit 1
fi
echo "  MongoDB: running"

# 2. Start ML service
echo "[2/4] Starting ML service (port 5001)..."
cd "$ROOT_DIR/ml-service"
if lsof -ti:5001 > /dev/null 2>&1; then
  echo "  ML service: already running on port 5001"
else
  nohup bash start.sh > "$LOG_DIR/ml-service.log" 2>&1 &
  ML_PID=$!
  echo "  ML service: started (PID $ML_PID)"
  echo "  Waiting for ML service to be ready..."
  for i in $(seq 1 15); do
    sleep 1
    if curl -s http://localhost:5001/health > /dev/null 2>&1; then
      echo "  ML service: ready"
      break
    fi
    if [ "$i" -eq 15 ]; then
      echo "  WARNING: ML service did not respond in 15s. Check logs/ml-service.log"
    fi
  done
fi

# 3. Start backend
echo "[3/4] Starting backend (port 5050)..."
cd "$ROOT_DIR/server"

# Seed database on first run (skip if already has data)
DOCTOR_COUNT=$(node -e "
const mongoose = require('mongoose');
require('dotenv').config();
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/welltrack';
mongoose.connect(uri).then(async () => {
  const Doctor = require('./models/Doctor');
  const count = await Doctor.countDocuments();
  console.log(count);
  process.exit(0);
}).catch(() => { console.log(-1); process.exit(0); });
" 2>/dev/null)

if [ "$DOCTOR_COUNT" = "0" ] || [ "$DOCTOR_COUNT" = "" ]; then
  echo "  First run detected - seeding database..."
  node seeds/adminSeed.js && node seeds/doctorSeed.js
  echo "  Database seeded."
elif [ "$DOCTOR_COUNT" = "-1" ]; then
  echo "  WARNING: Could not connect to MongoDB to check seed status"
else
  echo "  Database already seeded ($DOCTOR_COUNT doctors)"
fi

if lsof -ti:5050 > /dev/null 2>&1; then
  echo "  Backend: already running on port 5050"
else
  nohup node server.js > "$LOG_DIR/backend.log" 2>&1 &
  BACKEND_PID=$!
  echo "  Backend: started (PID $BACKEND_PID)"
fi

# 4. Start frontend
echo "[4/4] Starting React frontend (port 3000)..."
cd "$ROOT_DIR/client"
if lsof -ti:3000 > /dev/null 2>&1; then
  echo "  Frontend: already running on port 3000"
else
  nohup npx react-scripts start > "$LOG_DIR/frontend.log" 2>&1 &
  FRONTEND_PID=$!
  echo "  Frontend: started (PID $FRONTEND_PID)"
fi

echo ""
echo "=== All services starting ==="
echo "  Frontend : http://localhost:3000"
echo "  Backend  : http://localhost:5050"
echo "  ML       : http://localhost:5001"
echo ""
echo "  Admin login: admin@welltrack.com / admin123"
echo "  Logs: $LOG_DIR/"
echo ""
echo "To stop all services: bash $ROOT_DIR/stop.sh"
