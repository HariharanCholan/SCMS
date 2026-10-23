# 🏫 Smart Classroom Management System (SCMS)

> **SCMS Restructure & Unified Backend Integration**  
> **Date**: October 23, 2026 | **Version**: 2.0.0 (Unified Architecture)  
> For the complete technical migration report, see [**DOCUMENTATION.md**](DOCUMENTATION.md).

A full-stack, role-based web platform for managing classrooms, students, faculty, attendance, quizzes, and emergency alerts — unified under a **single backend API server**.

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                   SCMS Unified Architecture                     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               Micro-Frontends (Vite / React)             │   │
│  │                                                          │   │
│  │  5173 Login │ 5174 Quiz │ 5175 Insights │ 5176 Attend.  │   │
│  │  5177 AI Gen │ 5178 Alerts │ 5179 Hub │ 5180 Progress   │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │  HTTP / Fetch / Axios               │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │          SCMS Unified Backend  (Port 5000)               │   │
│  │                                                          │   │
│  │  /api/auth       /api/admin      /api/attendance         │   │
│  │  /api/generator  /api/quiz       /api/progress           │   │
│  │  /api/insights   /api/alerts                             │   │
│  │                                                          │   │
│  │  ⚡ Transparent proxies on ports 8000–8006              │   │
│  └──────────────────────┬───────────────────────────────────┘   │
│                         │  Mongoose / MongoDB Native Client     │
│  ┌──────────────────────▼───────────────────────────────────┐   │
│  │            MongoDB Atlas (SCMS Cluster)                  │   │
│  │   Attendance · document_db · student_progress_db         │   │
│  │   student_insights · LoginDB · SCMS                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
SCMS/
├── backend/                          ← 🔥 UNIFIED BACKEND (single server)
│   ├── config/
│   │   └── db.js                     ← Dual-cluster MongoDB connection
│   ├── controllers/
│   │   └── authController.js         ← Login, register, session, logout
│   ├── models/
│   │   ├── User.js                   ← Student / Faculty / Admin auth models
│   │   ├── AdminManagement.js        ← Classroom, Booking, Schedule models
│   │   ├── Attendance.js             ← Attendance session model
│   │   ├── StudentProgress.js        ← CGPA, Performance, Subject models
│   │   └── StudentInsights.js        ← Faculty insights & class models
│   ├── routes/
│   │   ├── authRoutes.js             ← /api/auth/*
│   │   ├── adminRoutes.js            ← /api/admin/*
│   │   ├── attendanceRoutes.js       ← /api/attendance/*
│   │   ├── generatorRoutes.js        ← /api/generator/*
│   │   ├── quizRoutes.js             ← /api/quiz/* (+ auto-sync to progress)
│   │   ├── progressRoutes.js         ← /api/progress/*
│   │   ├── insightsRoutes.js         ← /api/insights/*
│   │   └── alertRoutes.js            ← /api/alerts/* (+ SSE stream)
│   ├── python_ai/
│   │   └── topic_doc_question_generator.py   ← AI MCQ/MSQ/FILL generator
│   ├── .env                          ← Environment variables (single source)
│   ├── package.json
│   └── server.js                     ← Entry point — starts on port 5000
│
├── LoginPage/
│   ├── frontend/                     ← Vite React app (port 5173)
│   └── backend/                      ← ⚠️ LEGACY (replaced by unified backend)
│
├── Faculty and Admin/
│   ├── DashboardFINAL/Dashboard/
│   │   ├── frontend/                 ← Vite React app (port 5179)
│   │   └── backend/                  ← ⚠️ LEGACY
│   ├── StudentInsights/StudentInsights/
│   │   ├── frontend/                 ← Vite React app (port 5175)
│   │   └── backend/                  ← ⚠️ LEGACY
│   ├── AttendanceFINAL/AttendanceFINAL/
│   │   ├── frontend/                 ← Vite React app (port 5176)
│   │   └── backend/                  ← ⚠️ LEGACY
│   ├── QuestionGenerator/QuestionGenerator/  ← Vite React app (port 5177)
│   └── AlertSystem/AlertSystem/             ← Vite React app (port 5178)
│
├── Student Page/
│   ├── student_progress_connectedFINAL/
│   │   ├── frontend/                 ← Vite React app (port 5180)
│   │   └── backend/                  ← ⚠️ LEGACY
│   └── Quiz attending/Horizons Student Dashboard/  ← Vite React app (port 5174)
│
├── run_all.py                        ← 🚀 One-command launcher
├── PLAN.md                           ← Architectural restructuring plan
└── README.md                         ← This file
```

---

## ⚡ Quick Start

### 1. Prerequisites

| Requirement | Version |
|---|---|
| Node.js | `v18+` recommended |
| npm | `v8+` |
| Python | `3.9+` (for AI Quiz Generator) |

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

The backend reads from `backend/.env`. Defaults are pre-configured for the SCMS MongoDB Atlas cluster:

```env
PORT=5000
MONGO_URI_SCMS=mongodb+srv://...   # Primary cluster
MONGO_URI_AUTH=mongodb+srv://...   # Auth/Admin DB
JWT_SECRET=...
OPENROUTER_API_KEY=...             # For AI Question Generator
```

### 4. Install Python AI Dependencies

```bash
pip install pymongo openai
```

### 5. Run Everything

```bash
python run_all.py
```

This launches:
- ✅ **1 unified backend** on `http://localhost:5000`
- ✅ **8 frontend micro-apps** (ports `5173`–`5180`)
- ✅ **Legacy port forwarders** (`8000`–`8006` → `5000`)

Press **`Ctrl+C`** to gracefully shut down all services.

#### Optional modes:
```bash
python run_all.py --backend   # Backend only
python run_all.py --front     # Frontends only
```

---

## 🌐 Service Map

| URL | Service | Role |
|---|---|---|
| `http://localhost:5173` | **Login & Auth Gateway** | Entry point for all roles |
| `http://localhost:5174/quiz` | **Student Quiz Portal** | Attend and submit quizzes |
| `http://localhost:5175` | **Student Insights** | Faculty views class analytics |
| `http://localhost:5176` | **Attendance System** | Faculty marks roll-call |
| `http://localhost:5177` | **AI Question Generator** | Faculty generates MCQs via AI |
| `http://localhost:5178/adminalert` | **Emergency Alerts (Admin)** | Admin triggers sirens |
| `http://localhost:5178/studentalert` | **Emergency Alerts (Student)** | Students see evacuation alert |
| `http://localhost:5179` | **Faculty & Admin Hub** | Central navigation dashboard |
| `http://localhost:5180` | **Student Progress** | Student views CGPA & scores |
| `http://localhost:5000` | **Unified Backend API** | All REST endpoints |

---

## 🔌 API Reference

All API endpoints live at `http://localhost:5000`.

### Authentication — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register student / faculty / admin |
| `POST` | `/api/auth/login` | Login and receive JWT token |
| `GET` | `/api/auth/me` | Get current authenticated user |
| `POST` | `/api/auth/logout` | Clear session & token |

### Admin & Classrooms — `/api/admin`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/classrooms` | List all classrooms |
| `POST` | `/api/admin/bookings` | Create a classroom booking |
| `GET` | `/api/admin/bookings` | List all active bookings |
| `DELETE` | `/api/admin/bookings/:id` | Cancel a booking |
| `GET/POST` | `/api/admin/schedule` | Manage class timetable |

### Attendance — `/api/attendance`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/attendance/submit` | Submit roll-call for the day |
| `GET` | `/api/attendance/today` | Today's present/absent stats |
| `GET` | `/api/attendance/sessions` | All historical sessions |
| `GET` | `/api/attendance/absentees/sessions` | Absentee logs per session |
| `GET` | `/api/attendance/students` | Student list for marking |

### AI Question Generator — `/api/generator`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/generator/upload` | Upload course document |
| `GET` | `/api/generator/documents` | List uploaded documents |
| `POST` | `/api/generator/generate` | Run AI to generate MCQs |
| `POST` | `/api/generator/saveQuestions` | Save generated questions |
| `POST` | `/api/generator/questions/postStudentDocument` | Publish quiz to students |

### Student Quiz — `/api/quiz`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/quiz/tests` | List available quizzes |
| `GET` | `/api/quiz/quiz-questions?documentId=` | Get quiz questions (no answers) |
| `POST` | `/api/quiz/submit-answers` | Submit answers + **auto-sync score** to progress |

### Student Progress — `/api/progress`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/progress/subjects` | Subject scores (includes quiz results) |
| `GET` | `/api/progress/performance` | Monthly performance chart data |
| `GET` | `/api/progress/cgpahistory` | Semester CGPA history |
| `GET` | `/api/progress/student/:id` | Single student academic profile |

### Student Insights (Faculty) — `/api/insights`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/insights/student` | All students with marks |
| `PUT` | `/api/insights/student/:id` | Edit student marks |
| `GET` | `/api/insights/classes` | Class list |
| `GET` | `/api/insights/quizzes` | Quiz list |

### Emergency Alerts — `/api/alerts`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/alerts/alarm-status` | Current siren state |
| `POST` | `/api/alerts/alarm-on` | Activate emergency siren |
| `POST` | `/api/alerts/alarm-off` | Deactivate siren |
| `GET` | `/api/alerts/stream` | **SSE** live push notifications |

---

## 🔐 Authentication Flow

```
Student / Faculty / Admin
        │
        ▼
  POST /api/auth/login
        │
        ▼
  ┌─────────────────┐
  │   JWT Token     │  ← stored in localStorage by frontend
  │   + User data   │
  └─────────────────┘
        │
        ├──── role = "student"  ──▶  redirect to localhost:5180
        ├──── role = "faculty"  ──▶  redirect to localhost:5179/faculty/home
        └──── role = "admin"    ──▶  redirect to localhost:5179/admin/home
```

---

## 🔗 Closed Data Loops

The unified backend wires together previously isolated data silos:

### Quiz → Student Progress (Auto-Sync)
When a student submits a quiz at `/api/quiz/submit-answers`, the backend:
1. Evaluates the score against correct answers
2. **Automatically inserts** a new record into the `subjects` collection
3. The Student Progress dashboard (port `5180`) reflects the new score **instantly** on next load

### Attendance → Student Dashboard
When faculty submits roll-call at `/api/attendance/submit`, the records are stored in the same database cluster that the Student Progress backend reads from — enabling live attendance percentage calculations.

---

## 🧠 AI Question Generator

The AI module uses the **DeepSeek** model via OpenRouter to generate MCQs, MSQs, and Fill-in-the-Blank questions from uploaded course material.

**Requirements:**
```bash
pip install pymongo openai
```

**Flow:**
```
Faculty uploads document → POST /api/generator/upload
                              │
Faculty clicks Generate   → POST /api/generator/generate
                              │
                         Python script runs (topic_doc_question_generator.py)
                              │
                         AI generates MCQ/MSQ/FILL questions
                              │
Faculty reviews & saves   → POST /api/generator/saveQuestions
                              │
Faculty publishes         → POST /api/generator/questions/postStudentDocument
                              │
                         Students see quiz at http://localhost:5174/quiz
```

---

## 🧑‍💻 Development Notes

### Adding a New API Module
1. Create `backend/models/YourModel.js`
2. Create `backend/routes/yourRoutes.js`
3. Import and mount in `backend/server.js`:
   ```js
   import yourRoutes from './routes/yourRoutes.js';
   app.use('/api/your-module', yourRoutes);
   ```

### Frontend API Base URL
All frontends should point to:
```js
const API_BASE_URL = 'http://localhost:5000';
```

### Legacy Port Compatibility
The server transparently forwards all requests from ports `8000`–`8006` to port `5000`. **No changes are needed** to the existing frontend axios/fetch calls during migration.

---

## 👥 Roles & Permissions

| Feature | Student | Faculty | Admin |
|---|---|---|---|
| View own academic progress | ✅ | ❌ | ❌ |
| Attend quizzes | ✅ | ❌ | ❌ |
| View emergency alerts | ✅ | ✅ | ✅ |
| Mark attendance | ❌ | ✅ | ✅ |
| Generate AI questions | ❌ | ✅ | ✅ |
| View student insights | ❌ | ✅ | ✅ |
| Manage classrooms | ❌ | ❌ | ✅ |
| Trigger emergency siren | ❌ | ❌ | ✅ |

---

## 🗄️ Database Collections

| Database | Collection | Purpose |
|---|---|---|
| `document_db` | `documents` | Uploaded faculty course materials |
| `document_db` | `Questions` | Generated question banks |
| `document_db` | `student_Questions` | Published quizzes for students |
| `student_progress_db` | `subjects` | Student subject test scores (quiz results sync here) |
| `student_progress_db` | `performances` | Monthly performance chart data |
| `Attendance` | `Attendance` | Daily roll-call records |
| `Attendance` | `Filtered_Attendance` | Fingerprint-based session records |
| `LoginDB` | `students` | Student accounts |
| `LoginDB` | `faculties` | Faculty accounts |
| `LoginDB` | `admins` | Admin accounts |
| `student_insights` | `students` | Faculty marks editor data |

---

## 📋 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express.js (ESM) |
| **Database** | MongoDB Atlas (Mongoose + Native Driver) |
| **Auth** | JWT (`jsonwebtoken`) + express-session with MongoStore |
| **AI** | OpenRouter API → DeepSeek-Chat model (Python) |
| **Realtime** | Server-Sent Events (SSE) for Emergency Alerts |
| **Proxy** | `http-proxy` for legacy port forwarding |

---

## 🔮 Future Updates & Roadmap: Single Unified Frontend

Currently, SCMS runs with a **Single Unified Backend (Port 5000)** and 8 micro-frontends on separate development ports (`5173`–`5180`). The next evolution of the platform is consolidating all frontends into a **Single Frontend on a Single Port**:

### Target Architecture
* **Single Entry Host**: Everything hosted under **`http://localhost:5173`** (or domain root `https://scms.edu`).
* **Micro-Apps as Modular Pages & Components**:
  * `LoginPage` ➔ `/login` & `/register`
  * `Quiz attending` ➔ `/student/quiz`
  * `student_progress` ➔ `/student/progress`
  * `StudentInsights` ➔ `/faculty/insights`
  * `AttendanceFINAL` ➔ `/faculty/attendance`
  * `QuestionGenerator` ➔ `/faculty/question-generator`
  * `DashboardFINAL` ➔ `/admin/dashboard`
  * `AlertSystem` ➔ `/admin/alerts` & global emergency overlay banner across all pages
* **Unified Global State**: Single React Context / Redux store sharing active user, role permissions, and theme settings without cross-origin localStorage handshakes.
* **Unified Build**: One single `npm run build` producing a single production bundle for deployment on Vercel, Netlify, or Docker.

---

## 🤝 Contributors

| Name | Role |
|---|---|
| Hariharan | Student Progress, Quiz System, Backend Architecture |
| Ashwanth | Login System, Faculty Dashboard |
| Team SCMS | Attendance, Insights, Alert System, AI Generator |

---

*Smart Classroom Management System — Built with ❤️ for modern education.*
