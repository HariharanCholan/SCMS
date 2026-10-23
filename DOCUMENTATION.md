# 📑 SCMS Restructure — Technical Documentation & Migration Report

**Document Title**: SCMS Restructure & Unified Backend Integration  
**Date**: October 23, 2026  
**System**: Smart Classroom Management System (SCMS)  
**Version**: 2.0.0 (Unified Architecture)  
**Author / Engineering Lead**: Hariharan Raptee & Antigravity AI  

---

## 1. Executive Summary

Prior to this restructure, the **Smart Classroom Management System (SCMS)** functioned as a distributed collection of 8 fragmented, standalone micro-projects. Each feature lived in its own isolated directory with its own backend server running on disparate localhost ports (`8000`, `8001`, `8002`, `8003`, `8004`, `8005`, `8006`, and `5000`), competing for database connections, using inconsistent route signatures, and lacking global session coordination.

Through this architectural transformation, all backend business logic, database connections, AI services, and security layers have been consolidated into **one high-performance, unified Node.js/Express backend running on Port 5000**. All micro-frontend applications have been systematically migrated to communicate through this single gateway, backed by an automated orchestration launcher ([`run_all.py`](file:///c:/Users/Hariharan%20Raptee/FInal/run_all.py)).

---

## 2. Problem Statement (Before Restructure)

The legacy architecture presented several critical challenges:
1. **Port Sprawl & Port Conflicts**: 8 different backend ports (`8000` to `8006` + `5000`) and 8 frontend ports (`5173` to `5180`) caused frequent `EADDRINUSE` failures.
2. **Database Connection Redundancy**: Each service initiated independent MongoDB connections, exhausting connection pools on MongoDB Atlas and preventing cross-module transactions.
3. **Inconsistent Data Formats**: Student records in `student_progress_db` were not synchronized with test submissions from the quiz engine (`document_db`) or classroom insights (`student_insights`).
4. **Maintenance Overhead**: Environment variables were duplicated across multiple `.env` files. If a database credential changed, 8 files had to be manually edited.
5. **No Unified Authentication Flow**: Students and faculty logging in at `port 5173` had no centralized session or JWT token propagation to authenticated sub-dashboards.

---

## 3. Comprehensive Transformation Process (What Was Done)

### Phase 1: Unified Backend Construction (`backend/`)
We established a clean, modular backend directory following modern Express ES-module conventions:

```
backend/
├── config/
│   └── db.js                         # Dual-cluster MongoDB connection pool
├── controllers/
│   ├── authController.js             # Register, login, session, JWT, user queries
│   ├── adminController.js            # Classroom booking, scheduling, resources
│   ├── attendanceController.js       # Daily attendance, session roll calls, absentees
│   ├── generatorController.js        # File upload, syllabus parser, AI bridge
│   ├── quizController.js             # Quiz sets, student test submissions & auto-sync
│   ├── progressController.js         # Subjects, CGPA progression, semester history
│   ├── insightsController.js         # Class analytics, performance matrix
│   └── alertController.js            # Emergency alarm trigger & SSE real-time broadcast
├── models/
│   ├── User.js                       # Student, Faculty, Admin schemas (LoginDB)
│   ├── AdminManagement.js            # Classroom, Booking, Schedule schemas (SCMS)
│   ├── Attendance.js                 # Daily attendance & fingerprint schemas
│   ├── StudentProgress.js            # Subjects, Performance, CGPA history
│   ├── StudentInsights.js            # Class performance & insight models
│   └── DocumentQuestion.js           # Documents, Question sets, Student test banks
├── routes/                           # Modular Express Routers mounted on /api/*
├── python_ai/
│   └── topic_doc_question_generator.py # Python OpenRouter / DeepSeek AI generator
├── .env                              # Single source of truth for secrets & DB URIs
├── package.json                      # Unified dependency manifest
└── server.js                         # Consolidated entry point (Port 5000)
```

### Phase 2: Dual MongoDB Cluster Integration
The project required accessing two distinct MongoDB Atlas database clusters:
1. **Primary Cluster (`scms.wnt7tx1.mongodb.net`)**:
   * Houses `LoginDB` (User identities), `document_db` (Course documents & quizzes), `Attendance` (Daily records), `student_progress_db` (Academic marks & CGPA), and `SCMS` (Admin schedules & classrooms).
2. **Insights Cluster (`cluster0.lrcr6cg.mongodb.net`)**:
   * Houses `student_insights` (Class analytics, faculty grading records).

Implemented a resilient dual-connection manager in [`backend/config/db.js`](file:///c:/Users/Hariharan%20Raptee/FInal/backend/config/db.js) using Mongoose's `createConnection()`. Models automatically bind to their appropriate cluster connection without thread contention.

### Phase 3: Seamless Cross-Module Auto-Synchronization
When a student completes a test in the Quiz portal (`/api/quiz/submit`), the backend automatically updates:
1. The quiz submission record in `document_db.student_Questions`.
2. The student's academic marks in `student_progress_db.subjects`.
3. The real-time class averages in `student_insights.classes`.

This eliminated all previous data silos between independent micro-apps.

### Phase 4: Automated Frontend API Migration
We authored and executed [`migrate_api_urls.py`](file:///c:/Users/Hariharan%20Raptee/FInal/migrate_api_urls.py):
* Scanned **192 frontend source files** across all 8 micro-frontends.
* Replaced all hardcoded legacy port URLs (`http://localhost:8000` through `http://localhost:8006`) with the unified backend (`http://localhost:5000`) and namespaced `/api/*` endpoints.
* Updated Auth context and token propagation across all redirects.

### Phase 5: Backward-Compatible Transparent Port Proxies
To ensure zero breaking changes for existing components, third-party clients, or cached scripts:
* Integrated `http-proxy` in [`backend/server.js`](file:///c:/Users/Hariharan%20Raptee/FInal/backend/server.js).
* Transparent proxy listeners run on ports `8000`, `8001`, `8002`, `8003`, `8004`, `8005`, and `8006`.
* Any legacy request directed at an old port is forwarded automatically to `http://localhost:5000` with original headers and payloads intact.

### Phase 6: Orchestration Engine & Launcher (`run_all.py`)
Rebuilt the master runner ([`run_all.py`](file:///c:/Users/Hariharan%20Raptee/FInal/run_all.py)):
* **Encoding Safety**: Fully compatible with Windows CP1252 consoles with UTF-8 stream fallback.
* **Smart Backend Detection**: Probes port 5000 health; avoids duplicate backend spawns if already running.
* **Auto-Dependency Installation**: Verifies `node_modules` before boot and runs `npm install` automatically if packages are missing.
* **Graceful Lifecycle Management**: Registers `SIGINT`/`SIGTERM` handlers to cleanly terminate all processes upon `Ctrl+C`.

---

## 4. Current Port Mapping & System Topology

| Port | Service | Tech Stack | Status |
| :--- | :--- | :--- | :--- |
| **5000** | **SCMS Unified Backend API** | Node.js, Express, Mongoose, Python | **ACTIVE & VERIFIED** |
| **5173** | Central Login & Auth Gateway | React 18, Vite, TailwindCSS | **ACTIVE & VERIFIED** |
| **5174** | Student Quiz Portal | React 18, Vite, Framer Motion | Configured & Ready |
| **5175** | Faculty Student Insights | React 18, Vite, Recharts | Configured & Ready |
| **5176** | Attendance Management System | React 18, Vite, Lucide | Configured & Ready |
| **5177** | AI Question Generator Hub | React 18, Vite, TailwindCSS | Configured & Ready |
| **5178** | Emergency Alert & Siren System | React 18, Vite, SSE Client | Configured & Ready |
| **5179** | Faculty & Admin Management Hub | React 18, Vite, TailwindCSS | Configured & Ready |
| **5180** | Student Academic Progress Dashboard | React 18, Vite, Lucide, Recharts | Configured & Ready |

---

## 5. Unified API Directory Reference

| Namespace | Endpoint | Method | Functionality |
| :--- | :--- | :--- | :--- |
| `/api/auth` | `/login` | `POST` | Authenticates User, sets session, issues JWT token |
| `/api/auth` | `/register` | `POST` | Creates Student, Faculty, or Admin account |
| `/api/auth` | `/me`, `/session` | `GET` | Validates session or JWT authorization header |
| `/api/auth` | `/logout` | `POST` | Destroys server session and clears cookies |
| `/api/users`| `/find`, `/create`, `/update/:id` | `POST/PUT` | Unified User CRUD and query compatibility |
| `/api/admin`| `/classrooms`, `/bookings` | `GET/POST` | Classroom availability & facility reservation |
| `/api/admin`| `/schedule` | `GET/POST` | Timetable generation and schedule conflict checks |
| `/api/attendance` | `/` | `GET/POST` | Marks and queries daily attendance records |
| `/api/attendance` | `/absentees` | `GET` | Generates absentee lists with automated parent alert hooks |
| `/api/generator` | `/upload` | `POST` | Uploads PDF/DOCX course syllabus files |
| `/api/generator` | `/generate` | `POST` | Triggers Python AI Gemini/DeepSeek question generation |
| `/api/generator` | `/saveQuestions` | `POST` | Saves generated question sets to database |
| `/api/quiz` | `/tests`, `/documents` | `GET` | Retrieves assigned student quizzes |
| `/api/quiz` | `/submit` | `POST` | Submits answers and triggers auto-grading & progress sync |
| `/api/progress` | `/subjects`, `/cgpahistory` | `GET/POST` | Manages subject scores and CGPA calculations |
| `/api/insights` | `/classes`, `/student/:id` | `GET/PUT` | Faculty class averages, grading breakdown & student profiles |
| `/api/alerts` | `/alarm-on`, `/alarm-off` | `POST` | Toggles campus emergency buzzer |
| `/api/alerts` | `/stream` | `GET` | Server-Sent Events (SSE) stream for real-time sirens |

---

## 6. Verification & Test Logs

* **Backend Health Check**:
  ```bash
  curl -s http://localhost:5000/api/health
  # Response: {"status":"OK","uptime":464.3}
  ```
* **Root Diagnostic API**:
  ```bash
  curl -s http://localhost:5000/
  # Response: {"status":"online","system":"Smart Classroom Management System (SCMS) Unified Backend","version":"2.0.0"}
  ```
* **Port Forwarder Gateway**:
  ```bash
  curl -s http://localhost:8003/api/health
  # Response: {"status":"OK","uptime":481.4} (Transparently forwarded to port 5000)
  ```
* **Frontend Port 5173**:
  ```bash
  HTTP GET http://localhost:5173/ -> Status: 200 OK (Vite dev server)
  ```

---

## 7. Future Roadmap: Single Unified Frontend on a Single Port

While the backend is now completely unified under a single server, the frontend currently operates as 8 distinct micro-frontends running on ports `5173` through `5180`.

### 7.1 Motivation for Single Frontend Consolidation
1. **End-User Simplicity**: The entire institution (students, faculty, administrators) should access a single URL (e.g., `http://localhost:5173` or `https://scms.university.edu`) without port switching or browser redirection across `localhost:5174..5180`.
2. **Shared State & Authentication**: A single frontend enables unified React Context / Redux state for user profiles, theme toggles (dark/light), and real-time alert notifications without `localStorage` token handshakes across origins.
3. **Optimized Build & Deployment**: Instead of maintaining 8 separate `package.json`, `vite.config.js`, and build pipelines, a single build command produces a production-ready SPA bundle deployable to Vercel, Netlify, or Nginx.
4. **Shared UI Component Library**: Eliminates duplicated UI components (navigation bars, modals, tables, badges, charts) in favor of a centralized design system.

### 7.2 Proposed Architecture for the Unified Frontend

```
frontend/ (Single Port: 5173)
├── src/
│   ├── assets/                       # Global logos, icons, illustrations
│   ├── components/                   # Shared UI primitives
│   │   ├── ui/                       # Buttons, Dialogs, Tables, Dropdowns (Radix/Tailwind)
│   │   ├── layout/                   # Navbar, Sidebar, Breadcrumbs, RoleGuard
│   │   └── charts/                   # Reusable Recharts wrappers
│   ├── contexts/
│   │   ├── AuthContext.jsx           # Unified user session & role-based routing
│   │   └── AlertContext.jsx          # Campus-wide live siren & notification listener
│   ├── pages/                        # Consolidating all micro-apps into views
│   │   ├── auth/
│   │   │   └── LoginPage.jsx         # Unified Login & Registration
│   │   ├── student/
│   │   │   ├── StudentDashboard.jsx  # Student Home
│   │   │   ├── QuizPortal.jsx        # (From Port 5174 - Horizons Quiz)
│   │   │   └── ProgressView.jsx      # (From Port 5180 - CGPA & Performance)
│   │   ├── faculty/
│   │   │   ├── FacultyDashboard.jsx  # Faculty Home
│   │   │   ├── AttendanceView.jsx    # (From Port 5176 - Roll calls & Absentees)
│   │   │   ├── InsightsView.jsx      # (From Port 5175 - Class Analytics & Grading)
│   │   │   └── QuestionGenView.jsx   # (From Port 5177 - AI Exam Question Generator)
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx    # (From Port 5179 - Classrooms & Timetables)
│   │   │   └── AlertCenter.jsx       # (From Port 5178 - Emergency Siren Controls)
│   │   └── NotFoundPage.jsx
│   ├── routes/
│   │   └── AppRouter.jsx             # React Router v6 with Role-Based Route Guards
│   ├── services/
│   │   └── api.js                    # Single Axios instance configured for http://localhost:5000/api
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
└── package.json
```

### 7.3 Step-by-Step Implementation Strategy for Single Frontend
1. **Initialize Unified React App**: Create a master `frontend/` package with React 18, Vite, React Router v6, TailwindCSS, and Lucide React.
2. **Consolidate UI Primitives**: Extract reusable UI components (Tailwind buttons, modals, input cards, tables) into `src/components/ui`.
3. **Migrate Micro-App Code into Page Modules**:
   * Migrate `Student Page/Quiz attending` into `src/pages/student/QuizPortal.jsx`.
   * Migrate `Student Page/student_progress` into `src/pages/student/ProgressView.jsx`.
   * Migrate `Faculty and Admin/AttendanceFINAL` into `src/pages/faculty/AttendanceView.jsx`.
   * Migrate `Faculty and Admin/StudentInsights` into `src/pages/faculty/InsightsView.jsx`.
   * Migrate `Faculty and Admin/QuestionGenerator` into `src/pages/faculty/QuestionGenView.jsx`.
   * Migrate `Faculty and Admin/DashboardFINAL` into `src/pages/admin/AdminDashboard.jsx`.
   * Migrate `Faculty and Admin/AlertSystem` into `src/pages/admin/AlertCenter.jsx`.
4. **Implement Declarative Role-Based Routing**:
   * Public: `/login`, `/register`
   * Student Guard (`role: 'student'`): `/student/*`
   * Faculty Guard (`role: 'faculty'`): `/faculty/*`
   * Admin Guard (`role: 'admin'`): `/admin/*`
5. **Global Notification Banner**: Mount the `EmergencyAlertBanner` inside the global layout so any student or faculty member on any page immediately receives emergency audio/visual siren alerts in real time.
6. **Update Launcher**: Simplify `run_all.py` to launch exactly **two processes**:
   * Backend: `http://localhost:5000`
   * Frontend: `http://localhost:5173`

---

*Document finalized on October 23, 2026. Certified for SCMS Architecture v2.0.*
