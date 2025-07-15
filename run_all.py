import subprocess
from pathlib import Path

BASE_DIR = Path(r"C:/SCMS MAIN/FInal")

# Services with separate frontend/backend folders
split_services = [
    ("LoginPage/frontend", "npm run dev"),
    ("LoginPage/backend", "npm start"),
    ("StudentPage/StudentProgress/frontend", "npm run dev"),
    ("StudentPage/StudentProgress/backend", "node server.js"),
    ("FacultyandAdmin/Attendance/frontend", "npm run dev"),
    ("FacultyandAdmin/Attendance/backend", "node server.js"),
    ("FacultyandAdmin/Dashboard/frontend", "npm run dev"),
    ("FacultyandAdmin/Dashboard/backend", "node server.js"),
    ("FacultyandAdmin/StudentInsights/frontend", "npm run dev"),
    ("FacultyandAdmin/StudentInsights/backend", "node server.js"),
]

# Services where frontend + backend are in the same directory
combined_services = [
    ("StudentPage/QuizAttending", "npm run dev", "node server.js"),
    ("FacultyandAdmin/AlertSystem", "npm run dev", "node server.js"),
    ("FacultyandAdmin/QuestionGenerator", "npm run dev", "node server.js"),
]

def open_terminals():
    for rel_path, command in split_services:
        abs_path = BASE_DIR / rel_path
        subprocess.Popen([
            "cmd", "/k", f"cd /d {abs_path} && {command}"
        ])

    for rel_path, frontend_cmd, backend_cmd in combined_services:
        abs_path = BASE_DIR / rel_path
        subprocess.Popen([
            "cmd", "/k", f"cd /d {abs_path} && {frontend_cmd}"
        ])
        subprocess.Popen([
            "cmd", "/k", f"cd /d {abs_path} && {backend_cmd}"
        ])

if __name__ == "__main__":
    open_terminals()
