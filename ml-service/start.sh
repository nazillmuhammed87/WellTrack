#!/bin/bash
export DYLD_LIBRARY_PATH="$HOME/local/libomp/libomp/21.1.8/lib:$DYLD_LIBRARY_PATH"
exec python3 "$(dirname "$0")/app.py"
