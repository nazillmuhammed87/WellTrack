# WellTrack – Complete Project Documentation

> **For:** College Project Submission
> **Level:** Beginner-Friendly
> **Project Type:** Full-Stack Web Application with Machine Learning

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [Folder Structure](#4-folder-structure)
5. [Features](#5-features)
6. [Setup & Installation](#6-setup--installation)
7. [Running the Project](#7-running-the-project)
8. [User Guide](#8-user-guide)
9. [Admin Guide](#9-admin-guide)
10. [API Reference](#10-api-reference)
11. [ML Service Reference](#11-ml-service-reference)
12. [Database Models](#12-database-models)
13. [Security Features](#13-security-features)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Project Overview

**WellTrack** is a healthcare management web application that predicts a user's risk of having a stroke using machine learning. It was built as a complete full-stack system with a React frontend, an Express/Node.js backend, a Python/Flask ML service, and a MongoDB database.

### What Problem Does It Solve?

Stroke is one of the leading causes of death and disability worldwide. Early risk detection can save lives. WellTrack lets users enter their health data (age, blood pressure, glucose, BMI, etc.) and instantly get a personalised stroke risk assessment, along with recommended diet plans, workout plans, and doctors.

### Who Is It For?

| User Type | What They Can Do |
|-----------|-----------------|
| **Regular User** | Register, get verified, run predictions, view plans, find doctors, chat, submit feedback |
| **Admin** | Verify users, manage doctors, respond to feedback, view analytics |

### Key Capabilities at a Glance

- Stroke risk prediction using a trained Gradient Boosting machine learning model
- Personalised diet and workout plans based on risk level
- Doctor discovery with search and filter (70 Kerala doctors)
- In-app chatbot for common health questions
- Feedback system with screenshot uploads and admin responses
- Admin dashboard with analytics charts and user management

---

## 2. Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19 | UI framework |
| React Router | v7 | Client-side routing / page navigation |
| Bootstrap 5 | 5.3 | CSS styling and responsive layout |
| react-bootstrap | 2.10 | Bootstrap components as React components |
| Axios | 1.13 | HTTP requests to backend API |
| Recharts | 3.7 | Analytics charts in admin dashboard |
| react-toastify | 11 | Toast notification messages |
| react-icons | 5.5 | Icon library (FiStar, FaReply, etc.) |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 20 | JavaScript runtime |
| Express | 4.18 | Web server framework |
| MongoDB | 7 | NoSQL database |
| Mongoose | 8 | MongoDB object modelling (schemas) |
| JSON Web Token (JWT) | 9 | Authentication tokens |
| bcryptjs | 2.4 | Password hashing |
| Multer | 1.4 | File upload handling (screenshots) |
| Helmet | 7.1 | HTTP security headers |
| express-rate-limit | 7.1 | Rate limiting to prevent abuse |
| express-validator | 7 | Request input validation |
| Winston | 3.11 | Server-side logging |
| nodemon | 3 | Auto-restart server during development |

### ML Service

| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.14 | Runtime |
| Flask | 3.1 | Web framework for ML API |
| flask-cors | 6 | Cross-origin request support |
| scikit-learn | 1.8 | GradientBoostingClassifier model |
| SHAP | 0.46+ | Model explainability (feature importance) |
| pandas | 3 | Data manipulation |
| numpy | 2.4 | Numerical computation |
| joblib | 1.5 | Model serialisation (.pkl files) |

---

## 3. System Architecture

WellTrack is a **3-service architecture**. Each service runs independently and communicates over HTTP.

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐    │
│   │           React Frontend  (port 3000)                  │    │
│   │   - Shows pages, forms, charts, doctor cards           │    │
│   │   - Sends API requests with JWT token in headers       │    │
│   └───────────────┬───────────────────────────────────────┘    │
└───────────────────│─────────────────────────────────────────────┘
                    │ HTTP requests to /api/*
                    ▼
┌───────────────────────────────────────────────────────────────────┐
│              Express Backend  (port 5050)                         │
│                                                                   │
│  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │  Routes  │→ │Controllers │→ │  Models  │→ │   MongoDB     │  │
│  │ /api/auth│  │auth,pred,  │  │User      │  │ (port 27017)  │  │
│  │ /api/pred│  │admin,feed  │  │Doctor    │  │               │  │
│  │ /api/doc │  │back,doctor │  │Prediction│  │ Collections:  │  │
│  │ /api/feed│  │,plan       │  │DietPlan  │  │ users         │  │
│  │ /api/plan│  └────────────┘  │WorkoutPln│  │ doctors       │  │
│  │ /api/adm │                  │Feedback  │  │ predictions   │  │
│  └──────────┘                  └──────────┘  │ dietplans     │  │
│                                              │ workoutplans  │  │
│  Also calls ML service for predictions:      │ feedbacks     │  │
│                                              └───────────────┘  │
└───────────────────┬───────────────────────────────────────────────┘
                    │ POST /predict (JSON health data)
                    ▼
┌───────────────────────────────────────────────────────────────────┐
│              Flask ML Service  (port 5001)                        │
│                                                                   │
│  Input (10 health fields)                                         │
│       ↓                                                           │
│  Feature Engineering (10 → 15 features)                           │
│       ↓                                                           │
│  GradientBoostingClassifier (scikit-learn)                        │
│       ↓                                                           │
│  Output: risk probability, risk level, SHAP feature importance    │
└───────────────────────────────────────────────────────────────────┘
```

### Port Summary

| Service | Port | Technology |
|---------|------|-----------|
| React Frontend | 3000 | Node.js dev server |
| Express Backend | 5050 | Node.js |
| Flask ML Service | 5001 | Python |
| MongoDB | 27017 | MongoDB |

### Data Flow for a Prediction

1. User fills health form in browser → React sends `POST /api/predictions` with JWT token
2. Express validates token → checks user is verified → forwards health data to Flask `POST /predict`
3. Flask engineers 15 features → runs ML model → returns risk score + top features
4. Express saves result to MongoDB → sends back prediction ID to React
5. React redirects user to result page → displays risk gauge, feature chart, plan buttons

---

## 4. Folder Structure

```
welltrack/
├── client/                    ← React frontend
│   ├── public/                ← Static files (index.html, favicon)
│   └── src/
│       ├── App.js             ← Routes configuration
│       ├── index.js           ← React entry point
│       ├── context/
│       │   └── AuthContext.jsx       ← Global auth state (login/logout/user)
│       ├── hooks/
│       │   └── useAuth.js            ← Hook to access auth context easily
│       ├── pages/                    ← One file per page/screen
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── DashboardPage.jsx
│       │   ├── PredictionPage.jsx
│       │   ├── ResultPage.jsx
│       │   ├── HistoryPage.jsx
│       │   ├── DietPlanPage.jsx
│       │   ├── WorkoutPlanPage.jsx
│       │   ├── DoctorsPage.jsx
│       │   ├── FeedbackPage.jsx
│       │   ├── ProfilePage.jsx
│       │   ├── AdminDashboardPage.jsx
│       │   └── NotFoundPage.jsx
│       ├── components/               ← Reusable UI building blocks
│       │   ├── common/               ← Shared across all pages
│       │   │   ├── Navbar.jsx
│       │   │   ├── Footer.jsx
│       │   │   ├── ProtectedRoute.jsx   ← Redirects to login if not authenticated
│       │   │   ├── AdminRoute.jsx       ← Redirects if not admin
│       │   │   ├── LoadingSpinner.jsx
│       │   │   └── ErrorBoundary.jsx
│       │   ├── auth/
│       │   │   ├── LoginForm.jsx
│       │   │   └── RegisterForm.jsx
│       │   ├── prediction/
│       │   │   ├── HealthForm.jsx       ← Multi-step form container
│       │   │   ├── HealthFormStep1.jsx  ← Age, gender, hypertension, etc.
│       │   │   ├── HealthFormStep2.jsx  ← Glucose, BMI, smoking, etc.
│       │   │   ├── PredictionResult.jsx
│       │   │   ├── RiskGauge.jsx        ← Circular risk percentage gauge
│       │   │   ├── FeatureChart.jsx     ← Bar chart of top 5 risk factors
│       │   │   └── PredictionHistory.jsx
│       │   ├── plans/
│       │   │   ├── DietPlan.jsx
│       │   │   └── WorkoutPlan.jsx
│       │   ├── doctors/
│       │   │   ├── DoctorList.jsx
│       │   │   ├── DoctorCard.jsx
│       │   │   └── DoctorFilters.jsx
│       │   ├── dashboard/
│       │   │   └── UserDashboard.jsx
│       │   ├── admin/
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── UserManagement.jsx
│       │   │   ├── DoctorManagement.jsx
│       │   │   ├── DoctorFormModal.jsx
│       │   │   ├── FeedbackManagement.jsx
│       │   │   └── AnalyticsCharts.jsx
│       │   ├── chatbot/
│       │   │   ├── ChatWidget.jsx
│       │   │   ├── ChatMessage.jsx
│       │   │   └── ChatInput.jsx
│       │   └── feedback/
│       │       └── FeedbackForm.jsx
│       ├── services/                  ← API call functions (axios)
│       │   ├── api.js                 ← Axios instance + interceptors
│       │   ├── authService.js
│       │   ├── predictionService.js
│       │   ├── planService.js
│       │   ├── doctorService.js
│       │   ├── feedbackService.js
│       │   └── adminService.js
│       └── utils/
│           ├── constants.js           ← API_URL, enums, labels
│           └── formatters.js          ← Date formatting helpers
│
├── server/                    ← Express backend
│   ├── server.js              ← Entry point (starts server)
│   ├── .env                   ← Environment variables (secrets)
│   ├── config/
│   │   ├── db.js              ← MongoDB connection
│   │   └── config.js          ← Loads .env variables
│   ├── routes/                ← URL path definitions
│   │   ├── authRoutes.js
│   │   ├── predictionRoutes.js
│   │   ├── planRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── feedbackRoutes.js
│   │   └── adminRoutes.js
│   ├── controllers/           ← Business logic for each route
│   │   ├── authController.js
│   │   ├── predictionController.js
│   │   ├── planController.js
│   │   ├── doctorController.js
│   │   ├── feedbackController.js
│   │   └── adminController.js
│   ├── models/                ← MongoDB schemas (Mongoose)
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Prediction.js
│   │   ├── DietPlan.js
│   │   ├── WorkoutPlan.js
│   │   └── Feedback.js
│   ├── middleware/            ← Functions that run before controllers
│   │   ├── auth.js            ← Validates JWT token
│   │   ├── adminAuth.js       ← Checks user has admin role
│   │   ├── validator.js       ← Input validation rules
│   │   ├── rateLimiter.js     ← Prevents request flooding
│   │   └── errorHandler.js    ← Global error responses
│   ├── seeds/                 ← Database seeding scripts
│   │   ├── adminSeed.js       ← Creates default admin account
│   │   ├── doctorSeed.js      ← Loads 70 Kerala doctors from CSV
│   │   └── kerala_doctors.csv ← Source data for doctors
│   ├── uploads/               ← Uploaded screenshot files (created automatically)
│   ├── logs/                  ← Server log files (created automatically)
│   └── utils/
│       └── logger.js          ← Winston logger configuration
│
└── ml-service/                ← Python Flask ML service
    ├── app.py                 ← Flask entry point (routes)
    ├── predict.py             ← Model loading + prediction logic
    ├── preprocess.py          ← Input validation + feature engineering
    ├── train.py               ← Script to train model on real dataset
    ├── requirements.txt       ← Python dependencies
    └── models/                ← Saved model files (auto-created)
        ├── welltrack_xgb_model.pkl   ← Trained model
        └── preprocessor.pkl          ← Fitted scaler/encoder
```

---

## 5. Features

### 5.1 Stroke Risk Prediction

The core feature of WellTrack. Users fill a 2-step health form and receive an instant AI-generated stroke risk assessment.

**How it works technically:**

```
User fills form (10 fields)
         ↓
Express receives request, validates JWT + isVerified
         ↓
Sends data to Flask ML service POST /predict
         ↓
Flask engineers 15 features from raw 10 inputs
         ↓
GradientBoostingClassifier returns probability (0.0 – 1.0)
         ↓
Risk level assigned: Low (<35%) | Medium (35-60%) | High (>60%)
         ↓
SHAP calculates top 5 most influential health factors
         ↓
Result saved to MongoDB, returned to React
         ↓
React displays: risk gauge, percentage, top features chart, action buttons
```

**Input fields (Step 1):**

| Field | Type | Example |
|-------|------|---------|
| Age | Number (18–100) | 45 |
| Gender | Male / Female | Male |
| Hypertension | Yes / No | Yes |
| Heart Disease | Yes / No | No |
| Smoking Status | Never / Formerly / Currently / Unknown | Never Smoked |
| Work Type | Private / Self-employed / Govt / Children / Never worked | Private |

**Input fields (Step 2):**

| Field | Type | Example |
|-------|------|---------|
| Average Glucose Level | Number (50–300 mg/dL) | 105.5 |
| BMI | Number (10–60) | 27.3 |
| Ever Married | Yes / No | Yes |
| Residence Type | Urban / Rural | Urban |

**Result displayed:**
- Risk gauge (colour-coded: green/amber/red)
- Risk probability percentage
- Risk level badge (Low / Medium / High)
- Top 5 contributing factors (bar chart)
- Buttons: View Diet Plan, View Workout Plan, Find Doctors

---

### 5.2 Admin Verification Gate

New users cannot make predictions until an admin verifies their account. This is a deliberate design choice to ensure responsible use of the health tool.

**Flow:**
1. User registers → account created with `isVerified: false`
2. User can log in but sees a "pending verification" message if they try to predict
3. Admin logs in → goes to Admin Dashboard → User Management tab
4. Admin clicks "Verify" → user's `isVerified` becomes `true`
5. User can now make predictions

---

### 5.3 Health Plans

After a prediction, WellTrack automatically generates personalised diet and workout plans based on the user's risk level, BMI, glucose, and age. These are **rule-based template plans** (not AI-generated), meaning the content is pre-written and selected/modified based on the user's health data.

**Diet Plan includes:**
- General dietary guidelines
- Foods to eat (with specific items)
- Foods to avoid
- Sample meal plan (breakfast, lunch, dinner, snacks)
- Special notes based on risk level

**Workout Plan includes:**
- Exercise list with name, duration, frequency, intensity
- Weekly schedule (Monday–Sunday)
- Safety notes (more cautious for High risk users)

---

### 5.4 Doctor Recommendations

Users can browse 70 Kerala doctors across 4 specializations. After a prediction, the system recommends specific specializations based on risk level:

| Risk Level | Recommended Specializations |
|-----------|----------------------------|
| Low | General Physician |
| Medium | General Physician, Endocrinologist |
| High | Cardiologist, Neurologist |

**Doctor search features:**
- Search by name (with 400ms debounce — doesn't re-fetch on every letter)
- Filter by specialization (Cardiologist, Neurologist, General Physician, Endocrinologist)
- Filter by district (Ernakulam, Kozhikode, Kottayam, etc.)
- Each card shows: name, hospital, experience, availability days, phone/email

---

### 5.5 Chatbot

A floating chat widget in the bottom-right corner of all pages. It uses **client-side keyword matching** (no AI/API calls) to answer common health questions across ~20 categories including:

- Stroke symptoms and warning signs
- BMI and glucose explanations
- How to use WellTrack
- Diet and exercise tips
- When to see a doctor

---

### 5.6 Feedback System

Users can submit feedback about any aspect of WellTrack and attach up to 3 screenshot images.

**User side:**
- Category: General, Prediction, Plans, Doctors, Chatbot, Bug Report, Feature Request
- Subject (max 100 characters)
- Description (max 500 characters)
- Star rating (1–5)
- Screenshot upload (max 3 images, max 5MB each, JPEG/PNG/GIF)
- Can view all their past submissions on the same page
- Can see admin response once admin replies

**Admin side:**
- Sees all feedback in a table
- Can filter by status (Pending / Reviewed / Resolved)
- Clicks "Respond" → modal shows full feedback details including screenshots
- Admin types a response and changes status → user sees it in their submissions list

---

### 5.7 Prediction History

Users can view all their past predictions in a paginated table:
- Date of prediction
- Risk level (colour-coded badge)
- Risk probability percentage
- Links to view full result and plans

---

### 5.8 Admin Dashboard

A dedicated control panel only accessible to admin accounts. Organised into tabs:

| Tab | What admin can do |
|-----|------------------|
| **Overview** | See stats: total users, verified users, predictions, doctors |
| **User Management** | Verify or reject pending users, bulk verify, see rejection reasons |
| **Doctor Management** | Add new doctors, edit existing, soft-delete (hides from users but keeps data) |
| **Feedback** | View all feedback, see screenshots, write responses, change status |
| **Analytics** | Charts: predictions over time, risk level distribution, user registration trends |

---

## 6. Setup & Installation

### Prerequisites

Make sure you have these installed before starting:

| Software | Version | Check Command |
|---------|---------|---------------|
| Node.js | 20+ | `node --version` |
| npm | 9+ | `npm --version` |
| Python | 3.9+ | `python3 --version` |
| pip | Any | `pip3 --version` |
| MongoDB | 6+ | `mongod --version` |

---

### Step 1: Clone or Download the Project

```bash
# If you have git:
git clone <your-repo-url>
cd welltrack

# Or just navigate to the project folder:
cd /path/to/welltrack
```

---

### Step 2: Set Up the Backend (Express Server)

```bash
cd server
npm install
```

Create the `.env` file inside the `server/` folder:

```
PORT=5050
MONGO_URI=mongodb://localhost:27017/welltrack
JWT_SECRET=your_secret_key_here_make_it_long
ML_SERVICE_URL=http://localhost:5001
NODE_ENV=development
```

**What each variable means:**

| Variable | Description |
|---------|-------------|
| `PORT` | The port the backend server listens on |
| `MONGO_URI` | MongoDB connection string (use localhost for local dev) |
| `JWT_SECRET` | Secret key for signing JWT tokens — keep this private |
| `ML_SERVICE_URL` | Where the Flask ML service is running |
| `NODE_ENV` | Set to `development` for local dev, `production` for deployment |

---

### Step 3: Set Up the ML Service (Flask)

```bash
cd ml-service
pip3 install -r requirements.txt
```

This installs Flask, scikit-learn, SHAP, pandas, numpy, and joblib. No additional configuration needed — the service creates a demo model automatically on first run.

---

### Step 4: Set Up the Frontend (React)

```bash
cd client
npm install
```

The frontend is pre-configured to connect to `http://localhost:5050/api`. If your backend runs on a different port, create a `.env` file in the `client/` folder:

```
REACT_APP_API_URL=http://localhost:5050/api
```

---

### Step 5: Seed the Database

First, make sure MongoDB is running (see Section 7). Then run:

```bash
cd server
npm run seed
```

This creates:
- **Admin account:** `admin@welltrack.com` / `admin123`
- **70 Kerala doctors** from `kerala_doctors.csv`

To run seeds individually:
```bash
npm run seed:admin    # Only admin account
npm run seed:doctors  # Only doctors
```

---

## 7. Running the Project

You need **4 terminal windows** (or tabs) running simultaneously.

### Terminal 1 — MongoDB

```bash
# Create the data directory first (only needed once):
mkdir -p ~/data/db

# Start MongoDB:
mongod --dbpath ~/data/db
```

You should see: `waiting for connections on port 27017`

---

### Terminal 2 — ML Service

```bash
cd welltrack/ml-service
python3 app.py
```

You should see:
```
Demo model created for development
SHAP explainer initialised
Running on http://127.0.0.1:5001
```

**Verify it's working:**
```bash
curl http://localhost:5001/health
# Expected: {"status": "healthy", "model_loaded": true, "error": null}
```

---

### Terminal 3 — Express Backend

```bash
cd welltrack/server
npm start            # Production mode
# OR
npm run dev          # Development mode (auto-restarts on file changes)
```

You should see:
```
info: Server running on port 5050
info: MongoDB connected: localhost
```

---

### Terminal 4 — React Frontend

```bash
cd welltrack/client
npm start
```

You should see:
```
Compiled successfully!
Local: http://localhost:3000
```

Your browser will open automatically at `http://localhost:3000`.

---

### Default Login Credentials

| Account | Email | Password |
|---------|-------|---------|
| Admin | admin@welltrack.com | admin123 |
| Regular User | (register yourself) | (your choice) |

> **Note:** After registering as a user, log in as admin and verify your account before you can make predictions.

---

### Quick Health Check

| Service | Check URL | Expected Response |
|---------|-----------|------------------|
| ML Service | http://localhost:5001/health | `{"status":"healthy"}` |
| Backend | http://localhost:5050/api/health | `{"status":"ok"}` |
| Frontend | http://localhost:3000 | WellTrack landing page |

---

## 8. User Guide

### Step 1: Register

1. Go to `http://localhost:3000`
2. Click **Register** in the top-right navbar
3. Fill in: Full Name, Email, Password, Confirm Password
4. Phone and Gender are optional
5. Click **Register**
6. You'll see a message: *"Registration successful. Please wait for admin verification."*

---

### Step 2: Get Verified

1. Open a new browser window (or incognito tab)
2. Go to `http://localhost:3000/login`
3. Log in with: `admin@welltrack.com` / `admin123`
4. Click **Admin Dashboard** in the navbar
5. Go to the **User Management** tab
6. Find your newly registered account → click **Verify**
7. Go back to your regular user browser window

---

### Step 3: Log In as User

1. Go to `http://localhost:3000/login`
2. Enter your email and password
3. You'll be redirected to the **Dashboard**

---

### Step 4: Run a Stroke Risk Prediction

1. Click **Prediction** in the navbar (or the button on Dashboard)
2. **Step 1 — Basic Info:**
   - Age: Enter your age (18–100)
   - Gender: Select Male or Female
   - Hypertension: Do you have high blood pressure? Yes/No
   - Heart Disease: Have you had heart problems? Yes/No
   - Smoking Status: Select your smoking history
   - Work Type: Select your employment type
   - Click **Next**
3. **Step 2 — Medical Details:**
   - Average Glucose Level: Blood sugar level (e.g., 90 = normal, 126+ = diabetic)
   - BMI: Body Mass Index (weight in kg ÷ height in m²)
   - Ever Married: Yes/No
   - Residence Type: Urban or Rural
   - Click **Submit**
4. You'll be redirected to your **Result page**

---

### Step 5: Understand Your Result

The result page shows:

| Section | What It Means |
|---------|--------------|
| **Risk Gauge** | A colour dial showing your stroke risk percentage |
| **Risk Level** | Low (green) / Medium (yellow) / High (red) |
| **Probability** | The exact percentage chance (e.g., 42.3%) |
| **Top 5 Factors** | Bar chart of which health factors influenced your result most |

**Below the result:**
- **View Diet Plan** — See your personalised meal recommendations
- **View Workout Plan** — See your personalised exercise plan
- **Find Recommended Doctors** — Browse doctors suited to your risk level

---

### Step 6: View Diet & Workout Plans

1. From the result page, click **View Diet Plan**
2. The plan shows:
   - General guidelines for your risk level
   - Foods recommended for you
   - Foods to avoid
   - A sample day of meals (breakfast, lunch, dinner, snacks)
3. Go back and click **View Workout Plan** for exercises

---

### Step 7: Find Doctors

1. Click **Doctors** in the navbar
2. Use the **search bar** to search by doctor name (debounced — waits 400ms after you stop typing)
3. Use the **Specialization dropdown** to filter by type (Cardiologist, Neurologist, etc.)
4. Use the **District dropdown** to filter by location
5. Each doctor card shows: name, hospital, specialization, experience, available days, phone/email

---

### Step 8: Submit Feedback

1. Click **Feedback** in the navbar
2. The page shows two panels:
   - **Left: Submit Feedback** — fill the form
   - **Right: My Submissions** — see your past feedback and admin replies
3. Fill in: Category, Subject, Description, Rating (1–5 stars)
4. Optionally attach up to 3 screenshot images (max 5MB each)
5. Click **Submit Feedback**
6. Your submission appears in the right panel immediately
7. When admin replies, you'll see a blue box with their response under your feedback

---

### Step 9: View Prediction History

1. Click **Dashboard** → look for the history section, or
2. Go directly to `/history`
3. See all past predictions in a table with dates, risk levels, and links to view results

---

## 9. Admin Guide

### Logging In as Admin

Go to `http://localhost:3000/login` and use:
- Email: `admin@welltrack.com`
- Password: `admin123`

After login, you'll see **Admin Dashboard** in the navbar (regular users don't see this).

---

### Verifying Users

1. Click **Admin Dashboard**
2. Click the **User Management** tab
3. You'll see a table of all users with their verification status
4. Click **Verify** next to a user to approve them
5. Click **Reject** to deny them (you can provide a reason)
6. Use **Bulk Verify** to verify multiple users at once (check the checkboxes, then click Bulk Verify)

---

### Managing Doctors

1. In Admin Dashboard, click the **Doctor Management** tab
2. **Add a new doctor:** Click **Add Doctor** → fill the form → Save
   - Required: Name, Specialization, Hospital
   - Optional: Email, Phone, Experience, Rating, Available Days, Available Times
3. **Edit a doctor:** Click the **Edit** button (pencil icon) next to a doctor
4. **Delete a doctor:** Click the **Delete** button → doctor is soft-deleted (hidden from users but not removed from database)

---

### Responding to Feedback

1. In Admin Dashboard, click the **Feedback** tab
2. Use the status filter to show: All / Pending / Reviewed / Resolved
3. Click **Respond** next to any feedback item
4. The modal shows:
   - Subject and user details
   - The feedback description
   - Any screenshots attached (click to open full size)
5. Type your response in the text box
6. Change the status: Reviewed or Resolved
7. Click **Submit Response**
8. The user will see your response in their Feedback page

---

### Viewing Analytics

1. In Admin Dashboard, click the **Analytics** tab
2. Charts available:
   - Predictions over time (line chart)
   - Risk level distribution (pie/bar chart)
   - User registration trends

---

## 10. API Reference

All backend API endpoints use base URL: `http://localhost:5050/api`

**Authentication:** All protected routes require header:
```
Authorization: Bearer <your_jwt_token>
```

---

### Auth Routes (`/api/auth`)

#### Register a New User
```
POST /api/auth/register
```
**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123",
  "phone": "+91-9876543210",
  "gender": "male"
}
```
**Response (201):**
```json
{
  "message": "Registration successful. Please wait for admin verification."
}
```

---

#### Login
```
POST /api/auth/login
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "mypassword123",
  "rememberMe": false
}
```
**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isVerified": true
  }
}
```
**Error (401) — wrong password:**
```json
{ "message": "Invalid credentials. 3 attempts remaining." }
```
**Error (423) — account locked:**
```json
{ "message": "Account locked. Try again after 30 minutes." }
```

---

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "id": "65abc123...",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "gender": "male",
  "role": "user",
  "isVerified": true,
  "createdAt": "2026-03-01T10:00:00.000Z"
}
```

---

#### Update Profile
```
PUT /api/auth/profile
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "fullName": "John K Doe",
  "phone": "+91-9999999999",
  "gender": "male",
  "dateOfBirth": "1990-05-15",
  "address": "Kochi, Kerala"
}
```
**Response (200):** Updated user object

---

### Prediction Routes (`/api/predictions`)

#### Create a Prediction
```
POST /api/predictions
Authorization: Bearer <token>
```
**Request Body:**
```json
{
  "age": 45,
  "gender": "Male",
  "hypertension": 1,
  "heartDisease": 0,
  "everMarried": "Yes",
  "workType": "Private",
  "residenceType": "Urban",
  "avgGlucoseLevel": 105.5,
  "bmi": 27.3,
  "smokingStatus": "never smoked"
}
```
**Response (201):**
```json
{
  "message": "Prediction created successfully",
  "prediction": {
    "_id": "65def456...",
    "prediction": 0,
    "probability": 0.2341,
    "riskLevel": "Low",
    "confidence": 0.7659,
    "topFeatures": [
      { "feature": "Age", "value": "45", "impact": 0.1234 },
      { "feature": "BMI", "value": "27.3", "impact": 0.0891 }
    ],
    "createdAt": "2026-03-24T09:00:00.000Z"
  }
}
```

---

#### Get User's Predictions (with Pagination)
```
GET /api/predictions?page=1&limit=10
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "predictions": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

---

#### Get Single Prediction
```
GET /api/predictions/:id
Authorization: Bearer <token>
```

---

### Plan Routes (`/api/plans`)

#### Get Diet Plan
```
GET /api/plans/diet/:predictionId
Authorization: Bearer <token>
```
**Response (200):**
```json
{
  "riskLevel": "Low",
  "guidelines": ["Eat balanced meals", "Reduce sodium intake"],
  "foodsToEat": ["Leafy greens", "Whole grains", "Fatty fish"],
  "foodsToAvoid": ["Processed foods", "Trans fats"],
  "sampleMealPlan": {
    "breakfast": ["Oatmeal with berries", "Green tea"],
    "lunch": ["Grilled chicken salad"],
    "dinner": ["Baked salmon with vegetables"],
    "snacks": ["Handful of almonds"]
  },
  "specialNotes": ["Stay hydrated with 8 glasses of water daily"]
}
```

---

#### Get Workout Plan
```
GET /api/plans/workout/:predictionId
Authorization: Bearer <token>
```

---

### Doctor Routes (`/api/doctors`)

#### Get All Doctors
```
GET /api/doctors
Authorization: Bearer <token>
```
Query params: `?specialization=Cardiologist&search=Anil`

#### Get Recommended Doctors
```
GET /api/doctors/recommended?riskLevel=High
Authorization: Bearer <token>
```

---

### Feedback Routes (`/api/feedback`)

#### Submit Feedback (with screenshots)
```
POST /api/feedback
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
**Form Fields:**
| Field | Type | Required |
|-------|------|----------|
| category | String (general/prediction/plans/doctors/chatbot/bug/feature) | Yes |
| subject | String (max 100) | Yes |
| description | String (max 500) | Yes |
| rating | Number (1–5) | Yes |
| screenshots | File(s) (max 3, 5MB each, images only) | No |

---

#### Get My Feedback
```
GET /api/feedback/my
Authorization: Bearer <token>
```

---

### Admin Routes (`/api/admin`) — Require Admin Role

#### Get All Users
```
GET /api/admin/users
Authorization: Bearer <admin_token>
```

#### Verify a User
```
PUT /api/admin/users/:id/verify
Authorization: Bearer <admin_token>
```

#### Reject a User
```
PUT /api/admin/users/:id/reject
Authorization: Bearer <admin_token>
Body: { "reason": "Invalid registration details" }
```

#### Get All Feedback
```
GET /api/admin/feedback?status=pending&page=1&limit=10
Authorization: Bearer <admin_token>
```

#### Respond to Feedback
```
PUT /api/admin/feedback/:id/respond
Authorization: Bearer <admin_token>
Body: { "response": "Thank you for your feedback!", "status": "resolved" }
```

#### Create Doctor
```
POST /api/admin/doctors
Authorization: Bearer <admin_token>
Body: {
  "name": "Dr. Example",
  "specialization": "Cardiologist",
  "hospital": "General Hospital",
  "experience": 10,
  "rating": 4.5,
  "availableDays": ["Monday", "Tuesday", "Wednesday"],
  "availableTime": { "from": "09:00", "to": "17:00" }
}
```

---

## 11. ML Service Reference

### Endpoints

#### Health Check
```
GET http://localhost:5001/health
```
**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "error": null
}
```

---

#### Make a Prediction
```
POST http://localhost:5001/predict
Content-Type: application/json
```

**Input Fields (all required):**

| Field | Type | Valid Range | Example |
|-------|------|------------|---------|
| `age` | Integer | 18 – 100 | 45 |
| `gender` | String | "Male" or "Female" | "Male" |
| `hypertension` | Integer | 0 (No) or 1 (Yes) | 1 |
| `heart_disease` | Integer | 0 (No) or 1 (Yes) | 0 |
| `ever_married` | String | "Yes" or "No" | "Yes" |
| `work_type` | String | "Private", "Self-employed", "Govt_job", "children", "Never_worked" | "Private" |
| `Residence_type` | String | "Urban" or "Rural" | "Urban" |
| `avg_glucose_level` | Float | 50 – 300 | 105.5 |
| `bmi` | Float | 10 – 60 | 27.3 |
| `smoking_status` | String | "never smoked", "formerly smoked", "smokes", "Unknown" | "never smoked" |

**Response:**
```json
{
  "prediction": 0,
  "probability": 0.2341,
  "risk_level": "Low",
  "confidence": 0.7659,
  "top_features": [
    { "feature": "Age", "value": "45", "impact": 0.1234 },
    { "feature": "Glucose Level", "value": "105.5", "impact": 0.0891 },
    { "feature": "BMI", "value": "27.3", "impact": 0.0654 },
    { "feature": "Composite Risk Score", "value": "0.3", "impact": 0.0432 },
    { "feature": "Hypertension", "value": "1", "impact": 0.0321 }
  ],
  "warnings": []
}
```

**Response fields explained:**

| Field | Description |
|-------|------------|
| `prediction` | 1 = stroke risk detected, 0 = no stroke risk detected |
| `probability` | Probability of stroke from 0.0 to 1.0 (multiply by 100 for %) |
| `risk_level` | "Low", "Medium", or "High" |
| `confidence` | How confident the model is in its prediction (0.0–1.0) |
| `top_features` | The 5 health factors that influenced the prediction most |
| `warnings` | Any warnings (e.g., "Extremely high glucose level detected") |

---

### Risk Level Thresholds

| Risk Level | Probability Range | Colour |
|-----------|------------------|--------|
| **Low** | 0.00 – 0.34 | Green |
| **Medium** | 0.35 – 0.59 | Yellow/Amber |
| **High** | 0.60 – 1.00 | Red |

---

### Feature Engineering

The model doesn't use the raw 10 inputs directly. It engineers 15 features:

**7 Numeric Features:**

| Feature | How It's Calculated |
|---------|-------------------|
| `age` | Direct from input |
| `hypertension` | Direct (0 or 1) |
| `heart_disease` | Direct (0 or 1) |
| `avg_glucose_level` | Direct from input |
| `bmi` | Direct from input |
| `composite_risk` | `(hypertension × 0.3) + (heart_disease × 0.3) + (glucose > 126 × 0.2) + (BMI > 30 × 0.1) + (age > 60 × 0.1)` |
| `age_bmi_interaction` | `age × bmi / 100` |

**8 Categorical Features (derived from input):**

| Feature | Values |
|---------|--------|
| `gender` | Male / Female |
| `ever_married` | Yes / No |
| `work_type` | Private / Self-employed / Govt_job / children / Never_worked |
| `Residence_type` | Urban / Rural |
| `smoking_status` | never smoked / formerly smoked / smokes / Unknown |
| `age_group` | young (18–40) / middle (40–60) / senior (60+) |
| `bmi_category` | underweight (<18.5) / normal (18.5–25) / overweight (25–30) / obese (≥30) |
| `glucose_risk` | normal (<100) / prediabetic (100–126) / diabetic (≥126) |

---

### Model Details

| Detail | Value |
|--------|-------|
| Algorithm | GradientBoostingClassifier (scikit-learn) |
| Estimators | 200 trees |
| Max depth | 5 levels |
| Learning rate | 0.05 |
| Explainability | SHAP TreeExplainer |
| Training data | 2000 synthetic samples (500 high-risk, 700 medium-risk, 800 low-risk) |
| Model file | `ml-service/models/welltrack_xgb_model.pkl` |
| Preprocessor | `ml-service/models/preprocessor.pkl` |

> If the `.pkl` files don't exist when the service starts, a demo model is automatically trained and saved. This happens silently in the background.

---

## 12. Database Models

All data is stored in MongoDB. Mongoose is used to define schemas with validation.

---

### User

Stores registered user accounts.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `fullName` | String | Yes | Max 100 chars |
| `email` | String | Yes | Unique, lowercase |
| `password` | String | Yes | bcrypt hashed, hidden from queries |
| `role` | String | No | "user" (default) or "admin" |
| `isVerified` | Boolean | No | false until admin verifies |
| `verifiedBy` | ObjectId | No | Reference to admin who verified |
| `verifiedAt` | Date | No | When verification happened |
| `rejectionReason` | String | No | Reason if rejected |
| `loginAttempts` | Number | No | Increments on failed login |
| `lockUntil` | Date | No | Account locked until this time |
| `phone` | String | No | Optional contact |
| `dateOfBirth` | Date | No | Optional |
| `gender` | String | No | male / female / other |
| `address` | String | No | Optional |
| `createdAt` | Date | Auto | Set by Mongoose timestamps |

---

### Doctor

Stores doctor profiles.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | String | Yes | Max 100 chars |
| `email` | String | No | Doctor's contact email |
| `phone` | String | No | Hospital contact number |
| `specialization` | String | Yes | Must be one of: Cardiologist, Neurologist, General Physician, Endocrinologist |
| `hospital` | String | Yes | Hospital/clinic name |
| `address` | String | No | Location string (City, District, State) |
| `location` | Object | No | `{ lat: Number, lng: Number }` |
| `experience` | Number | No | Years of experience |
| `rating` | Number | No | 0–5 stars |
| `availableDays` | [String] | No | Array of weekday names |
| `availableTime` | Object | No | `{ from: "09:00", to: "17:00" }` |
| `isActive` | Boolean | No | false = soft-deleted (hidden from users) |

---

### Prediction

Stores each stroke risk assessment result.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `userId` | ObjectId | Yes | Reference to User |
| `healthData` | Object | Yes | All 10 input fields stored |
| `prediction` | Number | Yes | 0 or 1 (stroke risk detected or not) |
| `probability` | Number | Yes | 0.0 – 1.0 |
| `riskLevel` | String | Yes | "Low", "Medium", or "High" |
| `confidence` | Number | No | Model's confidence score |
| `topFeatures` | [Object] | No | Array of `{ feature, value, impact }` |
| `isActive` | Boolean | No | For soft delete |
| `createdAt` | Date | Auto | Timestamp |

---

### DietPlan

Stores generated diet plans linked to predictions.

| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | Reference to User |
| `predictionId` | ObjectId | Reference to Prediction |
| `riskLevel` | String | Low / Medium / High |
| `guidelines` | [String] | General dietary guidelines |
| `foodsToEat` | [String] | Recommended foods |
| `foodsToAvoid` | [String] | Foods to avoid |
| `sampleMealPlan` | Object | `{ breakfast, lunch, dinner, snacks }` each as [String] |
| `specialNotes` | [String] | Additional personalised notes |

---

### WorkoutPlan

Stores generated exercise plans linked to predictions.

| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | Reference to User |
| `predictionId` | ObjectId | Reference to Prediction |
| `riskLevel` | String | Low / Medium / High |
| `guidelines` | [String] | Exercise guidelines |
| `exercises` | [Object] | Each: `{ name, duration, frequency, intensity, description }` |
| `weeklySchedule` | Object | `{ monday, tuesday, ..., sunday }` — activity description per day |
| `safetyNotes` | [String] | Safety precautions (more cautious for High risk) |

---

### Feedback

Stores user feedback submissions and admin responses.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `userId` | ObjectId | Yes | Reference to User |
| `category` | String | Yes | general / prediction / plans / doctors / chatbot / bug / feature |
| `subject` | String | Yes | Max 100 chars |
| `description` | String | Yes | Max 500 chars |
| `rating` | Number | Yes | 1–5 stars |
| `screenshots` | [String] | No | Array of file paths (e.g., `/uploads/1234-screenshot.png`) |
| `status` | String | No | "pending" (default) / "reviewed" / "resolved" |
| `adminResponse` | String | No | Admin's reply text |
| `respondedBy` | ObjectId | No | Reference to admin User |
| `respondedAt` | Date | No | When admin responded |

---

## 13. Security Features

WellTrack implements multiple layers of security:

### 1. Password Hashing (bcrypt)
All passwords are hashed using bcrypt with a salt round of 10 before being stored in MongoDB. The original password is never stored. When a user logs in, bcrypt compares the entered password with the stored hash.

### 2. JWT Authentication
After login, the server issues a JSON Web Token (JWT) signed with the `JWT_SECRET`. This token:
- Expires in 24 hours (or 30 days if "Remember Me" is checked)
- Must be included in the `Authorization` header for all protected API calls
- Is verified on every request by the `auth` middleware

### 3. Login Lockout
After **5 failed login attempts**, the account is locked for **30 minutes**. This prevents brute-force password attacks. The attempt count and lock expiry are stored in the User document.

### 4. Admin Verification Gate
New users cannot access the stroke prediction feature until an admin manually verifies their account. The `predictionController` checks `req.user.isVerified` before proceeding.

### 5. Role-Based Access Control
Two roles exist: `user` and `admin`. The `adminAuth` middleware checks the database (not just the JWT) on every admin API call to ensure the user truly has the admin role.

### 6. Rate Limiting
`express-rate-limit` is applied globally — if a single IP address makes too many requests in a short period, they receive a 429 (Too Many Requests) response. This prevents API abuse.

### 7. HTTP Security Headers (Helmet)
Helmet automatically sets secure HTTP headers including:
- `X-Content-Type-Options: nosniff` — prevents MIME-type sniffing
- `X-Frame-Options: DENY` — prevents clickjacking
- `Strict-Transport-Security` — enforces HTTPS
- `Cross-Origin-Resource-Policy: cross-origin` — allows uploaded images to be served cross-origin

### 8. CORS Restriction
The backend only accepts requests from `http://localhost:3000` (the React dev server). All other origins are blocked. This prevents other websites from making API calls using a user's credentials.

### 9. Input Validation
All API inputs are validated using `express-validator` before reaching the controllers. Invalid data (e.g., age > 100, invalid email format) returns a 400 error with specific messages.

### 10. Soft Delete
Doctors and predictions are never permanently deleted. They are marked with `isActive: false` instead. This preserves data integrity and audit trails.

---

## 14. Troubleshooting

### ML Service won't start — `libomp.dylib` error (macOS)

**Symptom:** `Library not loaded: @rpath/libomp.dylib`

**Cause:** XGBoost requires OpenMP which isn't installed on this machine.

**Fix:** WellTrack already uses `GradientBoostingClassifier` from scikit-learn instead of XGBoost, which doesn't need OpenMP. If you still see this error, delete old `.pkl` files and restart:
```bash
rm -f ml-service/models/*.pkl
python3 app.py
```

---

### MongoDB won't start — `data directory not found`

**Fix:**
```bash
mkdir -p ~/data/db
mongod --dbpath ~/data/db
```

---

### Port already in use

**Symptom:** `Error: listen EADDRINUSE :::5050`

**Fix:** Kill the process using that port:
```bash
# Find what's using port 5050:
lsof -i :5050

# Kill it:
kill -9 <PID>
```

---

### "No doctors found" on the Doctors page

**Cause:** Doctor seed hasn't been run.

**Fix:**
```bash
cd server
npm run seed:doctors
```

---

### "Invalid login credentials" error

**Cause:** Admin seed hasn't been run, so no users exist in the database.

**Fix:**
```bash
cd server
npm run seed:admin
```

---

### Doctor seed fails with "specialization is not a valid enum value"

**Cause:** The seed file uses a specialization name not in the Doctor model's allowed list.

**Fix:** The Doctor model only allows: `Cardiologist`, `Neurologist`, `General Physician`, `Endocrinologist`. The current `doctorSeed.js` reads from `kerala_doctors.csv` which uses exactly these values — re-run the seed:
```bash
npm run seed:doctors
```

---

### React shows blank page or "Cannot connect to API"

**Check:**
1. Is the Express server running? Check Terminal 3
2. Is MongoDB running? Check Terminal 1
3. Is the `.env` file present in `server/` with correct values?
4. Open browser DevTools (F12) → Console tab to see the exact error

---

### Prediction fails with "ML service unavailable"

**Check:**
1. Is the Flask ML service running? Check Terminal 2
2. Test: `curl http://localhost:5001/health` — should return `{"status":"healthy"}`
3. If Flask crashed, look at `logs/ml-service.log` for errors

---

### Screenshots not showing in admin feedback modal

**Check:**
1. Is the `server/uploads/` directory present? It's created automatically on server start
2. Is the Express server running? (it serves the `/uploads` static route)
3. Screenshots URL format: `http://localhost:5050/uploads/<filename>`

---

*End of Documentation*

---

> **Disclaimer:** WellTrack provides health risk assessments for informational purposes only. This is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider.
