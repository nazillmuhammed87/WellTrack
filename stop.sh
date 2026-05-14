#!/bin/bash
echo "=== Stopping WellTrack services ==="

for PORT in 5001 5050 3000 3001; do
  PIDS=$(lsof -ti:$PORT 2>/dev/null)
  if [ -n "$PIDS" ]; then
    echo "  Stopping port $PORT (PID $PIDS)..."
    kill $PIDS 2>/dev/null
  fi
done

echo "All services stopped."
