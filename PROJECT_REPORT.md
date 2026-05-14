# WellTrack - AI-Powered Stroke Risk Prediction & Health Management System

## Project Report

---

## Table of Contents

1. [Abstract](#1-abstract)
2. [Introduction](#2-introduction)
3. [Problem Statement & Objectives](#3-problem-statement--objectives)
4. [System Architecture](#4-system-architecture)
5. [Technology Stack](#5-technology-stack)
6. [Use Case Diagrams & Descriptions](#6-use-case-diagrams--descriptions)
7. [Data Flow Diagrams](#7-data-flow-diagrams)
8. [Database Design](#8-database-design)
9. [Module Descriptions](#9-module-descriptions)
10. [Machine Learning Model](#10-machine-learning-model)
11. [AI Integration - Google Gemini](#11-ai-integration---google-gemini)
12. [API Design](#12-api-design)
13. [Security Implementation](#13-security-implementation)
14. [Frontend Implementation](#14-frontend-implementation)
15. [Testing & Validation](#15-testing--validation)
16. [Screenshots & UI Flow](#16-screenshots--ui-flow)
17. [Limitations & Future Scope](#17-limitations--future-scope)
18. [Conclusion](#18-conclusion)
19. [References](#19-references)

---

## 1. Abstract

WellTrack is a full-stack web-based healthcare management system that leverages machine learning (XGBoost) to predict stroke risk based on clinical and demographic health data. The system provides personalized diet plans (powered by Google Gemini AI), workout plans, doctor recommendations, and an interactive health chatbot. It follows a three-tier microservice architecture consisting of a React frontend, an Express.js backend, and a Flask-based ML prediction service, with MongoDB as the primary database. The platform includes role-based access control with an admin verification gate, ensuring only verified users can access prediction services.

**Keywords:** Stroke Prediction, XGBoost, Machine Learning, MERN Stack, Google Gemini AI, Healthcare, Personalized Health Plans

---

## 2. Introduction

### 2.1 Background

Stroke is the second leading cause of death globally, accounting for approximately 11% of total deaths (WHO, 2021). Early identification of stroke risk factors can significantly reduce morbidity and mortality through timely medical intervention and lifestyle modifications. Traditional risk assessment methods rely on manual evaluation by clinicians, which may not always be accessible to the general population.

### 2.2 Motivation

The motivation behind WellTrack is to democratize stroke risk assessment by providing an accessible, AI-powered platform that:
- Predicts stroke risk using validated clinical parameters
- Generates personalized health plans tailored to individual risk profiles
- Connects users with appropriate medical specialists
- Provides continuous health guidance through an interactive chatbot

### 2.3 Scope

WellTrack covers the complete health assessment pipeline:
- User registration with admin-gated verification
- Health data collection via a guided two-step form
- Real-time stroke risk prediction using a trained XGBoost model
- AI-generated personalized diet plans (Google Gemini) with template fallback
- Rule-based workout plan generation with health-aware modifiers
- Risk-level-based doctor recommendations
- Administrative dashboard with analytics and user management
- Client-side health chatbot for instant guidance

---

## 3. Problem Statement & Objectives

### 3.1 Problem Statement

There is a lack of accessible, intelligent tools that can assess an individual's stroke risk using standard health parameters and provide actionable, personalized health recommendations. Existing clinical tools require professional oversight and are not available for self-assessment.

### 3.2 Objectives

| # | Objective | Implementation |
|---|-----------|---------------|
| 1 | Predict stroke risk accurately | XGBoost classifier trained on 5,110-patient Kaggle dataset |
| 2 | Provide personalized diet plans | Google Gemini AI integration with template fallback |
| 3 | Generate exercise recommendations | Rule-based workout templates with health-aware modifiers |
| 4 | Recommend appropriate doctors | Specialization mapping based on risk level |
| 5 | Ensure data security | JWT auth, bcrypt hashing, rate limiting, admin verification |
| 6 | Provide instant health guidance | Client-side keyword-matching chatbot (20+ categories) |
| 7 | Enable administrative oversight | Admin dashboard with analytics, user/doctor/feedback management |

---

## 4. System Architecture

### 4.1 High-Level Architecture

```
+------------------+       +-----------------------+       +---------------------+
|                  |       |                       |       |                     |
|  React Frontend  | <---> |  Express.js Backend   | <---> |  Flask ML Service   |
|  (Port 3000)     |  API  |  (Port 5050)          |  HTTP |  (Port 5001)        |
|                  |       |                       |       |                     |
+------------------+       +-----------+-----------+       +---------------------+
                                       |                           |
                                       v                           v
                               +---------------+          +----------------+
                               |   MongoDB     |          | XGBoost Model  |
                               |   Database    |          | (.pkl files)   |
                               +---------------+          +----------------+
                                       |
                                       v
                               +---------------+
                               | Google Gemini |
                               |   API         |
                               +---------------+
```

### 4.2 Three-Tier Microservice Architecture

| Tier | Service | Technology | Port | Responsibility |
|------|---------|-----------|------|----------------|
| Presentation | Frontend | React 19, Bootstrap 5 | 3000 | UI rendering, form validation, state management |
| Application | Backend | Express.js, Node.js 20 | 5050 | Business logic, authentication, API routing, plan generation |
| Intelligence | ML Service | Flask, Python 3 | 5001 | Feature engineering, XGBoost prediction, risk classification |

### 4.3 Communication Flow

```
Browser --> React App --> Axios HTTP --> Express API --> Mongoose --> MongoDB
                                              |
                                              +--> Axios HTTP --> Flask /predict
                                              |
                                              +--> Gemini SDK --> Google Gemini API
```

- **Frontend to Backend:** RESTful API calls via Axios with JWT Bearer token
- **Backend to ML Service:** HTTP POST/GET via Axios with 10s timeout and 2 retries
- **Backend to Gemini:** Google Generative AI SDK (`@google/generative-ai`)
- **Backend to Database:** Mongoose ODM with MongoDB

---

## 5. Technology Stack

### 5.1 Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.4 | Component-based UI framework |
| React Router DOM | 7.13.0 | Client-side routing with protected routes |
| React Bootstrap | 2.10.10 | Pre-built responsive UI components |
| Bootstrap | 5.3.8 | CSS framework |
| Axios | 1.13.5 | HTTP client with interceptors |
| Recharts | 3.7.0 | Data visualization (admin analytics) |
| React Toastify | 11.0.5 | Toast notifications |
| React Icons | 5.5.0 | Icon library (Feather icons) |

### 5.2 Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Express.js | 4.18.2 | Web framework for REST API |
| Mongoose | 8.0.0 | MongoDB object modeling (ODM) |
| JSON Web Token | 9.0.2 | Stateless authentication |
| bcryptjs | 2.4.3 | Password hashing (10 salt rounds) |
| express-validator | 7.0.1 | Request input validation |
| express-rate-limit | 7.1.4 | Rate limiting middleware |
| Helmet | 7.1.0 | HTTP security headers |
| CORS | 2.8.5 | Cross-origin resource sharing |
| Multer | 1.4.5 | Multipart file upload handling |
| Winston | 3.11.0 | Structured logging |
| Nodemailer | 6.9.7 | Email service |
| @google/generative-ai | 0.24.1 | Google Gemini API SDK |

### 5.3 ML Service

| Technology | Purpose |
|-----------|---------|
| Flask | Lightweight Python web framework |
| Flask-CORS | Cross-origin support for Flask |
| XGBoost | Gradient boosting classifier |
| scikit-learn | Preprocessing (StandardScaler, OrdinalEncoder, ColumnTransformer) |
| pandas | Data manipulation and feature engineering |
| NumPy | Numerical computing |
| joblib | Model serialization (.pkl files) |

### 5.4 Database

| Technology | Purpose |
|-----------|---------|
| MongoDB | NoSQL document database |
| Mongoose | Schema validation, indexing, middleware |

---

## 6. Use Case Diagrams & Descriptions

### 6.1 Actor Identification

| Actor | Description |
|-------|-------------|
| Guest | Unregistered visitor; can view landing page, register, login |
| User (Unverified) | Registered but pending admin approval; can login, view dashboard, update profile |
| User (Verified) | Admin-approved user; full access to predictions, plans, doctors, feedback, chatbot |
| Admin | System administrator; manages users, doctors, feedback, views analytics |
| ML Service | External Flask service; processes prediction requests |
| Gemini API | External Google AI service; generates personalized diet plans |

### 6.2 Use Cases - Guest

| UC# | Use Case | Description | Precondition | Postcondition |
|-----|----------|-------------|--------------|---------------|
| UC-01 | View Landing Page | Guest views features, how-it-works, and CTA | None | Page displayed |
| UC-02 | Register Account | Guest creates account with name, email, password | Valid email not already registered | Account created (isVerified=false) |
| UC-03 | Login | Guest authenticates with email and password | Account exists | JWT token issued, redirect to dashboard |

### 6.3 Use Cases - Verified User

| UC# | Use Case | Description | Precondition | Postcondition |
|-----|----------|-------------|--------------|---------------|
| UC-04 | Submit Health Assessment | User enters demographics and health metrics in 2-step form | User verified | Health data submitted to backend |
| UC-05 | View Prediction Result | User views stroke risk probability, level, confidence, top features | Prediction exists | Result page with gauge, charts displayed |
| UC-06 | View Diet Plan | User views personalized diet guidelines, foods, meal plan, notes | Prediction + DietPlan exist | Diet plan page displayed |
| UC-07 | View Workout Plan | User views exercise plan, weekly schedule, safety notes | Prediction + WorkoutPlan exist | Workout plan page displayed |
| UC-08 | View Prediction History | User browses past predictions with pagination | At least 1 prediction | Table of past predictions |
| UC-09 | View Recommended Doctors | User sees doctors matching their risk level's specialization | Prediction exists | Filtered doctor list |
| UC-10 | Browse All Doctors | User searches/filters doctors by specialization | None | Doctor cards grid |
| UC-11 | Submit Feedback | User submits feedback with category, rating, optional screenshots | User logged in | Feedback record created |
| UC-12 | Use Chatbot | User interacts with health chatbot | User logged in | Bot responses displayed |
| UC-13 | Update Profile | User edits name, phone, gender, DOB, address | User logged in | Profile updated |

### 6.4 Use Cases - Admin

| UC# | Use Case | Description | Precondition | Postcondition |
|-----|----------|-------------|--------------|---------------|
| UC-14 | View Dashboard Stats | Admin views total users, predictions, doctors, feedback counts | Admin logged in | Stats cards displayed |
| UC-15 | Verify User | Admin approves a pending user | User isVerified=false | User isVerified=true |
| UC-16 | Reject User | Admin rejects user with reason | User isVerified=false | User rejection reason set |
| UC-17 | Bulk Verify Users | Admin verifies multiple users at once | Users pending | All selected users verified |
| UC-18 | Create Doctor | Admin adds a new doctor to the system | Admin logged in | Doctor record created |
| UC-19 | Update Doctor | Admin edits doctor details | Doctor exists | Doctor record updated |
| UC-20 | Delete Doctor | Admin soft-deletes a doctor (isActive=false) | Doctor exists | Doctor hidden from users |
| UC-21 | View & Respond to Feedback | Admin reads user feedback and responds | Feedback exists | adminResponse, status updated |
| UC-22 | View Analytics | Admin views 30-day prediction trends, user growth, feedback charts | Admin logged in | Recharts visualizations displayed |

### 6.5 Use Case Diagram (Text Representation)

```
                         +-------------------------------------------+
                         |              WellTrack System              |
                         |                                           |
  +-------+              |  [UC-01] View Landing Page                |
  | Guest | -----------> |  [UC-02] Register Account                 |
  +-------+              |  [UC-03] Login                            |
                         |                                           |
  +-----------+          |  [UC-04] Submit Health Assessment          |
  | Verified  | -------> |  [UC-05] View Prediction Result           |
  | User      |          |  [UC-06] View Diet Plan                   |
  |           |          |  [UC-07] View Workout Plan                |
  |           |          |  [UC-08] View Prediction History          |
  |           |          |  [UC-09] View Recommended Doctors         |
  |           |          |  [UC-10] Browse All Doctors               |
  |           |          |  [UC-11] Submit Feedback                  |
  |           |          |  [UC-12] Use Chatbot                      |
  |           |          |  [UC-13] Update Profile                   |
  +-----------+          |                                           |
                         |  [UC-14] View Dashboard Stats             |
  +-------+             |  [UC-15] Verify User                      |
  | Admin | ----------> |  [UC-16] Reject User                      |
  +-------+             |  [UC-17] Bulk Verify Users                |
                         |  [UC-18] Create Doctor                    |
                         |  [UC-19] Update Doctor                    |
                         |  [UC-20] Delete Doctor                    |
                         |  [UC-21] Respond to Feedback              |
                         |  [UC-22] View Analytics                   |
                         +-------------------------------------------+
                                    |                  |
                              +----------+      +-----------+
                              |ML Service|      |Gemini API |
                              +----------+      +-----------+
```

---

## 7. Data Flow Diagrams

### 7.1 DFD Level 0 - Context Diagram

```
+--------+                                                    +----------+
|        |  Registration/Login/Health Data/Feedback            |          |
|  User  | -------------------------------------------------> | WellTrack|
|        | <------------------------------------------------- | System   |
|        |  JWT Token/Predictions/Plans/Doctors/Chat Responses |          |
+--------+                                                    +-----+----+
                                                                    |
+--------+                                                          |
| Admin  | <------> User Management / Doctor CRUD / Analytics ------+
+--------+                                                          |
                                                                    |
+----------+                                                        |
|ML Service| <----> Health Data / Prediction Results ---------------+
+----------+                                                        |
                                                                    |
+----------+                                                        |
|Gemini API| <----> Health Profile / Diet Plan JSON ----------------+
+----------+
```

### 7.2 DFD Level 1 - Major Processes

```
+--------+          +-----------+          +----------+
|        | ---1---> |   1.0     | ---2---> |          |
|  User  |          |   Auth    |          | MongoDB  |
|        | <--3---- | Process   | <--4---- |          |
+--------+          +-----------+          +----------+
    |                                           ^
    | 5 (Health Data)                           | 8 (Store)
    v                                           |
+-----------+     6 (ML Request)     +----------+
|   2.0     | ------------------>    |   3.0    |
| Prediction|                        |    ML    |
|  Process  | <------------------    | Service  |
+-----------+     7 (Risk Result)    +----------+
    |
    | 9 (Risk Level + Health Data)
    v
+-----------+     10 (API Call)      +----------+
|   4.0     | ------------------>    |   5.0    |
|   Plan    |                        |  Gemini  |
| Generator | <------------------    |   API    |
+-----------+     11 (Diet JSON)     +----------+
    |
    | 12 (Plans)
    v
+----------+
| MongoDB  |
+----------+
```

### 7.3 DFD Level 2 - Prediction Process (Process 2.0)

```
                     +-------------------+
                     |   2.1 Validate    |
  Health Data -----> |   Input Fields    |
                     +--------+----------+
                              |
                     +--------v----------+
                     |   2.2 Call ML     |
                     |   Service /predict|----> Flask ML Service
                     +--------+----------+          |
                              |               +-----v------+
                     +--------v----------+    | 2.2a Engineer|
                     |   2.3 Store      |    | Features     |
                     |   Prediction     |    +-----+--------+
                     +--------+----------+          |
                              |               +-----v--------+
                     +--------v----------+    | 2.2b XGBoost |
                     |   2.4 Trigger    |    | Predict      |
                     |   Plan Generation|    +--------------+
                     +-------------------+
```

### 7.4 DFD Level 2 - Plan Generation (Process 4.0)

```
Risk Level + Health Data
         |
         v
+-------------------+           +-----------------+
| 4.1 Call Gemini   | --------> | Google Gemini   |
| generateDietPlan  |           | API             |
+--------+----------+           +--------+--------+
         |                               |
         | (null = failure)              | (Diet JSON)
         v                               v
+-------------------+           +-----------------+
| 4.2 Fallback to  | <-------- | 4.3 Parse &     |
| Template + Mods   |  (fail)  | Validate JSON   |
+--------+----------+           +--------+--------+
         |                               |
         v                               v
+-------------------+          +------------------+
| 4.4 Apply Health  |         |  Diet Plan Data   |
| Modifiers (BMI,   |         |  (from Gemini)    |
| glucose, age,     |         +--------+----------+
| hypertension)     |                  |
+--------+----------+                  |
         |                             |
         +-------------+---------------+
                       |
                       v
              +--------+----------+
              | 4.5 Create        |
              | DietPlan Document |
              +-------------------+
                       |
                       v
              +--------+----------+
              | 4.6 Generate      |
              | WorkoutPlan       |
              | (Template-based)  |
              +-------------------+
```

### 7.5 DFD Level 2 - Authentication (Process 1.0)

```
+--------+     Email/Password      +-------------------+
|        | ----------------------> | 1.1 Validate      |
|  User  |                        | Credentials       |
|        |                        +--------+----------+
+--------+                                 |
    ^                             +--------v----------+
    |                             | 1.2 Check Lockout |
    |                             | (5 attempts =     |
    |                             |  30 min lock)     |
    |                             +--------+----------+
    |                                      |
    |                             +--------v----------+
    |                             | 1.3 bcrypt Compare|
    |                             | Password Hash     |
    |                             +--------+----------+
    |                                      |
    |     JWT Token               +--------v----------+
    | <-------------------------- | 1.4 Generate JWT  |
                                  | (24h or 30d)      |
                                  +-------------------+
```

### 7.6 Data Flow - User Registration to First Prediction

```
Step 1: Registration
  Guest --> POST /api/auth/register --> Validate --> bcrypt hash --> MongoDB (User, isVerified=false)

Step 2: Admin Verification
  Admin --> PUT /api/admin/users/:id/verify --> MongoDB (User.isVerified=true)

Step 3: Login
  User --> POST /api/auth/login --> Check lockout --> bcrypt compare --> JWT issued (24h)

Step 4: Health Assessment
  User --> POST /api/predictions --> Validate 10 fields --> mlService.predict()
    --> Flask /predict --> engineer_features() --> XGBoost model --> {prediction, probability, risk_level}

Step 5: Plan Generation (automatic)
  Backend --> geminiService.generateDietPlan(riskLevel, healthData)
    --> Gemini API --> Parse JSON --> DietPlan.create()
    (OR on failure) --> Template + Modifiers --> DietPlan.create()
  Backend --> WorkoutPlan.create() from templates + modifiers

Step 6: View Results
  User --> GET /api/predictions/:id --> Prediction document
  User --> GET /api/plans/diet/:predictionId --> DietPlan document
  User --> GET /api/plans/workout/:predictionId --> WorkoutPlan document
```

---

## 8. Database Design

### 8.1 Collections Overview

| Collection | Documents | Purpose | Key Indexes |
|-----------|-----------|---------|-------------|
| users | User accounts | Authentication, profiles, roles | email (unique), role+isVerified |
| predictions | Health assessments | Stroke risk results | userId+createdAt (desc) |
| dietplans | Nutrition plans | Diet recommendations per prediction | userId |
| workoutplans | Exercise plans | Workout recommendations per prediction | userId |
| doctors | Medical professionals | Doctor directory | specialization+isActive, rating (desc) |
| feedbacks | User feedback | User-submitted feedback & admin responses | userId |

### 8.2 Entity Relationship Diagram

```
+----------------+       1:N       +------------------+       1:1       +----------------+
|     User       | -------------> |   Prediction      | -------------> |   DietPlan     |
|----------------|                |------------------|                |----------------|
| _id (ObjectId) |                | _id (ObjectId)   |                | _id (ObjectId) |
| fullName       |                | userId (FK)      |                | userId (FK)    |
| email (unique) |                | healthData{}     |                | predictionId   |
| password (hash)|                | prediction (0/1) |                | riskLevel      |
| role           |                | probability      |                | guidelines[]   |
| isVerified     |                | riskLevel        |                | foodsToEat[]   |
| loginAttempts  |                | confidence       |                | foodsToAvoid[] |
| lockUntil      |                | topFeatures[]    |                | sampleMealPlan |
| verifiedBy(FK) |                | isActive         |                | specialNotes[] |
+----------------+                +------------------+                +----------------+
       |                                  |
       | 1:N                              | 1:1
       v                                  v
+----------------+                +------------------+
|   Feedback     |                |  WorkoutPlan     |
|----------------|                |------------------|
| _id (ObjectId) |                | _id (ObjectId)   |
| userId (FK)    |                | userId (FK)      |
| category       |                | predictionId     |
| subject        |                | riskLevel        |
| description    |                | guidelines[]     |
| rating (1-5)   |                | exercises[]      |
| screenshots[]  |                | weeklySchedule{} |
| status         |                | safetyNotes[]    |
| adminResponse  |                +------------------+
| respondedBy    |
+----------------+

+----------------+
|    Doctor      |        (Independent - no FK relationships)
|----------------|
| _id (ObjectId) |
| name           |
| specialization |
| hospital       |
| experience     |
| rating         |
| availableDays[]|
| consultationFee|
| isActive       |
+----------------+
```

### 8.3 Schema Details

#### User Schema
```javascript
{
  fullName:        { type: String, required: true, maxLength: 100 },
  email:           { type: String, required: true, unique: true, lowercase: true },
  password:        { type: String, required: true, minLength: 6, select: false },
  role:            { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified:      { type: Boolean, default: false },
  verifiedBy:      { type: ObjectId, ref: 'User' },
  verifiedAt:      { type: Date },
  rejectionReason: { type: String },
  loginAttempts:   { type: Number, default: 0 },
  lockUntil:       { type: Date },
  phone:           { type: String },
  dateOfBirth:     { type: Date },
  gender:          { type: String, enum: ['male', 'female', 'other', ''] },
  address:         { type: String }
}
```

#### Prediction Schema - healthData Sub-document
```javascript
healthData: {
  age:              { type: Number, required: true },         // 18-100
  gender:           { type: String, required: true },         // Male, Female
  hypertension:     { type: Number, required: true },         // 0 or 1
  heartDisease:     { type: Number, required: true },         // 0 or 1
  everMarried:      { type: String, required: true },         // Yes, No
  workType:         { type: String, required: true },         // Private, Self-employed, etc.
  residenceType:    { type: String, required: true },         // Urban, Rural
  avgGlucoseLevel:  { type: Number, required: true },         // 50-300 mg/dL
  bmi:              { type: Number, required: true },         // 10-60
  smokingStatus:    { type: String, required: true }          // never/formerly/smokes/Unknown
}
```

---

## 9. Module Descriptions

### 9.1 Module Overview

```
+-----------------------------------------------------------------------+
|                          WellTrack System                              |
|                                                                        |
|  +------------------+  +------------------+  +----------------------+  |
|  | Authentication   |  | Prediction       |  | Plan Generation      |  |
|  | Module           |  | Module           |  | Module               |  |
|  |                  |  |                  |  |                      |  |
|  | - Register       |  | - Health Form    |  | - Gemini Diet Plans  |  |
|  | - Login/Lockout  |  | - ML Prediction  |  | - Template Fallback  |  |
|  | - JWT Tokens     |  | - Risk Gauge     |  | - Workout Templates  |  |
|  | - Profile Mgmt   |  | - Feature Chart  |  | - Health Modifiers   |  |
|  +------------------+  +------------------+  +----------------------+  |
|                                                                        |
|  +------------------+  +------------------+  +----------------------+  |
|  | Doctor           |  | Feedback         |  | Admin                |  |
|  | Module           |  | Module           |  | Module               |  |
|  |                  |  |                  |  |                      |  |
|  | - Browse/Search  |  | - Submit Form    |  | - User Management    |  |
|  | - Risk Mapping   |  | - Star Ratings   |  | - Doctor CRUD        |  |
|  | - Specialization |  | - File Upload    |  | - Feedback Mgmt      |  |
|  | - Filtering      |  | - Admin Response |  | - Analytics Charts   |  |
|  +------------------+  +------------------+  +----------------------+  |
|                                                                        |
|  +------------------+  +------------------+                            |
|  | Chatbot          |  | ML Service       |                            |
|  | Module           |  | Module           |                            |
|  |                  |  |                  |                            |
|  | - Keyword Match  |  | - Feature Eng.   |                            |
|  | - 20+ Categories |  | - XGBoost Model  |                            |
|  | - Health Tips    |  | - Risk Scoring   |                            |
|  | - Emergency Info |  | - Model Training |                            |
|  +------------------+  +------------------+                            |
+-----------------------------------------------------------------------+
```

### 9.2 Authentication Module

**Purpose:** Handles user registration, login, session management, and profile updates.

**Key Features:**
- Password hashing with bcryptjs (10 salt rounds)
- JWT token generation with configurable expiry (24h default, 30d with "Remember Me")
- Login lockout mechanism: 5 failed attempts triggers 30-minute account lock
- Admin verification gate: users must be verified before accessing prediction features

**Files:**
| File | Role |
|------|------|
| `server/controllers/authController.js` | Register, login, getMe, updateProfile |
| `server/middleware/auth.js` | JWT verification, sets req.user |
| `server/middleware/adminAuth.js` | Admin role check |
| `server/middleware/loginLimiter.js` | 10 attempts per 15 min |
| `client/src/context/AuthContext.jsx` | Global auth state provider |
| `client/src/components/auth/LoginForm.jsx` | Login UI |
| `client/src/components/auth/RegisterForm.jsx` | Registration UI |

**Token Payload:**
```javascript
{ id: user._id, email: user.email, role: user.role, isVerified: user.isVerified }
```

### 9.3 Prediction Module

**Purpose:** Collects health data, communicates with ML service, stores results, and displays risk assessment.

**Input Parameters (10 fields):**
| Parameter | Type | Range/Values | Clinical Relevance |
|-----------|------|-------------|-------------------|
| age | Number | 18-100 | Strong stroke risk factor over 60 |
| gender | String | Male/Female | Males have higher incidence |
| hypertension | Binary | 0/1 | Major modifiable risk factor |
| heartDisease | Binary | 0/1 | Increases embolic stroke risk |
| everMarried | String | Yes/No | Proxy for age and stress factors |
| workType | String | 5 options | Lifestyle and stress indicator |
| residenceType | String | Urban/Rural | Healthcare access proxy |
| avgGlucoseLevel | Number | 50-300 mg/dL | Diabetes indicator |
| bmi | Number | 10-60 | Obesity-related stroke risk |
| smokingStatus | String | 4 options | Major modifiable risk factor |

**Output:**
| Field | Description |
|-------|-------------|
| prediction | Binary (0=No Stroke, 1=Stroke) |
| probability | Float (0.0 to 1.0) |
| riskLevel | Low (<0.3), Medium (0.3-0.6), High (>=0.6) |
| confidence | Max of class probabilities |
| topFeatures | Top 5 features by XGBoost importance |

### 9.4 Plan Generation Module

**Purpose:** Automatically generates personalized diet and workout plans after each prediction.

**Diet Plan Generation Flow:**
1. Attempt Google Gemini API call with patient health profile
2. If Gemini succeeds: parse and validate JSON response
3. If Gemini fails (rate limit, network error, missing key): fall back to templates
4. Template fallback applies health-aware modifiers based on patient data
5. Store DietPlan document in MongoDB

**Health-Aware Modifiers (Template Fallback):**
| Condition | Diet Modification |
|-----------|------------------|
| BMI > 30 | Add high-fiber foods, green tea; note portion control |
| Glucose > 200 | Avoid high GI foods; add cinnamon, bitter melon |
| Glucose 126-200 | Note pre-diabetic range monitoring |
| Age > 65 | Add calcium-rich foods, soft-textured proteins |
| Hypertension = 1 | Strictly limit sodium intake |

**Workout Plan Modifiers:**
| Condition | Workout Modification |
|-----------|---------------------|
| Age > 65 | Add balance exercises, reduce intensity, prefer low-impact |
| BMI > 35 | Start with seated/water-based exercises, progress gradually |

### 9.5 Doctor Recommendation Module

**Purpose:** Maps risk levels to medical specializations and provides filtered doctor listings.

**Specialization Mapping:**
| Risk Level | Recommended Specializations |
|-----------|---------------------------|
| High | Cardiologist, Neurologist, Internal Medicine |
| Medium | General Practitioner, Internal Medicine, Preventive Care |
| Low | General Practitioner, Preventive Care |

### 9.6 Admin Module

**Purpose:** Provides administrative oversight of the entire system.

**Sub-modules:**
| Sub-module | Functions |
|-----------|----------|
| User Management | List, search, filter, verify, reject, bulk verify users |
| Doctor Management | Create, update, soft-delete doctors |
| Feedback Management | View, filter by status, respond to user feedback |
| Analytics | 30-day prediction trends, user growth, feedback by category (Recharts) |

**Admin Stats Aggregation:**
```javascript
{
  totalUsers, verifiedUsers, pendingUsers,
  totalPredictions, totalDoctors, totalFeedback,
  riskDistribution: { Low: count, Medium: count, High: count }
}
```

### 9.7 Chatbot Module

**Purpose:** Client-side health assistant providing instant guidance.

**Implementation:** Keyword-matching algorithm with 20+ response categories, no server calls required.

**Categories:**
| Keyword Group | Response Topic |
|--------------|---------------|
| hello, hi | Greeting |
| help | Available commands |
| emergency, 911 | Emergency stroke signs (FAST) |
| symptom, sign | Stroke warning signs |
| risk, factor | Stroke risk factors |
| blood pressure | Hypertension management |
| diabetes, glucose, sugar | Glucose management |
| bmi, weight, obesity | Weight management |
| smoking, cigarette | Smoking cessation |
| exercise, workout | Physical activity |
| diet, food, nutrition | Dietary guidance |
| doctor, specialist | Finding medical help |
| prediction, assess | Using the prediction tool |
| plan | Viewing health plans |
| heart | Heart disease info |
| age | Age-related risks |
| stress, anxiety | Stress management |
| medication, medicine | Medication guidance |

---

## 10. Machine Learning Model

### 10.1 Dataset

**Source:** Kaggle Stroke Prediction Dataset
- **Total Records:** 5,110 patients
- **After Filtering (age >= 18, gender != 'Other'):** 4,254 records
- **Class Distribution:** ~5% positive (stroke), ~95% negative (highly imbalanced)
- **Features:** 10 clinical and demographic attributes
- **Target Variable:** stroke (binary: 0 or 1)

### 10.2 Feature Engineering Pipeline

Five engineered features are derived from the raw input:

| Engineered Feature | Formula | Purpose |
|-------------------|---------|---------|
| age_group | Bins: young (0-40), middle (40-60), senior (60+) | Categorical age representation |
| bmi_category | underweight (<18.5), normal (18.5-25), overweight (25-30), obese (30+) | WHO BMI classification |
| glucose_risk | normal (<100), prediabetic (100-126), diabetic (126+) | Diabetes risk category |
| composite_risk | hypertension\*0.3 + heart_disease\*0.3 + (glucose>126)\*0.2 + (bmi>30)\*0.1 + (age>60)\*0.1 | Weighted multi-factor risk score |
| age_bmi_interaction | age \* bmi / 100 | Non-linear age-BMI interaction term |

**Total Features Used by Model: 15**
- Numeric (7): age, hypertension, heart_disease, avg_glucose_level, bmi, composite_risk, age_bmi_interaction
- Categorical (8): gender, ever_married, work_type, Residence_type, smoking_status, age_group, bmi_category, glucose_risk

### 10.3 Preprocessing Pipeline

```python
ColumnTransformer([
    ('num', StandardScaler(), numeric_features),      # Z-score normalization
    ('cat', OrdinalEncoder(handle_unknown='use_encoded_value',
                           unknown_value=-1), categorical_features)
])
```

- **StandardScaler:** Normalizes numeric features to zero mean, unit variance
- **OrdinalEncoder:** Encodes categorical features as integers; unknown categories mapped to -1

### 10.4 Model Architecture

**Algorithm:** XGBoost (eXtreme Gradient Boosting) Classifier

**Hyperparameters:**
| Parameter | Value | Justification |
|-----------|-------|---------------|
| n_estimators | 100 | Number of boosting rounds |
| max_depth | 4 | Tree depth limit to prevent overfitting |
| learning_rate | 0.1 | Step size shrinkage |
| scale_pos_weight | 16.2 | Ratio of negative to positive samples (handles class imbalance) |
| eval_metric | logloss | Binary cross-entropy loss |
| random_state | 42 | Reproducibility |

### 10.5 Training Results

**Data Split:** 80% train (3,402 samples, 198 positive) / 20% test (851 samples, 49 positive)

**Classification Report:**

| Class | Precision | Recall | F1-Score | Support |
|-------|-----------|--------|----------|---------|
| 0 (No Stroke) | 0.96 | 0.85 | 0.90 | 802 |
| 1 (Stroke) | 0.14 | 0.39 | 0.20 | 49 |
| **Weighted Avg** | **0.91** | **0.83** | **0.86** | **851** |

**Key Metrics:**
| Metric | Value |
|--------|-------|
| AUC-ROC | 0.7875 |
| Accuracy | 83% |
| Stroke Recall | 39% |

**Confusion Matrix:**
```
                Predicted
              No Stroke  Stroke
Actual  No Stroke  684     118
        Stroke      30      19
```

**Interpretation:**
- The model correctly identifies 39% of actual stroke cases (recall for class 1)
- AUC-ROC of 0.79 indicates good discriminative ability
- `scale_pos_weight=16.2` compensates for the severe class imbalance (only ~5% stroke cases)
- The model prioritizes sensitivity over specificity for the health domain, as missing a stroke case is more dangerous than a false positive

### 10.6 Risk Level Classification

| Probability Range | Risk Level | Action Triggered |
|------------------|------------|-----------------|
| < 0.3 | Low | Wellness plans (Low template) |
| 0.3 - 0.6 | Medium | Health plans (Medium template) |
| >= 0.6 | High | Urgent plans (High template) + specialist doctors |

---

## 11. AI Integration - Google Gemini

### 11.1 Purpose

Replace static template-based diet plans with dynamically generated, personalized nutrition plans using Google Gemini's generative AI capabilities.

### 11.2 Implementation

**Service:** `server/services/geminiService.js`
**Model Used:** `gemini-2.0-flash`
**SDK:** `@google/generative-ai` v0.24.1

### 11.3 Prompt Engineering

The system constructs a detailed clinical prompt:

```
You are a clinical nutritionist creating a personalized diet plan
for a patient with the following health profile:

- Stroke Risk Level: {riskLevel}
- Age: {age}
- BMI: {bmi}
- Average Glucose Level: {avgGlucoseLevel}
- Hypertension: {Yes/No}
- Heart Disease: {Yes/No}
- Smoking Status: {smokingStatus}

Generate a personalized diet plan as a JSON object with exactly this structure:
{
  "guidelines": [...],
  "foodsToEat": [...],
  "foodsToAvoid": [...],
  "sampleMealPlan": { "breakfast": [...], "lunch": [...], "dinner": [...], "snacks": [...] },
  "specialNotes": [...]
}
```

### 11.4 Response Parsing & Validation

1. Strip markdown code fences (```json ... ```) if present
2. Parse JSON string
3. Validate all 5 required top-level fields exist
4. Validate all 4 meal plan sub-arrays exist
5. Return null on any failure (triggers template fallback)

### 11.5 Fallback Strategy

```
Gemini API Call
    |
    +-- Success --> Parse JSON --> Validate --> Use Gemini plan
    |
    +-- Failure (any reason) --> Log error --> Use template plan + modifiers
         |
         +-- No API key configured
         +-- Rate limit exceeded (429)
         +-- Network error
         +-- Invalid JSON response
         +-- Missing required fields
```

This ensures the application never breaks regardless of Gemini API availability.

---

## 12. API Design

### 12.1 RESTful API Endpoints

#### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | JWT | Get current user profile |
| PUT | `/api/auth/profile` | JWT | Update profile fields |

#### Predictions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/predictions` | JWT + Verified | Create new prediction |
| GET | `/api/predictions` | JWT | List predictions (paginated) |
| GET | `/api/predictions/:id` | JWT | Get single prediction |

#### Plans

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/plans/diet/:predictionId` | JWT | Get diet plan for prediction |
| GET | `/api/plans/workout/:predictionId` | JWT | Get workout plan for prediction |
| GET | `/api/plans/prediction/:predictionId` | JWT | Get both plans |

#### Doctors

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/doctors` | JWT | List doctors (filtered, paginated) |
| GET | `/api/doctors/:id` | JWT | Get single doctor |
| GET | `/api/doctors/recommended` | JWT | Get risk-matched doctors |

#### Feedback

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/feedback` | JWT | Submit feedback (multipart) |
| GET | `/api/feedback/my` | JWT | Get user's feedback |

#### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | Admin | List/search users |
| PUT | `/api/admin/users/:id/verify` | Admin | Verify user |
| PUT | `/api/admin/users/:id/reject` | Admin | Reject user |
| PUT | `/api/admin/users/bulk-verify` | Admin | Bulk verify |
| GET | `/api/admin/stats` | Admin | Dashboard statistics |
| GET | `/api/admin/analytics` | Admin | 30-day analytics data |
| GET | `/api/admin/doctors` | Admin | List all doctors |
| POST | `/api/admin/doctors` | Admin | Create doctor |
| PUT | `/api/admin/doctors/:id` | Admin | Update doctor |
| DELETE | `/api/admin/doctors/:id` | Admin | Soft-delete doctor |
| GET | `/api/admin/feedback` | Admin | List all feedback |
| PUT | `/api/admin/feedback/:id/respond` | Admin | Respond to feedback |

#### ML Service (Internal)

| Method | Endpoint | Port | Description |
|--------|----------|------|-------------|
| GET | `/health` | 5001 | Health check |
| POST | `/predict` | 5001 | Stroke prediction |

### 12.2 API Request/Response Examples

**Create Prediction - Request:**
```json
POST /api/predictions
Authorization: Bearer <jwt_token>

{
  "age": 67,
  "gender": "Male",
  "hypertension": 1,
  "heartDisease": 1,
  "everMarried": "Yes",
  "workType": "Private",
  "residenceType": "Urban",
  "avgGlucoseLevel": 228.69,
  "bmi": 36.6,
  "smokingStatus": "formerly smoked"
}
```

**Create Prediction - Response:**
```json
{
  "prediction": {
    "id": "6993dac331862ac14e986cb1",
    "prediction": 1,
    "probability": 0.7234,
    "riskLevel": "High",
    "confidence": 0.7234,
    "topFeatures": [
      { "feature": "age", "importance": 0.2341 },
      { "feature": "avg_glucose_level", "importance": 0.1892 },
      { "feature": "composite_risk", "importance": 0.1456 },
      { "feature": "bmi", "importance": 0.1123 },
      { "feature": "hypertension", "importance": 0.0987 }
    ],
    "healthData": { ... },
    "createdAt": "2026-02-17T08:34:36.000Z"
  }
}
```

---

## 13. Security Implementation

### 13.1 Security Layers

```
Request Flow:
  Client --> HTTPS --> Helmet Headers --> CORS Check --> Rate Limiter
    --> JWT Verification --> Admin Check (if admin route)
    --> Input Validation --> Sanitization --> Controller Logic
```

### 13.2 Security Features Summary

| Feature | Implementation | Configuration |
|---------|---------------|---------------|
| Password Hashing | bcryptjs | 10 salt rounds |
| Authentication | JWT Bearer token | 24h expiry (30d with Remember Me) |
| Login Lockout | Attempt counter + time lock | 5 attempts = 30 min lock |
| Rate Limiting | express-rate-limit | 100 req/15min general, 10 req/15min login |
| HTTP Headers | Helmet | Cross-origin, XSS, MIME sniffing protection |
| CORS | cors middleware | Restricted to localhost:3000 |
| Input Validation | express-validator | Type checks, ranges, required fields |
| Input Sanitization | Custom helper | Strips $ prefixed keys (NoSQL injection prevention) |
| Admin Gate | Role-based middleware | DB role check on every admin request |
| Verification Gate | isVerified flag | Users must be admin-verified for predictions |
| File Upload | Multer | Max 3 files, 5MB each, image types only |
| Password Security | select: false | Password not returned in queries by default |

### 13.3 JWT Token Structure

```javascript
// Payload
{
  id: "ObjectId",
  email: "user@example.com",
  role: "user",           // or "admin"
  isVerified: true         // or false
}

// Signed with: config.jwtSecret
// Expiry: 24h (default) or 30d (remember me)
```

---

## 14. Frontend Implementation

### 14.1 Component Architecture

```
App.js
├── AuthContext.Provider
│   ├── Navbar
│   ├── Routes
│   │   ├── Public Routes
│   │   │   ├── LandingPage
│   │   │   ├── LoginPage --> LoginForm
│   │   │   └── RegisterPage --> RegisterForm
│   │   │
│   │   ├── Protected Routes (ProtectedRoute wrapper)
│   │   │   ├── DashboardPage --> UserDashboard
│   │   │   ├── PredictionPage --> HealthForm (Step1 + Step2)
│   │   │   ├── ResultPage --> PredictionResult (RiskGauge + FeatureChart)
│   │   │   ├── HistoryPage --> PredictionHistory
│   │   │   ├── DietPlanPage --> DietPlan
│   │   │   ├── WorkoutPlanPage --> WorkoutPlan
│   │   │   ├── DoctorsPage --> DoctorList (DoctorFilters + DoctorCard)
│   │   │   ├── FeedbackPage --> FeedbackForm
│   │   │   └── ProfilePage
│   │   │
│   │   └── Admin Routes (AdminRoute wrapper)
│   │       └── AdminDashboardPage --> AdminDashboard
│   │           ├── AdminStats
│   │           ├── UserManagement
│   │           ├── DoctorManagement (DoctorFormModal)
│   │           ├── FeedbackManagement
│   │           └── AnalyticsCharts
│   │
│   ├── ChatWidget (ChatMessage + ChatInput)
│   └── Footer
```

### 14.2 State Management

| Layer | Tool | Scope |
|-------|------|-------|
| Global Auth | React Context (AuthContext) | User session, login/logout |
| API Calls | Custom useApi hook | Per-component loading/error states |
| Form State | Custom useForm hook | Per-form values, validation, errors |
| Local State | React useState | Component-level UI state |

### 14.3 Route Protection

```
ProtectedRoute:
  - Not authenticated? --> Redirect to /login
  - Not verified? --> Show warning banner (limited access)
  - Verified? --> Render child route

AdminRoute:
  - Not admin role? --> Redirect to /dashboard
  - Admin? --> Render admin component
```

### 14.4 Key Frontend Services (Axios)

| Service | Base Endpoint | Functions |
|---------|--------------|-----------|
| api.js | http://localhost:5050/api | Request/response interceptors, auto-attach JWT |
| authService.js | /auth | register, login, getMe, updateProfile |
| predictionService.js | /predictions | createPrediction, getPredictions, getPrediction |
| planService.js | /plans | getDietPlan, getWorkoutPlan, getPlansByPrediction |
| doctorService.js | /doctors | getDoctors, getDoctor, getRecommended |
| feedbackService.js | /feedback | createFeedback, getMyFeedback |
| adminService.js | /admin | 13 functions for all admin operations |

---

## 15. Testing & Validation

### 15.1 Input Validation Matrix

| Field | Frontend Validation | Backend Validation | ML Validation |
|-------|--------------------|--------------------|---------------|
| age | 18-100, required | isInt({min:18,max:100}) | 18-100 |
| gender | Select dropdown | isIn(['Male','Female']) | Required |
| hypertension | Toggle 0/1 | isIn([0,1]) | Required |
| heartDisease | Toggle 0/1 | isIn([0,1]) | Required |
| everMarried | Select dropdown | isIn(['Yes','No']) | Required |
| workType | Select dropdown | isIn([5 values]) | Required |
| residenceType | Select dropdown | isIn(['Urban','Rural']) | Required |
| avgGlucoseLevel | 50-300, required | isFloat({min:50,max:300}) | 50-300 |
| bmi | 10-60, required | isFloat({min:10,max:60}) | 10-60 |
| smokingStatus | Select dropdown | isIn([4 values]) | Required |

### 15.2 Verification Checklist

| Test Case | Expected Result | Status |
|-----------|----------------|--------|
| Register with valid data | Account created, redirect to login | Pass |
| Register with duplicate email | Error: "Email already registered" | Pass |
| Login with wrong password (5x) | Account locked for 30 minutes | Pass |
| Unverified user tries prediction | 403: "Account must be verified" | Pass |
| Admin verifies user | isVerified=true, user can predict | Pass |
| Submit health form with valid data | Prediction created, plans generated | Pass |
| View prediction from history | Full result with gauge, charts | Pass |
| View diet plan | Guidelines, foods, meal plan displayed | Pass |
| View workout plan | Exercises, schedule, safety notes displayed | Pass |
| Gemini API available | Personalized AI-generated diet plan | Pass |
| Gemini API unavailable | Template-based fallback plan | Pass |
| Submit feedback with screenshots | Feedback stored with file paths | Pass |
| Admin views analytics | Charts render with 30-day data | Pass |

---

## 16. Screenshots & UI Flow

### 16.1 User Journey Flow

```
Landing Page
    |
    v
Register --> Login --> Dashboard (Unverified - Limited)
                          |
                    [Admin Verifies]
                          |
                          v
                    Dashboard (Verified)
                     /    |    \      \
                    v     v     v      v
              Predict  History Doctors Feedback
                |
                v
          Health Form (Step 1: Demographics)
                |
                v
          Health Form (Step 2: Health Metrics)
                |
                v
          Prediction Result (Gauge + Chart)
              /        |         \
             v         v          v
        Diet Plan  Workout Plan  Recommended Doctors
```

### 16.2 Admin Journey Flow

```
Admin Login --> Admin Dashboard
                    |
        +-----------+-----------+-----------+
        |           |           |           |
        v           v           v           v
    Users Tab   Doctors Tab  Feedback Tab  Analytics Tab
        |           |           |           |
        v           v           v           v
    Verify/      Create/     Respond to   View Charts
    Reject       Edit/       Feedback     (Trends,
    Users        Delete                    Growth)
                 Doctors
```

---

## 17. Limitations & Future Scope

### 17.1 Current Limitations

| Limitation | Description |
|-----------|-------------|
| Dataset Size | Trained on 5,110 records; larger datasets would improve accuracy |
| Class Imbalance | Only ~5% stroke cases; model has 39% recall for stroke detection |
| Single Disease | Currently limited to stroke prediction only |
| No Real-time Monitoring | One-time assessment only, no continuous health tracking |
| Local Deployment | Runs on localhost; no cloud deployment |
| Chatbot Intelligence | Keyword-matching only, no NLP or context awareness |
| No Email Notifications | Email service configured but not actively sending |

### 17.2 Future Enhancements

| Enhancement | Description |
|-------------|-------------|
| Multi-disease Prediction | Extend to diabetes, heart disease, hypertension prediction |
| Deep Learning Models | Implement LSTM/Transformer models for time-series health data |
| Wearable Integration | Connect to Fitbit/Apple Watch for continuous monitoring |
| NLP Chatbot | Replace keyword matching with Gemini-powered conversational AI |
| Cloud Deployment | Deploy on AWS/GCP with auto-scaling |
| Telemedicine | In-app video consultation with recommended doctors |
| Mobile App | React Native cross-platform mobile application |
| SMOTE/ADASYN | Advanced oversampling techniques for better class balance |
| Explainable AI | SHAP values for detailed feature contribution explanations |
| Multi-language Support | Internationalization for wider accessibility |

---

## 18. Conclusion

WellTrack successfully demonstrates the integration of machine learning with modern web technologies to create an accessible healthcare risk assessment platform. The system achieves its core objectives:

1. **Accurate Risk Prediction:** An XGBoost model trained on real clinical data (AUC-ROC: 0.79) provides meaningful stroke risk assessments with probability scores and contributing factor analysis.

2. **AI-Powered Personalization:** Google Gemini integration generates truly personalized diet plans based on individual health profiles, with a robust template-based fallback ensuring uninterrupted service.

3. **Comprehensive Health Management:** Beyond prediction, the system provides actionable workout plans, doctor recommendations, and instant health guidance through an interactive chatbot.

4. **Enterprise-Grade Security:** Multi-layered security including JWT authentication, bcrypt hashing, login lockout, rate limiting, input validation, and admin verification ensures data protection and access control.

5. **Scalable Architecture:** The three-service microservice architecture (React + Express + Flask) allows independent scaling and deployment of each component.

The project demonstrates proficiency in full-stack development, machine learning integration, API design, database modeling, and AI service orchestration, making it a comprehensive healthcare technology solution.

---

## 19. References

1. World Health Organization (2021). "Stroke, Cerebrovascular accident." WHO Fact Sheets.
2. fedesoriano (2021). "Stroke Prediction Dataset." Kaggle. https://www.kaggle.com/datasets/fedesoriano/stroke-prediction-dataset
3. Chen, T., & Guestrin, C. (2016). "XGBoost: A Scalable Tree Boosting System." Proceedings of the 22nd ACM SIGKDD.
4. Google (2024). "Gemini API Documentation." Google AI for Developers.
5. MongoDB Documentation. https://www.mongodb.com/docs/
6. Express.js Documentation. https://expressjs.com/
7. React Documentation. https://react.dev/
8. scikit-learn Documentation. https://scikit-learn.org/stable/

---

**Project:** WellTrack - AI-Powered Stroke Risk Prediction & Health Management System
**Technology:** MERN Stack + Flask + XGBoost + Google Gemini AI
**Database:** MongoDB
**Architecture:** Three-Tier Microservice
