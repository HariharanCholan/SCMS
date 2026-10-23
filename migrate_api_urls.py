r"""
SCMS API Migration Script
Replaces all old backend API URLs (ports 8000-8006, /api/login, /api/register etc.)
with the new unified backend (http://localhost:5000) and correct /api/* paths.

Run from: C:\Users\Hariharan Raptee\FInal
    python migrate_api_urls.py
"""

import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Old => New URL replacements (ordered by specificity)
REPLACEMENTS = [
    # Auth routes (LoginPage)
    ("http://localhost:8000/api/login",    "http://localhost:5000/api/auth/login"),
    ("http://localhost:8000/api/register", "http://localhost:5000/api/auth/register"),
    ("http://localhost:8000/api/logout",   "http://localhost:5000/api/auth/logout"),
    ("http://localhost:8000/api/session",  "http://localhost:5000/api/auth/me"),
    ("http://localhost:5000/api/login",    "http://localhost:5000/api/auth/login"),
    ("http://localhost:5000/api/register", "http://localhost:5000/api/auth/register"),
    ("http://localhost:5000/api/logout",   "http://localhost:5000/api/auth/logout"),

    # StudentInsights backend (8002)
    ("http://localhost:8002/api/student", "http://localhost:5000/api/insights/student"),
    ("http://localhost:8002/api/classes", "http://localhost:5000/api/insights/classes"),
    ("http://localhost:8002/api/quizzes", "http://localhost:5000/api/insights/quizzes"),

    # Attendance (8003)
    ("http://localhost:8003/api/attendance", "http://localhost:5000/api/attendance"),
    ("http://localhost:8003/api/students",   "http://localhost:5000/api/attendance/students"),
    ("http://localhost:8003",               "http://localhost:5000"),

    # QuestionGenerator (8004)
    ("http://localhost:8004/api/documents",                    "http://localhost:5000/api/generator/documents"),
    ("http://localhost:8004/api/generate",                     "http://localhost:5000/api/generator/generate"),
    ("http://localhost:8004/api/saveQuestions",                "http://localhost:5000/api/generator/saveQuestions"),
    ("http://localhost:8004/api/upload",                       "http://localhost:5000/api/generator/upload"),
    ("http://localhost:8004/api/questions/all",                "http://localhost:5000/api/generator/questions/all"),
    ("http://localhost:8004/api/questions/deleteDocument/",    "http://localhost:5000/api/generator/questions/deleteDocument/"),
    ("http://localhost:8004/api/questions/postStudentDocument","http://localhost:5000/api/generator/questions/postStudentDocument"),

    # AlertSystem (8005)
    ("http://localhost:8005/api/alarm-status", "http://localhost:5000/api/alerts/alarm-status"),
    ("http://localhost:8005/api/alarm-on",     "http://localhost:5000/api/alerts/alarm-on"),
    ("http://localhost:8005/api/alarm-off",    "http://localhost:5000/api/alerts/alarm-off"),

    # StudentProgress (8006)
    ("http://localhost:8006/api/subjects",    "http://localhost:5000/api/subjects"),
    ("http://localhost:8006/api/cgpahistory", "http://localhost:5000/api/cgpahistory"),
    ("http://localhost:8006/api/performance", "http://localhost:5000/api/performance"),
    ("http://localhost:8006/api/students",    "http://localhost:5000/api/students"),
    ("http://localhost:8006",                 "http://localhost:5000"),

    # Quiz attending (8001)
    ("http://localhost:8001/api/tests",            "http://localhost:5000/api/quiz/tests"),
    ("http://localhost:8001/api/getQuestionSets",  "http://localhost:5000/api/quiz/documents"),
    ("http://localhost:8001/api",                  "http://localhost:5000/api/quiz"),

    # Admin Dashboard backend (5000 -> ensure not double-replaced)
    # (Legacy admin backend was already on 5000, so only rewrite /api/* sub-paths)
    ("http://localhost:5000/api/bookings", "http://localhost:5000/api/admin/bookings"),
    ("http://localhost:5000/api/schedule", "http://localhost:5000/api/admin/schedule"),
    ("http://localhost:5000/api/classrooms", "http://localhost:5000/api/admin/classrooms"),
]

FRONTEND_DIRS = [
    "LoginPage/frontend/src",
    "Student Page/student_progress_connectedFINAL/frontend/src",
    "Student Page/Quiz attending/Horizons Student Dashboard/src",
    "Faculty and Admin/DashboardFINAL/Dashboard/frontend/src",
    "Faculty and Admin/StudentInsights/StudentInsights/frontend/src",
    "Faculty and Admin/AttendanceFINAL/AttendanceFINAL/frontend/src",
    "Faculty and Admin/QuestionGenerator/QuestionGenerator/src",
    "Faculty and Admin/AlertSystem/AlertSystem/src",
]

EXTENSIONS = {".jsx", ".js", ".ts", ".tsx"}

def migrate_file(filepath):
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    original = content
    for old, new in REPLACEMENTS:
        content = content.replace(old, new)

    if content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    return False

def main():
    print("=== SCMS API URL Migration ===\n")
    total_files = 0
    total_changed = 0

    for rel_dir in FRONTEND_DIRS:
        src_dir = os.path.join(BASE_DIR, rel_dir)
        if not os.path.exists(src_dir):
            print(f"  [WARN] Skipping (not found): {rel_dir}")
            continue

        for root, _, files in os.walk(src_dir):
            for file in files:
                ext = os.path.splitext(file)[1]
                if ext not in EXTENSIONS:
                    continue
                filepath = os.path.join(root, file)
                total_files += 1
                changed = migrate_file(filepath)
                if changed:
                    total_changed += 1
                    rel = os.path.relpath(filepath, BASE_DIR)
                    print(f"  [UPDATED] {rel}")

    print(f"\n  Scanned {total_files} files, updated {total_changed} files.")
    print("  Migration complete!\n")

if __name__ == "__main__":
    main()
