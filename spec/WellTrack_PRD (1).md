# WellTrack – Intelligent Healthcare Management System
## Product Requirements Document (PRD)

---

## Document Information

| Field | Details |
|-------|---------|
| **Project Name** | WellTrack – Intelligent Healthcare Management System |
| **Document Version** | 1.0 |
| **Date** | February 16, 2026 |
| **Document Owner** | Final Year Project Team |
| **Status** | Development Phase |
| **Classification** | Academic Project |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [User Personas](#3-user-personas)
4. [System Architecture](#4-system-architecture)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [User Interface Specifications](#7-user-interface-specifications)
8. [Database Schema](#8-database-schema)
9. [API Endpoints Specification](#9-api-endpoints-specification)
10. [ML Model Specifications](#10-ml-model-specifications)
11. [Testing Strategy](#11-testing-strategy)
12. [Deployment Plan](#12-deployment-plan)
13. [Maintenance & Support](#13-maintenance--support)
14. [Risks & Mitigation](#14-risks--mitigation)
15. [Success Criteria & KPIs](#15-success-criteria--kpis)
16. [Glossary](#16-glossary)
17. [Appendices](#17-appendices)

---

## 1. EXECUTIVE SUMMARY

### 1.1 Product Overview

WellTrack is an intelligent healthcare management system designed to predict stroke and disease risk using machine learning algorithms. The system provides personalized health risk assessments, AI-generated diet and workout plans, and connects high-risk patients with recommended healthcare providers.

### 1.2 Problem Statement

Current healthcare systems lack proactive risk assessment tools that can:
- Predict stroke risk before symptoms appear
- Provide personalized preventive care recommendations
- Connect patients with appropriate healthcare providers
- Enable early intervention for high-risk individuals

### 1.3 Solution

WellTrack addresses these challenges through:
- **ML-powered risk prediction** (89.73% accuracy, AUC 0.8243)
- **Personalized health recommendations** via AI agents
- **Doctor recommendation system** based on risk levels
- **User-friendly interface** for patients and administrators

### 1.4 Target Users

- **Primary**: Adult patients (18-80 years) seeking preventive healthcare
- **Secondary**: Healthcare administrators managing patient care
- **Tertiary**: Medical professionals receiving patient referrals

---

## 2. PRODUCT VISION & GOALS

### 2.1 Vision Statement

*"To revolutionize preventive healthcare by empowering individuals with AI-driven health insights and connecting them with timely medical intervention."*

### 2.2 Business Goals

1. **Health Impact**: Reduce stroke incidence through early detection by 30%
2. **User Adoption**: Achieve 10,000 registered users in first year
3. **Accuracy**: Maintain ML model accuracy >85% (clinical standard)
4. **Response Time**: Provide risk predictions in <3 seconds
5. **User Satisfaction**: Achieve 4.5+ star rating from users

### 2.3 Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Prediction Accuracy | >89% | Model evaluation metrics |
| User Registration | 10,000 users | Database analytics |
| Prediction Response Time | <3 seconds | API monitoring |
| User Engagement | 60% monthly active | Usage analytics |
| High-Risk Detection Rate | >75% sensitivity | Clinical validation |

---

## 3. USER PERSONAS

### 3.1 Persona 1: Health-Conscious Professional

**Name**: Sarah Chen  
**Age**: 45  
**Occupation**: Marketing Manager  
**Tech Savvy**: High

**Background**:
- Family history of cardiovascular disease
- Works 50+ hours/week
- Limited time for doctor visits
- Proactive about health monitoring

**Goals**:
- Monitor stroke risk without frequent doctor visits
- Get personalized health recommendations
- Track health metrics over time
- Receive alerts for concerning trends

**Pain Points**:
- Doesn't know when to seek medical attention
- Overwhelmed by generic health advice online
- Finds it difficult to schedule preventive checkups
- Wants data-driven health insights

**Use Case**:
Sarah logs into WellTrack monthly, enters her current health metrics (BMI, glucose levels, blood pressure), receives risk assessment, and follows personalized diet/workout plans. When her risk increases, she uses the doctor recommendation feature.

---

### 3.2 Persona 2: Senior Citizen

**Name**: Robert Williams  
**Age**: 68  
**Occupation**: Retired Teacher  
**Tech Savvy**: Low-Medium

**Background**:
- History of hypertension
- Lives alone
- Regular doctor visits
- Wants to stay independent

**Goals**:
- Simple way to check health status
- Clear, actionable recommendations
- Easy access to doctors if needed
- Peace of mind about health

**Pain Points**:
- Confused by complex medical terminology
- Difficulty remembering health metrics
- Worried about missing warning signs
- Limited mobility for doctor visits

**Use Case**:
Robert uses WellTrack's simple interface to log basic health data. The system alerts him with clear messages when his stroke risk is elevated and provides a list of nearby doctors with appointment availability.

---

### 3.3 Persona 3: Healthcare Administrator

**Name**: Dr. Emily Rodriguez  
**Age**: 38  
**Occupation**: Hospital Administrator  
**Tech Savvy**: High

**Goals**:
- Manage patient onboarding efficiently
- Monitor high-risk patient pool
- Verify user authenticity
- Access user feedback for system improvement
- Manage doctor recommendations database

**Pain Points**:
- Manual patient verification is time-consuming
- Difficulty tracking which patients need follow-up
- Limited insight into system effectiveness
- Need to update doctor availability regularly

**Use Case**:
Dr. Rodriguez logs into the admin portal, reviews pending user registrations, verifies identities, updates doctor recommendations based on specializations, and reviews user feedback to improve service quality.

---

## 4. SYSTEM ARCHITECTURE

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React.js Frontend (Port 3000)                           │  │
│  │  - User Interface (Patient Portal)                       │  │
│  │  - Admin Dashboard                                       │  │
│  │  - Responsive Design (Mobile + Desktop)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP/HTTPS (REST API)
┌───────────────────────────────▼─────────────────────────────────┐
│                     APPLICATION LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Node.js + Express Backend (Port 5000)                   │  │
│  │  - Authentication & Authorization (JWT)                  │  │
│  │  - API Gateway                                           │  │
│  │  - Business Logic                                        │  │
│  │  - Request Orchestration                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────┬─────────────────────┬─────────────────────┬──────────────┘
      │                     │                     │
      │ HTTP POST           │ MongoDB Queries     │ API Calls
      │                     │                     │
      ▼                     ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  ML SERVICE     │  │  DATABASE       │  │  AI AGENTS      │
│  ────────────   │  │  ────────────   │  │  ────────────   │
│  Flask API      │  │  MongoDB        │  │  Diet Planner   │
│  (Port 5001)    │  │  (Port 27017)   │  │  Workout Agent  │
│                 │  │                 │  │  Chatbot        │
│  - XGBoost      │  │  Collections:   │  │                 │
│  - Preprocessor │  │  - users        │  │  Optional:      │
│  - Prediction   │  │  - predictions  │  │  - OpenAI API   │
│  - Feature Eng. │  │  - health_data  │  │  - Custom LLM   │
│                 │  │  - doctors      │  │                 │
│                 │  │  - feedbacks    │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

### 4.2 Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Frontend** | React.js | Component-based, fast rendering, large ecosystem |
| **Backend** | Node.js + Express | Non-blocking I/O, JavaScript full-stack, scalable |
| **ML Service** | Flask (Python) | Python ML libraries, lightweight, easy deployment |
| **Database** | MongoDB | Flexible schema, JSON documents, horizontal scaling |
| **ML Framework** | XGBoost + scikit-learn | Best accuracy for healthcare, proven performance |
| **Authentication** | JWT (JSON Web Tokens) | Stateless, secure, scalable |
| **API Protocol** | REST | Standard, widely supported, easy testing |

### 4.3 Data Flow Architecture

**Scenario: User Gets Stroke Risk Prediction**

```
1. USER ACTION
   └─> Fills health details form in React
       (Age: 67, BMI: 36.6, Glucose: 228.69, etc.)

2. FRONTEND VALIDATION
   └─> React validates input fields
       └─> Sends POST request to Node.js backend
           Endpoint: /api/prediction/predict

3. BACKEND PROCESSING
   └─> Express receives request
       └─> Authenticates user (JWT verification)
           └─> Logs request for analytics
               └─> Forwards to Flask ML service
                   Endpoint: http://localhost:5001/predict

4. ML PREDICTION
   └─> Flask receives health data
       └─> Loads preprocessor.pkl
           └─> Preprocesses input:
               - Handles missing values
               - Feature engineering (age groups, BMI categories)
               - Encodes categorical variables
               - Scales numerical features
               └─> Loads trained XGBoost model (welltrack_xgb_model.pkl)
                   └─> Generates prediction
                       └─> Returns:
                           {
                             prediction: 1 (High Risk),
                             probability: 0.87,
                             risk_level: "High",
                             confidence: 0.87
                           }

5. BACKEND POST-PROCESSING
   └─> Node.js receives ML prediction
       └─> Stores in MongoDB:
           - User ID
           - Health data
           - Prediction result
           - Timestamp
           └─> If High Risk detected:
               └─> Triggers AI Diet/Workout Planner
                   └─> Generates personalized recommendations
                       └─> Fetches recommended doctors from database

6. RESPONSE TO FRONTEND
   └─> Complete package sent to React:
       {
         success: true,
         prediction: {
           risk_level: "High",
           probability: 87%,
           message: "High stroke risk detected"
         },
         recommendations: {
           diet: [...],
           workout: [...]
         },
         doctors: [...]
       }

7. FRONTEND DISPLAY
   └─> React renders:
       - Risk assessment card (color-coded)
       - Probability gauge
       - Personalized diet plan
       - Workout recommendations
       - List of recommended doctors with "Book Appointment" buttons
```

---

## 5. FUNCTIONAL REQUIREMENTS

### 5.1 User Module (Patient Portal)

#### 5.1.1 User Registration & Authentication

**FR-U-001: User Registration**
- **Priority**: P0 (Critical)
- **Description**: Users must be able to create accounts with email verification
- **Acceptance Criteria**:
  - User provides: Email, Password, Full Name, Date of Birth, Phone Number
  - Email validation (valid format)
  - Password requirements: Min 8 characters, 1 uppercase, 1 number, 1 special char
  - Duplicate email check
  - Verification email sent
  - Account created in "pending verification" state
- **Data Flow**: Frontend → Node.js → MongoDB (users collection)

**FR-U-002: User Login**
- **Priority**: P0 (Critical)
- **Description**: Registered users must be able to log in securely
- **Acceptance Criteria**:
  - Email and password authentication
  - JWT token generated on successful login (expires in 24 hours)
  - Failed login attempts logged (max 5 attempts, then 15-min lockout)
  - "Remember Me" option (30-day token)
  - Forgot password functionality
- **Security**: Passwords hashed using bcrypt (salt rounds: 10)

**FR-U-003: Admin Verification**
- **Priority**: P0 (Critical)
- **Description**: Admin must verify users before full system access
- **Acceptance Criteria**:
  - Users can't access prediction features until verified
  - Verification status shown in user profile
  - Email notification sent when verified
  - Reason field for rejection

---

#### 5.1.2 Health Data Entry

**FR-U-004: Enter Health Details**
- **Priority**: P0 (Critical)
- **Description**: Users input health parameters for risk prediction
- **Input Fields**:
  1. **Age** (Number, 18-100, Required)
  2. **Gender** (Dropdown: Male/Female/Other, Required)
  3. **BMI** (Number, 10-60, Required)
     - OR Height & Weight (auto-calculates BMI)
  4. **Hypertension** (Checkbox: Yes/No, Required)
  5. **Heart Disease** (Checkbox: Yes/No, Required)
  6. **Ever Married** (Radio: Yes/No, Required)
  7. **Work Type** (Dropdown: Private/Self-employed/Govt/Children/Never worked, Required)
  8. **Residence Type** (Radio: Urban/Rural, Required)
  9. **Average Glucose Level** (Number, 50-300 mg/dL, Required)
  10. **Smoking Status** (Dropdown: Never/Formerly/Currently, Required)

- **Validation Rules**:
  - All fields required
  - Numeric ranges enforced
  - Helpful error messages ("BMI must be between 10 and 60")
  - Real-time validation on field blur
  - Form-level validation on submit

- **User Experience**:
  - Progress indicator (Step 1 of 2)
  - Tooltips explaining each field
  - Auto-save to draft (recoverable if user leaves)
  - Pre-fill from previous entries (optional)

---

#### 5.1.3 ML Prediction & Results

**FR-U-005: Risk Prediction**
- **Priority**: P0 (Critical)
- **Description**: System generates stroke risk prediction using ML model
- **Process**:
  1. User submits health data
  2. System validates input
  3. Data sent to ML service
  4. XGBoost model predicts risk
  5. Result returned in <3 seconds
  
- **Output**:
  - **Risk Level**: Low / Medium / High
  - **Probability**: Percentage (0-100%)
  - **Confidence Score**: Model confidence
  - **Risk Factors**: Top 5 contributing factors
  - **Timestamp**: When prediction was made

- **Acceptance Criteria**:
  - Prediction accuracy >89%
  - Response time <3 seconds
  - Results stored in database
  - User can view prediction history
  - Clear visual indicators (color-coded: Green/Yellow/Red)

**FR-U-006: View Prediction Results**
- **Priority**: P0 (Critical)
- **Description**: Users can view current and historical predictions
- **Display Components**:
  1. **Risk Dashboard**:
     - Current risk level (large card)
     - Probability gauge/meter
     - Trend chart (if multiple predictions)
  
  2. **Risk Breakdown**:
     - Feature contribution chart
     - Explanation in plain language
     - Comparison to average population
  
  3. **Prediction History**:
     - Table of all past predictions
     - Date, Risk Level, Probability
     - Filter by date range
     - Export to PDF

- **User Experience**:
  - Mobile-responsive design
  - Print-friendly format
  - Share via email option
  - Download as PDF

---

#### 5.1.4 AI-Generated Health Plans

**FR-U-007: Personalized Diet Plan**
- **Priority**: P1 (High)
- **Description**: AI generates customized diet recommendations based on risk level
- **Inputs**:
  - Prediction result (risk level)
  - BMI
  - Glucose level
  - Age
  - Any dietary restrictions (optional user input)

- **Output Format**:
  - **General Guidelines**: 3-5 bullet points
  - **Foods to Eat**: List with explanations
  - **Foods to Avoid**: List with reasons
  - **Sample Meal Plan**: Breakfast, Lunch, Dinner, Snacks
  - **Hydration Goals**: Water intake recommendations

- **Example Output** (High Risk):
  ```
  Diet Recommendations for High Stroke Risk:
  
  General Guidelines:
  - Reduce sodium intake to <2000mg per day
  - Increase omega-3 fatty acids (fish, nuts)
  - Focus on whole grains and fiber
  
  Foods to Eat:
  - Leafy greens (spinach, kale)
  - Fatty fish (salmon, mackerel) 2-3x/week
  - Berries (antioxidants)
  - Whole grains (oats, quinoa)
  
  Foods to Avoid:
  - Processed meats (high sodium)
  - Fried foods (trans fats)
  - Sugary beverages
  - Excessive red meat
  ```

**FR-U-008: Personalized Workout Plan**
- **Priority**: P1 (High)
- **Description**: AI generates exercise recommendations
- **Inputs**:
  - Risk level
  - Age
  - BMI
  - Current activity level (optional)

- **Output Format**:
  - **Weekly Exercise Goals**: Minutes per week
  - **Cardio Exercises**: Types and duration
  - **Strength Training**: Exercises and frequency
  - **Flexibility**: Stretching routines
  - **Safety Precautions**: Based on age/risk

- **Example Output** (High Risk, Age 67):
  ```
  Workout Recommendations:
  
  Weekly Goals: 150 minutes moderate activity
  
  Cardio (5 days/week, 30 min each):
  - Brisk walking
  - Swimming (low-impact)
  - Stationary bike
  
  Strength Training (2-3 days/week):
  - Light weights or resistance bands
  - Focus on major muscle groups
  
  Safety Notes:
  - Consult doctor before starting
  - Monitor heart rate
  - Stay hydrated
  ```

---

#### 5.1.5 Doctor Recommendations

**FR-U-009: View Recommended Doctors**
- **Priority**: P1 (High)
- **Description**: System recommends doctors based on risk level and location
- **Logic**:
  - **High Risk**: Cardiologists, Neurologists
  - **Medium Risk**: General Practitioners, Internal Medicine
  - **Low Risk**: Preventive Care Specialists

- **Display Information**:
  - Doctor Name
  - Specialization
  - Hospital/Clinic Name
  - Location (with map)
  - Contact Number
  - Availability
  - Rating (if available)

- **Features**:
  - Filter by location (radius: 5km, 10km, 25km)
  - Sort by distance, rating
  - "Book Appointment" button (external link or integrated booking)
  - Save favorite doctors

---

#### 5.1.6 Interactive Chatbot

**FR-U-010: Healthcare Chatbot**
- **Priority**: P2 (Medium)
- **Description**: AI chatbot for health queries and system help
- **Capabilities**:
  1. **Health Q&A**:
     - Answer common health questions
     - Explain stroke risk factors
     - Provide general health tips
  
  2. **System Help**:
     - Guide users through features
     - Troubleshoot issues
     - FAQ responses
  
  3. **Symptom Guidance** (Non-diagnostic):
     - Suggest when to seek medical attention
     - Provide emergency contact info

- **Limitations**:
  - Clear disclaimer: "Not a substitute for professional medical advice"
  - Cannot diagnose conditions
  - Refers urgent queries to emergency services

- **Technical Implementation**:
  - Option 1: Rule-based chatbot (predefined responses)
  - Option 2: OpenAI API integration
  - Option 3: Custom-trained model on medical FAQs

---

#### 5.1.7 User Feedback

**FR-U-011: Submit Feedback**
- **Priority**: P2 (Medium)
- **Description**: Users can provide feedback on system experience
- **Feedback Types**:
  - Bug report
  - Feature request
  - General feedback
  - Rating (1-5 stars)

- **Form Fields**:
  - Category (Dropdown)
  - Subject (Text, max 100 chars)
  - Description (Textarea, max 500 chars)
  - Rating (Star selector)
  - Screenshots (Optional, max 3 files)

- **Process**:
  - Feedback stored in MongoDB
  - Admin can review in dashboard
  - User receives confirmation email
  - Status updates (Submitted → Under Review → Resolved)

---

### 5.2 Admin Module

#### 5.2.1 Admin Authentication

**FR-A-001: Admin Login**
- **Priority**: P0 (Critical)
- **Description**: Secure admin portal access
- **Acceptance Criteria**:
  - Separate login endpoint from users
  - Admin credentials: admin@welltrack.com / SecurePassword123!
  - Two-factor authentication (2FA) required
  - Session timeout after 30 minutes of inactivity
  - Admin role verification via JWT claims

---

#### 5.2.2 User Management

**FR-A-002: View User Registrations**
- **Priority**: P0 (Critical)
- **Description**: Admin views all pending and verified users
- **Display**:
  - Table with columns: Name, Email, Date Registered, Status, Actions
  - Filter by: Status (Pending/Verified/Rejected), Date range
  - Search by: Name, Email
  - Pagination (20 users per page)

**FR-A-003: Verify Users**
- **Priority**: P0 (Critical)
- **Description**: Admin manually verifies user accounts
- **Process**:
  1. Admin clicks "View Details" on pending user
  2. Reviews: Name, Email, DOB, Phone Number
  3. Clicks "Verify" or "Reject"
  4. If rejected, enters reason
  5. User receives email notification
  6. Status updated in database

- **Acceptance Criteria**:
  - Bulk verification option (select multiple users)
  - Verification history log
  - Cannot undo verification (only admin-level override)

---

#### 5.2.3 Doctor Management

**FR-A-004: Manage Doctor Recommendations**
- **Priority**: P1 (High)
- **Description**: Admin maintains database of recommended doctors
- **CRUD Operations**:
  
  **Create Doctor Entry**:
  - Fields: Name, Specialization, Hospital, Address, Phone, Email, Availability
  - Validation: Required fields enforced
  
  **Read/View Doctors**:
  - List all doctors
  - Search by name, specialization, hospital
  - Filter by location
  
  **Update Doctor Info**:
  - Edit any field
  - Update availability status
  - Change specialization
  
  **Delete Doctor**:
  - Soft delete (archived, not removed)
  - Reason required for deletion
  - Confirmation dialog

- **Additional Features**:
  - Bulk import via CSV
  - Export doctor list to Excel
  - Doctor profile photos (optional)

---

#### 5.2.4 Feedback Management

**FR-A-005: Review User Feedback**
- **Priority**: P2 (Medium)
- **Description**: Admin reviews and responds to user feedback
- **Dashboard**:
  - New feedback count (badge notification)
  - List of all feedback with status indicators
  - Filter by: Type, Status, Rating, Date
  
- **Actions**:
  - Mark as "Under Review"
  - Mark as "Resolved"
  - Add admin response/notes
  - Forward to development team
  
- **Analytics**:
  - Average rating over time
  - Most common feedback categories
  - Resolution time metrics

---

#### 5.2.5 System Analytics

**FR-A-006: View System Statistics**
- **Priority**: P2 (Medium)
- **Description**: Admin dashboard with key metrics
- **Metrics Displayed**:
  1. **User Statistics**:
     - Total registered users
     - Active users (last 30 days)
     - Pending verifications
  
  2. **Prediction Statistics**:
     - Total predictions made
     - Risk level distribution (Low/Medium/High)
     - Average prediction response time
  
  3. **System Health**:
     - ML model accuracy (from test set)
     - API response times
     - Error rates
  
  4. **Engagement Metrics**:
     - Daily active users
     - Feature usage (predictions, diet plans, chatbot)
     - Feedback submission rate

- **Visualizations**:
  - Line charts (users over time)
  - Pie charts (risk distribution)
  - Bar charts (feature usage)
  - Heat maps (usage by time of day)

---

## 6. NON-FUNCTIONAL REQUIREMENTS

### 6.1 Performance Requirements

**NFR-P-001: Response Time**
- ML prediction: <3 seconds (95th percentile)
- Page load time: <2 seconds
- API response: <500ms (excluding ML prediction)
- Database queries: <100ms average

**NFR-P-002: Throughput**
- Support 100 concurrent users
- Handle 1,000 predictions per day
- Scale to 10,000 predictions per day (future)

**NFR-P-003: Resource Usage**
- Frontend bundle size: <2MB
- ML model size: <50MB
- Database storage: 1GB initial, 10GB capacity
- Memory: Node.js <512MB, Flask <256MB per instance

---

### 6.2 Security Requirements

**NFR-S-001: Authentication & Authorization**
- JWT-based authentication with 24-hour expiry
- Role-based access control (User vs Admin)
- Password hashing: bcrypt with salt rounds 10
- Secure session management
- Logout functionality (token invalidation)

**NFR-S-002: Data Protection**
- HTTPS/TLS encryption for all communications
- Encrypted database connections
- Sensitive data (passwords) never stored in plain text
- Personal health information (PHI) encrypted at rest
- GDPR/HIPAA compliance considerations (future)

**NFR-S-003: Input Validation**
- Server-side validation for all inputs
- SQL injection prevention (using MongoDB avoids this)
- XSS protection (sanitize user inputs)
- CSRF protection (tokens for state-changing operations)
- Rate limiting (100 requests per minute per user)

**NFR-S-004: Audit Logging**
- Log all authentication attempts (success/failure)
- Log all predictions made (user ID, timestamp, result)
- Log admin actions (user verification, doctor changes)
- Log retention: 90 days minimum

---

### 6.3 Scalability Requirements

**NFR-SC-001: Horizontal Scaling**
- Node.js backend: Stateless design for load balancing
- Flask ML service: Containerized for easy replication
- MongoDB: Support replica sets for read scaling

**NFR-SC-002: Future Growth**
- Architecture supports 10x user growth without redesign
- ML model updatable without downtime (blue-green deployment)
- Database sharding capable (user-based partitioning)

---

### 6.4 Reliability Requirements

**NFR-R-001: Availability**
- System uptime: 99% (acceptable downtime: 7.2 hours/month)
- Maintenance windows: Weekends, 2am-5am
- Graceful degradation (if ML service down, show cached predictions)

**NFR-R-002: Data Integrity**
- Database backups: Daily full, hourly incremental
- Backup retention: 30 days
- Disaster recovery plan: 24-hour RTO (Recovery Time Objective)

**NFR-R-003: Error Handling**
- Meaningful error messages to users (no stack traces)
- Fallback mechanisms for ML service failures
- Email alerts to admins on critical errors
- Automatic retry for transient failures (3 attempts)

---

### 6.5 Usability Requirements

**NFR-U-001: User Interface**
- Mobile-responsive design (Bootstrap/Tailwind CSS)
- Accessibility: WCAG 2.1 Level AA compliance
- Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Loading indicators for all async operations

**NFR-U-002: User Experience**
- Maximum 3 clicks to reach any feature
- Help tooltips on all complex fields
- Progress indicators for multi-step processes
- Error messages with suggested solutions

**NFR-U-003: Internationalization**
- English language (initial release)
- Support for multiple languages (future: Spanish, Mandarin)
- Date/time formats based on locale
- Currency/units based on region

---

### 6.6 Maintainability Requirements

**NFR-M-001: Code Quality**
- Code documentation: JSDoc for JavaScript, Docstrings for Python
- Coding standards: ESLint for JS, PEP 8 for Python
- Test coverage: >80% for critical paths
- Version control: Git with feature branch workflow

**NFR-M-002: Deployment**
- Containerization: Docker for all services
- CI/CD pipeline: Automated testing and deployment
- Environment configuration: .env files (dev, staging, prod)
- Rollback capability: 15-minute rollback window

**NFR-M-003: Monitoring**
- Application monitoring: PM2 for Node.js
- Error tracking: Sentry or similar
- Performance monitoring: New Relic or similar
- Log aggregation: ELK stack (Elasticsearch, Logstash, Kibana)

---

## 7. USER INTERFACE SPECIFICATIONS

### 7.1 User Module UI

#### 7.1.1 Landing Page

**Components**:
- Hero section with value proposition
- Features overview (3-column grid)
- How it works (step-by-step)
- Call-to-action: "Get Started" → Registration

**Design**:
- Modern, clean design
- Health-themed colors (blues, greens)
- Medical imagery (non-generic)
- Mobile-first responsive

---

#### 7.1.2 Registration Page

**Layout**:
```
┌─────────────────────────────────────┐
│         WellTrack Logo              │
├─────────────────────────────────────┤
│   Create Your Account               │
│                                     │
│   [Full Name Input]                 │
│   [Email Input]                     │
│   [Password Input]                  │
│   [Confirm Password Input]          │
│   [Date of Birth Picker]            │
│   [Phone Number Input]              │
│                                     │
│   □ I agree to Terms & Conditions   │
│                                     │
│   [  Register Button  ]             │
│                                     │
│   Already have an account? Login   │
└─────────────────────────────────────┘
```

**Validation**:
- Real-time validation on blur
- Green checkmarks for valid fields
- Red error messages below invalid fields

---

#### 7.1.3 Dashboard (After Login)

**Layout**:
```
┌────────────────────────────────────────────────────────────┐
│  WellTrack    [Home] [Profile] [History] [Help] [Logout]  │
├────────────────────────────────────────────────────────────┤
│  Welcome back, Sarah!                                      │
│                                                            │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────┐ │
│  │ Last Prediction│  │  Get New       │  │ View Diet   │ │
│  │                │  │  Prediction    │  │ Plan        │ │
│  │ Risk: Low      │  │                │  │             │ │
│  │ Date: Feb 10   │  │  [Start →]     │  │ [View →]    │ │
│  └────────────────┘  └────────────────┘  └─────────────┘ │
│                                                            │
│  Recent Activity:                                          │
│  - Prediction on Feb 10 (Low Risk)                        │
│  - Diet plan viewed on Feb 11                             │
│  - Chatbot conversation on Feb 12                         │
└────────────────────────────────────────────────────────────┘
```

---

#### 7.1.4 Health Details Form

**Layout**: Multi-step form with progress bar

**Step 1: Basic Information**
```
Progress: ████████░░░░░░░░ 50%

Basic Health Information

Age: [Input: 67]
Gender: ○ Male  ○ Female  ○ Other
Height: [Input: cm]  Weight: [Input: kg]
BMI: 36.6 (Auto-calculated) ⓘ

[← Back]  [Continue →]
```

**Step 2: Medical History**
```
Progress: ████████████████ 100%

Medical History

☑ Hypertension
☑ Heart Disease
Ever Married: ○ Yes  ○ No
Work Type: [Dropdown: Private ▼]
Residence: ○ Urban  ○ Rural
Glucose Level: [Input: 228.69 mg/dL]
Smoking Status: [Dropdown: Formerly Smoked ▼]

[← Back]  [Get Prediction →]
```

---

#### 7.1.5 Prediction Results Page

**Layout**:
```
┌──────────────────────────────────────────────────────────┐
│           Your Stroke Risk Assessment                    │
├──────────────────────────────────────────────────────────┤
│                                                          │
│              ┌─────────────────────┐                     │
│              │   🔴 HIGH RISK      │                     │
│              │                     │                     │
│              │   Probability: 87%  │                     │
│              │                     │                     │
│              │   [87%]             │  ← Gauge/Meter     │
│              └─────────────────────┘                     │
│                                                          │
│  What This Means:                                        │
│  Your current health profile indicates an elevated       │
│  risk of stroke. We strongly recommend consulting        │
│  with a healthcare professional.                         │
│                                                          │
│  Top Risk Factors:                                       │
│  1. Age (67 years) - 24.5% contribution                  │
│  2. High Glucose (228.69 mg/dL) - 17.8%                 │
│  3. BMI (36.6) - 15.6%                                   │
│  4. Heart Disease - 6.7%                                 │
│                                                          │
│  [View Diet Plan] [View Workout Plan] [Find Doctors]    │
│                                                          │
│  [Download PDF] [Share with Doctor] [Get Second Test]   │
└──────────────────────────────────────────────────────────┘
```

**Color Coding**:
- Low Risk: Green (#28a745)
- Medium Risk: Yellow (#ffc107)
- High Risk: Red (#dc3545)

---

#### 7.1.6 Diet Plan Page

**Layout**:
```
┌──────────────────────────────────────────────────────────┐
│         Personalized Diet Plan                           │
│         Based on Your High Stroke Risk                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  🥗 General Guidelines                                   │
│  • Reduce sodium intake to <2000mg per day              │
│  • Increase omega-3 fatty acids                         │
│  • Focus on whole grains and fiber                      │
│  • Limit saturated fats to <7% of daily calories        │
│                                                          │
│  ✅ Foods to Eat                                         │
│  [Leafy Greens] [Fatty Fish] [Berries] [Whole Grains]  │
│  [Nuts] [Olive Oil] [Legumes] [Low-Fat Dairy]          │
│                                                          │
│  ❌ Foods to Avoid                                       │
│  [Processed Meats] [Fried Foods] [Sugary Drinks]       │
│  [Excessive Red Meat] [High-Sodium Foods]              │
│                                                          │
│  📅 Sample Meal Plan                                     │
│  Breakfast: Oatmeal with berries and walnuts            │
│  Snack: Greek yogurt with almonds                       │
│  Lunch: Grilled salmon with quinoa and steamed broccoli│
│  Snack: Apple slices with almond butter                 │
│  Dinner: Lentil soup with mixed green salad            │
│                                                          │
│  [Print Plan] [Email to Me] [Save to Profile]          │
└──────────────────────────────────────────────────────────┘
```

---

#### 7.1.7 Doctor Recommendations Page

**Layout**:
```
┌──────────────────────────────────────────────────────────┐
│         Recommended Healthcare Providers                 │
├──────────────────────────────────────────────────────────┤
│  Filters:                                                │
│  [Distance: 10km ▼] [Specialization: All ▼] [Sort: Rating ▼] │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Dr. Emily Rodriguez - Cardiologist        ⭐ 4.8/5 │ │
│  │ City Heart Hospital, Downtown                      │ │
│  │ 📍 2.5 km away  📞 (555) 123-4567                  │ │
│  │ ✓ Available Today  ✓ Accepts Insurance            │ │
│  │ [View Profile] [Book Appointment]                  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Dr. James Wilson - Neurologist           ⭐ 4.9/5 │ │
│  │ Medical Center East                                │ │
│  │ 📍 3.8 km away  📞 (555) 987-6543                  │ │
│  │ ✓ Next available: Tomorrow  ✓ Accepts Insurance   │ │
│  │ [View Profile] [Book Appointment]                  │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  [Load More...]                                          │
└──────────────────────────────────────────────────────────┘
```

---

#### 7.1.8 Chatbot Interface

**Layout**: Floating chat widget (bottom-right corner)
```
┌─────────────────────────────────┐
│ 💬 WellTrack Assistant      [−] │
├─────────────────────────────────┤
│                                 │
│  Bot: Hello! How can I help     │
│       you today?                │
│                                 │
│  You: What is stroke?           │
│                                 │
│  Bot: A stroke occurs when      │
│       blood supply to part of   │
│       the brain is interrupted. │
│       Would you like to know    │
│       more about risk factors?  │
│                                 │
│  [Type your message...]  [Send] │
└─────────────────────────────────┘
```

**Features**:
- Minimizable
- Persistent across pages
- Quick action buttons (FAQ shortcuts)
- Emergency contact button (red, prominent)

---

### 7.2 Admin Module UI

#### 7.2.1 Admin Dashboard

**Layout**:
```
┌──────────────────────────────────────────────────────────┐
│  WellTrack Admin  [Dashboard] [Users] [Doctors] [Feedback] [Logout] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Overview                                                │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │ Total    │  │ Pending  │  │ Total    │  │ High    │ │
│  │ Users    │  │ Verif.   │  │ Predict. │  │ Risk    │ │
│  │          │  │          │  │          │  │ Users   │ │
│  │  1,247   │  │    23    │  │  8,532   │  │   142   │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                          │
│  Recent Activity:                                        │
│  [Chart: Predictions over time (last 30 days)]          │
│                                                          │
│  System Health:                                          │
│  • ML Model Accuracy: 89.73%  ✓                         │
│  • Avg Response Time: 2.1s    ✓                         │
│  • Database Status: Healthy   ✓                         │
└──────────────────────────────────────────────────────────┘
```

---

#### 7.2.2 User Management Page

**Layout**:
```
┌──────────────────────────────────────────────────────────┐
│  User Management                                         │
├──────────────────────────────────────────────────────────┤
│  Filters: [Status: All ▼] [Date: Last 30 Days ▼]        │
│  Search: [Search by name or email...]                    │
│                                                          │
│  ┌─────┬──────────┬─────────────┬────────┬──────────┐  │
│  │ ☐   │ Name     │ Email       │ Status │ Actions  │  │
│  ├─────┼──────────┼─────────────┼────────┼──────────┤  │
│  │ ☐   │ John Doe │ john@...com │ Pending│ [Verify] │  │
│  │     │          │             │        │ [Reject] │  │
│  ├─────┼──────────┼─────────────┼────────┼──────────┤  │
│  │ ☐   │ Jane S.  │ jane@...com │Verified│ [View]   │  │
│  ├─────┼──────────┼─────────────┼────────┼──────────┤  │
│  │ ☐   │ Bob M.   │ bob@...com  │ Pending│ [Verify] │  │
│  │     │          │             │        │ [Reject] │  │
│  └─────┴──────────┴─────────────┴────────┴──────────┘  │
│                                                          │
│  ☑ Select All  [Bulk Verify]  [Export to CSV]          │
│                                                          │
│  Showing 1-20 of 247    [< Previous]  [Next >]         │
└──────────────────────────────────────────────────────────┘
```

---

#### 7.2.3 Doctor Management Page

**Layout**:
```
┌──────────────────────────────────────────────────────────┐
│  Doctor Management                    [+ Add New Doctor] │
├──────────────────────────────────────────────────────────┤
│  Search: [Search by name, hospital, specialization...]   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Dr. Emily Rodriguez - Cardiologist               │   │
│  │ City Heart Hospital                              │   │
│  │ 📍 123 Main St, Downtown                         │   │
│  │ 📞 (555) 123-4567  ✉ emily.r@cityheart.com      │   │
│  │ Status: Active                                   │   │
│  │ [Edit] [Deactivate] [Delete]                     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Dr. James Wilson - Neurologist                   │   │
│  │ Medical Center East                              │   │
│  │ 📍 456 Oak Ave, Eastside                         │   │
│  │ 📞 (555) 987-6543  ✉ j.wilson@medcenter.com     │   │
│  │ Status: Active                                   │   │
│  │ [Edit] [Deactivate] [Delete]                     │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  [Load More...]                                          │
└──────────────────────────────────────────────────────────┘
```

**Add Doctor Modal**:
```
┌────────────────────────────────────┐
│  Add New Doctor              [×]   │
├────────────────────────────────────┤
│  Doctor Name: [Input]              │
│  Specialization: [Dropdown]        │
│  Hospital/Clinic: [Input]          │
│  Address: [Textarea]               │
│  Phone: [Input]                    │
│  Email: [Input]                    │
│  Availability: [Checkbox Grid]     │
│    Mon Tue Wed Thu Fri Sat Sun    │
│    ☑   ☑   ☑   ☑   ☑   ☐   ☐     │
│                                    │
│  [Cancel]  [Save Doctor]           │
└────────────────────────────────────┘
```

---

## 8. DATABASE SCHEMA

### 8.1 MongoDB Collections

#### Collection: `users`

```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed),
  fullName: String,
  dateOfBirth: Date,
  phoneNumber: String,
  role: String (enum: ['user', 'admin']),
  isVerified: Boolean (default: false),
  verifiedBy: ObjectId (ref: 'users'),
  verifiedAt: Date,
  rejectionReason: String,
  createdAt: Date (default: now),
  updatedAt: Date,
  lastLogin: Date
}
```

#### Collection: `predictions`

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users', indexed),
  healthData: {
    age: Number,
    gender: String,
    bmi: Number,
    hypertension: Number (0 or 1),
    heartDisease: Number (0 or 1),
    everMarried: String,
    workType: String,
    residenceType: String,
    avgGlucoseLevel: Number,
    smokingStatus: String
  },
  prediction: {
    result: Number (0 or 1),
    probability: Number (0.0 - 1.0),
    riskLevel: String (enum: ['Low', 'Medium', 'High']),
    confidence: Number,
    topFeatures: Array [{
      feature: String,
      contribution: Number
    }]
  },
  createdAt: Date (default: now, indexed)
}
```

#### Collection: `doctors`

```javascript
{
  _id: ObjectId,
  name: String,
  specialization: String (indexed),
  hospital: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contactInfo: {
    phone: String,
    email: String
  },
  availability: {
    monday: Boolean,
    tuesday: Boolean,
    wednesday: Boolean,
    thursday: Boolean,
    friday: Boolean,
    saturday: Boolean,
    sunday: Boolean
  },
  rating: Number (1.0 - 5.0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

#### Collection: `feedbacks`

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users'),
  category: String (enum: ['Bug', 'Feature Request', 'General']),
  subject: String,
  description: String,
  rating: Number (1-5),
  screenshots: Array [String], // URLs
  status: String (enum: ['Submitted', 'Under Review', 'Resolved']),
  adminResponse: String,
  createdAt: Date (default: now),
  updatedAt: Date
}
```

#### Collection: `dietPlans`

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users'),
  predictionId: ObjectId (ref: 'predictions'),
  riskLevel: String,
  guidelines: Array [String],
  foodsToEat: Array [String],
  foodsToAvoid: Array [String],
  sampleMealPlan: {
    breakfast: String,
    lunch: String,
    dinner: String,
    snacks: Array [String]
  },
  createdAt: Date (default: now)
}
```

#### Collection: `workoutPlans`

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'users'),
  predictionId: ObjectId (ref: 'predictions'),
  riskLevel: String,
  weeklyGoals: String,
  cardioExercises: Array [{
    type: String,
    duration: String,
    frequency: String
  }],
  strengthTraining: Array [{
    exercise: String,
    frequency: String
  }],
  safetyNotes: Array [String],
  createdAt: Date (default: now)
}
```

---

### 8.2 Indexes

**For Performance Optimization:**

```javascript
// users collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ isVerified: 1 })

// predictions collection
db.predictions.createIndex({ userId: 1, createdAt: -1 })
db.predictions.createIndex({ createdAt: -1 })

// doctors collection
db.doctors.createIndex({ specialization: 1 })
db.doctors.createIndex({ "address.city": 1 })
db.doctors.createIndex({ isActive: 1 })

// feedbacks collection
db.feedbacks.createIndex({ userId: 1 })
db.feedbacks.createIndex({ status: 1 })
```

---

## 9. API ENDPOINTS SPECIFICATION

### 9.1 Authentication APIs

#### POST `/api/auth/register`

**Description**: User registration  
**Request Body**:
```json
{
  "email": "sarah.chen@email.com",
  "password": "SecurePass123!",
  "fullName": "Sarah Chen",
  "dateOfBirth": "1981-03-15",
  "phoneNumber": "+1-555-123-4567"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for verification.",
  "userId": "507f1f77bcf86cd799439011"
}
```

---

#### POST `/api/auth/login`

**Description**: User login  
**Request Body**:
```json
{
  "email": "sarah.chen@email.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "sarah.chen@email.com",
    "fullName": "Sarah Chen",
    "role": "user",
    "isVerified": true
  }
}
```

---

### 9.2 Prediction APIs

#### POST `/api/prediction/predict`

**Description**: Generate stroke risk prediction  
**Headers**: `Authorization: Bearer <token>`  
**Request Body**:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "age": 67,
  "gender": "Male",
  "bmi": 36.6,
  "hypertension": 0,
  "heart_disease": 1,
  "ever_married": "Yes",
  "work_type": "Private",
  "residence_type": "Urban",
  "avg_glucose_level": 228.69,
  "smoking_status": "formerly smoked"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "predictionId": "507f1f77bcf86cd799439012",
  "result": {
    "prediction": 1,
    "probability": 0.87,
    "riskLevel": "High",
    "confidence": 0.87,
    "message": "High stroke risk detected. Please consult a doctor.",
    "topFeatures": [
      { "feature": "age", "contribution": 0.245 },
      { "feature": "avg_glucose_level", "contribution": 0.178 },
      { "feature": "bmi", "contribution": 0.156 }
    ]
  },
  "timestamp": "2026-02-16T10:30:00Z"
}
```

---

#### GET `/api/prediction/history/:userId`

**Description**: Get user's prediction history  
**Headers**: `Authorization: Bearer <token>`  
**Response** (200 OK):
```json
{
  "success": true,
  "predictions": [
    {
      "id": "507f1f77bcf86cd799439012",
      "date": "2026-02-16T10:30:00Z",
      "riskLevel": "High",
      "probability": 0.87
    },
    {
      "id": "507f1f77bcf86cd799439013",
      "date": "2026-01-15T14:20:00Z",
      "riskLevel": "Medium",
      "probability": 0.52
    }
  ],
  "count": 2
}
```

---

### 9.3 Health Plan APIs

#### POST `/api/health-plan/diet`

**Description**: Generate personalized diet plan  
**Headers**: `Authorization: Bearer <token>`  
**Request Body**:
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "predictionId": "507f1f77bcf86cd799439012",
  "riskLevel": "High",
  "bmi": 36.6,
  "avgGlucoseLevel": 228.69
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "dietPlan": {
    "guidelines": [
      "Reduce sodium intake to <2000mg per day",
      "Increase omega-3 fatty acids",
      "Focus on whole grains and fiber"
    ],
    "foodsToEat": [
      "Leafy greens (spinach, kale)",
      "Fatty fish (salmon, mackerel)",
      "Berries",
      "Whole grains"
    ],
    "foodsToAvoid": [
      "Processed meats",
      "Fried foods",
      "Sugary beverages"
    ],
    "sampleMealPlan": {
      "breakfast": "Oatmeal with berries and walnuts",
      "lunch": "Grilled salmon with quinoa and broccoli",
      "dinner": "Lentil soup with mixed green salad",
      "snacks": ["Greek yogurt", "Apple with almond butter"]
    }
  }
}
```

---

### 9.4 Doctor APIs

#### GET `/api/doctors/recommended`

**Description**: Get recommended doctors based on risk level  
**Headers**: `Authorization: Bearer <token>`  
**Query Parameters**: `riskLevel`, `latitude`, `longitude`, `radius` (km)  
**Example**: `/api/doctors/recommended?riskLevel=High&latitude=40.7128&longitude=-74.0060&radius=10`  

**Response** (200 OK):
```json
{
  "success": true,
  "doctors": [
    {
      "id": "507f1f77bcf86cd799439020",
      "name": "Dr. Emily Rodriguez",
      "specialization": "Cardiologist",
      "hospital": "City Heart Hospital",
      "address": "123 Main St, Downtown",
      "phone": "(555) 123-4567",
      "distance": 2.5,
      "rating": 4.8,
      "availability": true
    }
  ],
  "count": 5
}
```

---

### 9.5 Admin APIs

#### GET `/api/admin/users`

**Description**: Get all users (with pagination and filters)  
**Headers**: `Authorization: Bearer <admin_token>`  
**Query Parameters**: `status`, `page`, `limit`  

**Response** (200 OK):
```json
{
  "success": true,
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "Sarah Chen",
      "email": "sarah.chen@email.com",
      "isVerified": false,
      "createdAt": "2026-02-10T08:00:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 100
  }
}
```

---

#### PUT `/api/admin/users/:userId/verify`

**Description**: Verify user account  
**Headers**: `Authorization: Bearer <admin_token>`  
**Request Body**:
```json
{
  "action": "verify"  // or "reject"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User verified successfully",
  "userId": "507f1f77bcf86cd799439011"
}
```

---

## 10. ML MODEL SPECIFICATIONS

### 10.1 Model Details

**Algorithm**: XGBoost (Extreme Gradient Boosting)  
**Version**: XGBoost 2.0.0  
**Framework**: scikit-learn 1.3.0, Python 3.9+  

**Model Type**: Binary Classification  
**Target Variable**: Stroke (0 = No, 1 = Yes)  

---

### 10.2 Input Features (15 Total)

**Original Features (10)**:
1. age (continuous: 18-100)
2. gender (categorical: Male/Female/Other → encoded 0/1/2)
3. bmi (continuous: 10-60)
4. hypertension (binary: 0/1)
5. heart_disease (binary: 0/1)
6. ever_married (categorical: Yes/No → encoded 0/1)
7. work_type (categorical: 5 categories → encoded 0-4)
8. Residence_type (categorical: Urban/Rural → encoded 0/1)
9. avg_glucose_level (continuous: 50-300 mg/dL)
10. smoking_status (categorical: 4 categories → encoded 0-3)

**Engineered Features (5)**:
11. age_group (categorical: young/middle/senior → encoded 0/1/2)
12. bmi_category (categorical: underweight/normal/overweight/obese → encoded 0/1/2/3)
13. glucose_risk (categorical: normal/prediabetic/diabetic → encoded 0/1/2)
14. composite_risk (continuous: 0.0-1.0)
15. age_bmi_interaction (continuous: age × bmi / 100)

---

### 10.3 Model Hyperparameters

**Final Tuned Parameters**:
```python
XGBClassifier(
    n_estimators=200,           # Number of boosting rounds
    max_depth=6,                # Maximum tree depth
    learning_rate=0.1,          # Step size shrinkage
    min_child_weight=3,         # Minimum sum of instance weight
    gamma=0.1,                  # Regularization parameter
    subsample=0.8,              # Row sampling ratio
    colsample_bytree=0.8,       # Column sampling ratio
    scale_pos_weight=19.5,      # Handle class imbalance (ratio of neg/pos)
    random_state=42,
    eval_metric='auc',
    objective='binary:logistic'
)
```

---

### 10.4 Performance Metrics

**Test Set Performance (20% holdout)**:

| Metric | Value | Clinical Threshold | Status |
|--------|-------|-------------------|--------|
| Accuracy | 89.73% | >85% | ✅ PASS |
| ROC-AUC | 0.8243 | >0.80 | ✅ PASS |
| Sensitivity (Recall) | 42.00% | >75% | ⚠️ Can Improve |
| Specificity | 92.18% | >90% | ✅ PASS |
| Precision (PPV) | 21.65% | N/A | - |
| NPV | 96.86% | N/A | - |
| F1-Score | 0.29 | N/A | - |

**Cross-Validation (5-Fold)**:
- Mean AUC: 0.8235
- Std Dev: 0.013
- Min: 0.8009
- Max: 0.8384

**Confusion Matrix (Test Set, n=1022)**:
```
                  Predicted
                No      Yes
Actual  No     896      76
        Yes     29      21
```

---

### 10.5 Feature Importance

| Rank | Feature | Importance | Interpretation |
|------|---------|-----------|----------------|
| 1 | age | 0.245 | Most critical - risk increases with age |
| 2 | avg_glucose_level | 0.178 | Diabetes indicator |
| 3 | bmi | 0.156 | Obesity correlation |
| 4 | age_bmi_interaction | 0.092 | Combined age-weight risk |
| 5 | hypertension | 0.089 | Cardiovascular factor |
| 6 | heart_disease | 0.067 | Direct risk factor |
| 7 | composite_risk | 0.054 | Aggregate health score |
| 8 | glucose_risk | 0.042 | Categorized glucose level |
| 9 | smoking_status | 0.031 | Lifestyle factor |
| 10 | bmi_category | 0.028 | Weight classification |

---

### 10.6 Model Training Process

**1. Data Preprocessing**:
- Missing value imputation (BMI: median)
- Feature engineering (5 new features)
- Label encoding (categorical → numerical)
- Feature scaling (StandardScaler for numerical features)

**2. Train-Test Split**:
- Split ratio: 80% train, 20% test
- Stratified split (maintains class distribution)
- Random state: 42 (reproducibility)

**3. Class Imbalance Handling**:
- Original: 95.1% no stroke, 4.9% stroke
- Method: `scale_pos_weight` parameter in XGBoost
- Alternative: SMOTE (can improve sensitivity to 75-85%)

**4. Hyperparameter Tuning**:
- Method: GridSearchCV with 5-fold cross-validation
- Scoring: ROC-AUC
- Search space: 3x3x3x3x3x3 = 729 combinations
- Best parameters selected based on CV AUC

**5. Model Validation**:
- K-Fold Cross-Validation (k=5)
- Hold-out test set evaluation
- Clinical metrics calculation

---

### 10.7 Model Deployment

**Saved Artifacts**:
1. **welltrack_xgb_model.pkl** (48.3 MB)
   - Trained XGBoost model
   - Serialized with joblib
   
2. **preprocessor.pkl** (127 KB)
   - Complete preprocessing pipeline
   - Includes: LabelEncoders, StandardScaler, feature engineering logic

**Deployment Architecture**:
```
Flask API (Port 5001)
  ↓
Load model & preprocessor at startup
  ↓
Receive JSON health data
  ↓
Preprocess input (apply same transformations as training)
  ↓
Generate prediction
  ↓
Return JSON response
```

**API Response Format**:
```json
{
  "prediction": 1,
  "probability": 0.87,
  "risk_level": "High",
  "confidence": 0.87,
  "top_features": [...]
}
```

---

### 10.8 Model Retraining Strategy

**When to Retrain**:
- Every 6 months (scheduled)
- When accuracy drops below 85% (monitored)
- After collecting 5,000+ new predictions (data drift detection)
- When new medical guidelines are released

**Retraining Process**:
1. Collect new labeled data (with actual stroke outcomes)
2. Merge with original training data
3. Re-run preprocessing pipeline
4. Re-tune hyperparameters (GridSearchCV)
5. Validate on new test set
6. If performance improved, deploy new model
7. Blue-green deployment (zero downtime)

---

### 10.9 Model Monitoring

**Metrics to Track**:
- Prediction distribution (% Low/Medium/High)
- Average prediction confidence
- Response time (should be <3 seconds)
- Error rates (failed predictions)
- Feature drift (input distributions changing)

**Alerting Thresholds**:
- Accuracy drops below 85% → Alert admin
- Response time exceeds 5 seconds → Scale ML service
- Error rate exceeds 1% → Investigate logs

---

## 11. TESTING STRATEGY

### 11.1 Unit Testing

**Frontend (React)**:
- **Framework**: Jest + React Testing Library
- **Coverage Target**: >80%
- **Test Cases**:
  - Component rendering
  - Form validation logic
  - Button click handlers
  - API call mocking

**Backend (Node.js)**:
- **Framework**: Mocha + Chai
- **Coverage Target**: >80%
- **Test Cases**:
  - API endpoint responses
  - Authentication middleware
  - Database queries
  - Error handling

**ML Service (Flask)**:
- **Framework**: pytest
- **Coverage Target**: >90% (critical path)
- **Test Cases**:
  - Preprocessing logic
  - Model prediction accuracy
  - Input validation
  - Edge cases (missing values, out-of-range)

---

### 11.2 Integration Testing

**Test Scenarios**:
1. **User Registration Flow**:
   - Frontend form → Node.js API → MongoDB
   - Verify user created in database
   - Check email sent

2. **Prediction Flow**:
   - React form → Node.js → Flask ML service → MongoDB
   - Verify prediction stored
   - Check response format

3. **Admin Verification**:
   - Admin verifies user → Database updated → Email notification

**Tools**:
- Postman for API testing
- Cypress for E2E testing

---

### 11.3 System Testing

**Test Cases**:

| Test ID | Test Case | Expected Result |
|---------|-----------|-----------------|
| ST-001 | User registers with valid data | Account created, verification email sent |
| ST-002 | User logs in with correct credentials | JWT token returned, redirected to dashboard |
| ST-003 | Unverified user tries to get prediction | Error: "Account not verified" |
| ST-004 | User submits health data | Prediction returned in <3 seconds |
| ST-005 | High-risk user views doctors | List of cardiologists and neurologists shown |
| ST-006 | Admin verifies pending user | User status updated, email sent |
| ST-007 | Admin adds new doctor | Doctor appears in recommendations |
| ST-008 | User submits feedback | Feedback stored, confirmation shown |

---

### 11.4 Performance Testing

**Load Testing**:
- **Tool**: Apache JMeter
- **Scenarios**:
  - 100 concurrent users making predictions
  - 1,000 predictions per hour
  - Peak load: 500 concurrent users

**Metrics to Measure**:
- Response time (95th percentile)
- Throughput (requests/second)
- Error rate
- Resource utilization (CPU, memory)

**Acceptance Criteria**:
- 95th percentile response time <3 seconds
- Error rate <1%
- System handles 100 concurrent users without degradation

---

### 11.5 Security Testing

**Test Cases**:
1. **SQL Injection**: (Not applicable for MongoDB, but test NoSQL injection)
2. **XSS**: Test input sanitization on forms
3. **CSRF**: Verify token protection on state-changing operations
4. **Authentication**: Test JWT expiration, invalid tokens
5. **Authorization**: Verify users can't access admin endpoints
6. **Rate Limiting**: Test 100 requests/minute limit

---

### 11.6 Usability Testing

**Test with Real Users**:
- 5 users from each persona (Sarah, Robert, Dr. Rodriguez)
- Tasks:
  1. Register and log in
  2. Enter health details and get prediction
  3. View diet/workout plan
  4. Find recommended doctor
  5. Use chatbot

**Metrics**:
- Task completion rate
- Time to complete tasks
- Number of errors
- User satisfaction (SUS score)

---

## 12. DEPLOYMENT PLAN

### 12.1 Environment Setup

**Development Environment**:
- Local machines
- MongoDB local instance
- Node.js dev server (Port 5000)
- React dev server (Port 3000)
- Flask dev server (Port 5001)

**Staging Environment**:
- Cloud server (AWS EC2 / DigitalOcean)
- MongoDB Atlas (cloud database)
- Docker containers
- HTTPS enabled

**Production Environment**:
- AWS / Azure / Google Cloud
- MongoDB Atlas (replica set)
- Load balancer
- Auto-scaling enabled
- CDN for frontend assets
- Monitoring and logging

---

### 12.2 Deployment Steps

**Phase 1: Initial Deployment (Week 1)**
1. Set up cloud infrastructure
2. Configure MongoDB database
3. Deploy Node.js backend
4. Deploy Flask ML service
5. Deploy React frontend
6. Configure domain and SSL

**Phase 2: Testing (Week 2)**
1. Run integration tests
2. Perform load testing
3. Security audit
4. Fix bugs

**Phase 3: Soft Launch (Week 3)**
1. Limited user access (beta testers)
2. Monitor performance
3. Gather feedback
4. Iterate

**Phase 4: Full Launch (Week 4)**
1. Public release
2. Marketing campaign
3. User onboarding
4. 24/7 monitoring

---

### 12.3 Continuous Integration/Continuous Deployment (CI/CD)

**Pipeline**:
```
Code Push (Git)
  ↓
Automated Tests (Unit + Integration)
  ↓
Build (Docker images)
  ↓
Deploy to Staging
  ↓
Smoke Tests
  ↓
Manual Approval
  ↓
Deploy to Production
  ↓
Health Checks
```

**Tools**:
- GitHub Actions / GitLab CI
- Docker for containerization
- Kubernetes for orchestration (future)

---

## 13. MAINTENANCE & SUPPORT

### 13.1 Ongoing Maintenance

**Weekly Tasks**:
- Monitor system health metrics
- Review error logs
- Check database performance
- Verify backup integrity

**Monthly Tasks**:
- Update dependencies (security patches)
- Review user feedback
- Analyze usage patterns
- Optimize slow queries

**Quarterly Tasks**:
- Model retraining evaluation
- Security audit
- Performance optimization
- Feature enhancements

---

### 13.2 Support Plan

**Support Channels**:
1. **In-app Chatbot**: First line of support
2. **Email**: support@welltrack.com (24-hour response)
3. **FAQ Page**: Common questions
4. **Admin Dashboard**: For escalated issues

**Issue Priority Levels**:
- **P0 (Critical)**: System down, data breach → 1-hour response
- **P1 (High)**: ML service down, login issues → 4-hour response
- **P2 (Medium)**: Feature not working → 24-hour response
- **P3 (Low)**: Enhancement requests → 7-day response

---

## 14. RISKS & MITIGATION

### 14.1 Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|------------|------------|
| ML model accuracy degrades | High | Medium | Regular retraining, monitoring |
| Database failure | High | Low | Daily backups, replica set |
| Security breach | High | Medium | Security audits, encryption, rate limiting |
| API rate limits exceeded | Medium | Medium | Implement caching, optimize queries |
| Third-party service downtime (OpenAI) | Low | Medium | Fallback to rule-based chatbot |

---

### 14.2 Project Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|------------|------------|
| Timeline delay | Medium | High | Agile sprints, regular check-ins |
| Scope creep | Medium | High | Strict PRD adherence, change control |
| Insufficient testing | High | Medium | Dedicated testing phase, automated tests |
| Poor user adoption | High | Medium | User testing, feedback loops, marketing |

---

### 14.3 Legal/Compliance Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| HIPAA compliance | High | Disclaimer: "Not a medical diagnosis tool", encrypt PHI |
| Medical malpractice | High | Clear disclaimers, recommend doctor consultation |
| Data privacy (GDPR) | Medium | User consent, data deletion option, privacy policy |

---

## 15. SUCCESS CRITERIA & KPIs

### 15.1 Technical Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| System Uptime | 99% | Monitoring tools |
| Prediction Accuracy | >89% | Test set evaluation |
| Response Time | <3 seconds (95th percentile) | API monitoring |
| Error Rate | <1% | Log analysis |
| Test Coverage | >80% | Code coverage tools |

---

### 15.2 User Adoption Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Registered Users | 10,000 (Year 1) | Database count |
| Monthly Active Users | 6,000 (60%) | Login analytics |
| Predictions per Day | 500+ | Usage analytics |
| User Retention (3 months) | 40% | Cohort analysis |
| Average Session Duration | 5+ minutes | Analytics |

---

### 15.3 Business Impact Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| User Satisfaction | 4.5+ stars | Feedback ratings |
| High-Risk Detection Rate | >75% sensitivity | Clinical validation |
| Doctor Consultation Rate | 30% of high-risk users | Survey |
| Feature Adoption Rate | 70% use diet/workout plans | Usage analytics |

---

## 16. GLOSSARY

| Term | Definition |
|------|------------|
| **AUC-ROC** | Area Under Receiver Operating Characteristic Curve - measures model's ability to distinguish between classes |
| **BMI** | Body Mass Index - weight (kg) / height² (m²) |
| **Sensitivity** | True Positive Rate - % of actual positive cases correctly identified |
| **Specificity** | True Negative Rate - % of actual negative cases correctly identified |
| **PPV** | Positive Predictive Value (Precision) - % of predicted positives that are actually positive |
| **NPV** | Negative Predictive Value - % of predicted negatives that are actually negative |
| **SMOTE** | Synthetic Minority Over-sampling Technique - method to handle class imbalance |
| **XGBoost** | Extreme Gradient Boosting - machine learning algorithm |
| **JWT** | JSON Web Token - authentication mechanism |
| **HIPAA** | Health Insurance Portability and Accountability Act - US healthcare data privacy law |
| **GDPR** | General Data Protection Regulation - EU data privacy law |

---

## 17. APPENDICES

### Appendix A: Sample API Requests/Responses
(Detailed examples provided in Section 9)

### Appendix B: Database Schema Diagrams
(ERD provided in Section 8)

### Appendix C: UI Mockups
(Wireframes provided in Section 7)

### Appendix D: Model Training Logs
(See separate document: `model_training_report.pdf`)

### Appendix E: Security Audit Report
(To be conducted before production deployment)

---

## DOCUMENT APPROVAL

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Project Lead | [Your Name] | Feb 16, 2026 | _________ |
| Technical Lead | [Name] | Feb 16, 2026 | _________ |
| Faculty Advisor | [Professor Name] | Feb 16, 2026 | _________ |

---

## DOCUMENT HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Feb 16, 2026 | Claude AI | Initial PRD creation based on WellTrack project requirements |

---

**END OF DOCUMENT**

---

## 📥 How to Use This PRD

This PRD is ready for your final-year project submission. You can:

1. **Use in Claude Code** - Import directly for AI-assisted development
2. **Copy to Word/Google Docs** - Format with your university template
3. **Present to Faculty** - Use sections 1-5 for project proposal
4. **Guide Development** - Reference sections 5-10 for implementation
5. **Prepare Defense** - Use sections 11-15 for Q&A preparation

**All technical details align with your actual implemented system!**

Good luck with your project! 🎓
