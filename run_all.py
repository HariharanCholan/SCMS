#!/usr/bin/env python3
"""
SCMS Unified Launcher
=====================
Starts the single unified backend and all frontend micro-apps.
Run this from the project root: python run_all.py

Usage:
  python run_all.py           # Start everything
  python run_all.py --backend # Start backend only
  python run_all.py --front   # Start frontends only
"""

import subprocess
import sys
import os
import time
import signal
import urllib.request
from pathlib import Path

# Safe encoding for Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Resolve root directory relative to this file
BASE_DIR = Path(__file__).parent.resolve()
BACKEND_DIR = BASE_DIR / "backend"

# Frontend services: (relative_path, port_label)
FRONTENDS = [
    ("LoginPage/frontend",                                                           "5173 - Login & Auth Gateway"),
    ("Student Page/Quiz attending/Horizons Student Dashboard",                       "5174 - Student Quiz Portal"),
    ("Faculty and Admin/StudentInsights/StudentInsights/frontend",                   "5175 - Faculty Student Insights"),
    ("Faculty and Admin/AttendanceFINAL/AttendanceFINAL/frontend",                   "5176 - Attendance Management"),
    ("Faculty and Admin/QuestionGenerator/QuestionGenerator",                        "5177 - AI Question Generator"),
    ("Faculty and Admin/AlertSystem/AlertSystem",                                    "5178 - Emergency Alert System"),
    ("Faculty and Admin/DashboardFINAL/Dashboard/frontend",                          "5179 - Faculty & Admin Hub"),
    ("Student Page/student_progress_connectedFINAL/frontend",                        "5180 - Student Progress Dashboard"),
]

processes = []

def banner():
    print("""
+----------------------------------------------------------+
|       Smart Classroom Management System (SCMS) v2.0      |
|                     Unified Launcher                     |
+----------------------------------------------------------+
""")

def check_node():
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        print(f"  [OK] Node.js {result.stdout.strip()}")
        return True
    except FileNotFoundError:
        print("  [ERROR] Node.js not found. Please install it from https://nodejs.org/")
        return False

def check_npm():
    try:
        result = subprocess.run("npm -v", capture_output=True, text=True, shell=True)
        if result.returncode == 0:
            print(f"  [OK] npm {result.stdout.strip()}")
            return True
        print("  [ERROR] npm check failed.")
        return False
    except Exception as e:
        print(f"  [ERROR] npm not found: {e}")
        return False

def is_backend_running(port=5000):
    try:
        req = urllib.request.urlopen(f"http://localhost:{port}/api/health", timeout=2)
        return req.getcode() == 200
    except Exception:
        return False

def check_backend_node_modules():
    """Run npm install in backend if node_modules is missing."""
    nm = BACKEND_DIR / "node_modules"
    if not nm.exists():
        print("  [INFO] Installing backend dependencies...")
        subprocess.run(["npm", "install"], cwd=str(BACKEND_DIR), check=True)
        print("  [OK] Backend dependencies installed.")

def start_backend():
    """Start the unified Node.js backend server in a new cmd window if not already active."""
    if is_backend_running(5000):
        print("  [INFO] Unified Backend is already active on http://localhost:5000")
        return None

    check_backend_node_modules()
    backend_cmd = f'cd /d "{BACKEND_DIR}" && echo Starting SCMS Unified Backend (Port 5000)... && node server.js'
    proc = subprocess.Popen(
        ["cmd", "/k", backend_cmd],
        creationflags=subprocess.CREATE_NEW_CONSOLE,
    )
    processes.append(proc)
    print("  [STARTING] Unified Backend on http://localhost:5000")
    print("             (Legacy ports 8000-8006 auto-forwarded via proxy)")
    time.sleep(3)  # Wait for DB connection
    return proc

def start_frontend(rel_path: str, label: str):
    """Start a Vite frontend in a new cmd window, auto-installing deps if missing."""
    abs_path = BASE_DIR / rel_path
    if not abs_path.exists():
        print(f"  [WARN] Skipping [{label}] - path not found: {abs_path}")
        return None

    nm = abs_path / "node_modules"
    if not nm.exists():
        npm_cmd = f'cd /d "{abs_path}" && echo [INFO] Installing {label} dependencies... && npm install && echo Starting {label}... && npm run dev'
    else:
        npm_cmd = f'cd /d "{abs_path}" && echo Starting {label}... && npm run dev'

    proc = subprocess.Popen(
        ["cmd", "/k", npm_cmd],
        creationflags=subprocess.CREATE_NEW_CONSOLE,
    )
    processes.append(proc)
    print(f"  [LAUNCHED] {label}")
    return proc

def graceful_shutdown(sig=None, frame=None):
    """Terminate all child processes."""
    print("\n\nShutting down all SCMS services...")
    for p in processes:
        try:
            p.terminate()
        except Exception:
            pass
    print("[OK] All services stopped. Goodbye!\n")
    sys.exit(0)

def main():
    banner()
    print("Checking prerequisites...\n")
    if not check_node() or not check_npm():
        sys.exit(1)
    print()

    mode = sys.argv[1] if len(sys.argv) > 1 else "all"

    signal.signal(signal.SIGINT, graceful_shutdown)
    signal.signal(signal.SIGTERM, graceful_shutdown)

    if mode in ("all", "--backend"):
        print("=======================================")
        print("  Starting Unified Backend Server")
        print("=======================================")
        start_backend()
        print()

    if mode in ("all", "--front"):
        print("=======================================")
        print("  Starting Frontend Micro-Apps")
        print("=======================================")
        for rel_path, label in FRONTENDS:
            start_frontend(rel_path, label)
            time.sleep(0.5)  # Stagger startup to avoid port conflicts
        print()

    print("=======================================")
    print("  All services launched successfully!")
    print("=======================================")
    print()
    print("  ENTRY POINT  ->  http://localhost:5173")
    print("  BACKEND API  ->  http://localhost:5000")
    print()
    print("  Press Ctrl+C to stop all services.")
    print()

    # Keep the launcher alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        graceful_shutdown()

if __name__ == "__main__":
    main()
