# WellTrack - Implementation Plan
## Context

WellTrack is an intelligent healthcare management system that predicts stroke risk using ML (XGBoost) and provides personalized health plans, doctor recommendations, and a chatbot. Three services: React frontend (port 3000), Node.js + Express backend (port 5000), Flask ML service (port 5001), backed by MongoDB.

---

## Project Structure

```
welltrack/
├── spec/                              # PRD (exists)
├── client/                            # React.js Frontend (Port 3000)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/                # Navbar, Footer, ProtectedRoute, AdminRoute, LoadingSpinner, ErrorBoundary, Pagination
│   │   │   ├── auth/                  # LoginForm, RegisterForm, ForgotPassword
│   │   │   ├── dashboard/             # UserDashboard, RecentActivity, QuickActions
│   │   │   ├── prediction/            # HealthForm (multi-step), Step1, Step2, PredictionResult, RiskGauge, FeatureChart, PredictionHistory
│   │   │   ├── plans/                 # DietPlan, WorkoutPlan
│   │   │   ├── doctors/               # DoctorList, DoctorCard, DoctorFilters
│   │   │   ├── chatbot/               # ChatWidget, ChatMessage, ChatInput
│   │   │   ├── feedback/              # FeedbackForm
│   │   │   └── admin/                 # AdminDashboard, AdminStats, UserManagement, UserVerificationModal, DoctorManagement, DoctorFormModal, FeedbackManagement, AnalyticsCharts
│   │   ├── pages/                     # All page components
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/                     # useAuth, useApi, useForm
│   │   ├── services/                  # api.js, authService, predictionService, doctorService, feedbackService, planService, adminService
│   │   └── utils/                     # validators.js, formatters.js, constants.js
│   ├── package.json
│   └── .env
├── server/                            # Node.js + Express Backend (Port 5000)
│   ├── config/                        # db.js, config.js
│   ├── models/                        # User, Prediction, Doctor, Feedback, DietPlan, WorkoutPlan
│   ├── routes/                        # authRoutes, predictionRoutes, doctorRoutes, feedbackRoutes, planRoutes, adminRoutes
│   ├── controllers/                   # authController, predictionController, doctorController, feedbackController, planController, adminController
│   ├── middleware/                    # auth.js, adminAuth.js, rateLimiter.js, validator.js, errorHandler.js, loginLimiter.js
│   ├── services/                      # mlService.js, aiAgentService.js, emailService.js
│   ├── utils/                         # logger.js, helpers.js
│   ├── seeds/                         # adminSeed.js, doctorSeed.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── ml-service/                        # Flask ML Service (Port 5001)
│   ├── app.py
│   ├── predict.py
│   ├── preprocess.py
│   ├── models/                        # welltrack_xgb_model.pkl, preprocessor.pkl
│   └── requirements.txt
├── .gitignore
└── docker-compose.yml                 # Optional
```

---

## Implementation Phases

### - [ ] Phase 1: Project Scaffolding & Database Setup

**Goal**: All 3 services running with basic connectivity.

**Files to create**:
- `server/package.json` — deps: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, express-validator, express-rate-limit, helmet, axios, winston, nodemailer, multer
- `server/server.js` — Express app: middleware chain (helmet, cors, json, rate limiter, routes, error handler)
- `server/config/db.js` — Mongoose connection with retry logic
- `server/config/config.js` — Centralized env access with defaults
- `server/.env` — PORT=5000, MONGO_URI, JWT_SECRET, ML_SERVICE_URL
- All 6 Mongoose models (User, Prediction, Doctor, Feedback, DietPlan, WorkoutPlan) matching PRD Section 8 schemas with `timestamps: true` and indexes
- User model adds `loginAttempts` (Number, default 0) and `lockUntil` (Date) for lockout
- `server/seeds/adminSeed.js` — default admin: admin@welltrack.com
- `client/` — Create React App with react-router-dom, axios, bootstrap 5, react-toastify, recharts
- `client/src/App.jsx` — Router skeleton with all route paths
- `client/.env` — REACT_APP_API_URL=http://localhost:5000/api
- `ml-service/app.py` — Flask with CORS, `/health` and `/predict` endpoints
- `ml-service/requirements.txt` — flask, flask-cors, xgboost, scikit-learn, joblib, numpy, pandas

**Verification**: All 3 services start without errors. MongoDB connected. `/health` endpoint returns OK.

---

### - [ ] Phase 2: Authentication System

**Goal**: Complete auth for users and admin with JWT, lockout, and role-based routing.

**Backend files**:
- `server/routes/authRoutes.js`
- `server/controllers/authController.js` — register, login, getProfile, forgotPassword
- `server/middleware/auth.js` — JWT verification, attaches `req.user`
- `server/middleware/adminAuth.js` — checks `req.user.role === 'admin'`
- `server/middleware/loginLimiter.js` — 5 failed attempts → 15-min lockout
- `server/middleware/validator.js` — validation chains for registration

**Frontend files**:
- `client/src/context/AuthContext.jsx` — login/logout/register, token in localStorage
- `client/src/services/api.js` — axios instance with interceptors (attach token, handle 401)
- `client/src/services/authService.js`
- `client/src/components/auth/LoginForm.jsx`
- `client/src/components/auth/RegisterForm.jsx`
- `client/src/components/common/ProtectedRoute.jsx` — redirects if no token; shows "pending verification" if not verified
- `client/src/components/common/AdminRoute.jsx` — redirects if role !== admin
- Login/Register pages

**Key logic**:
- **Register**: validate → check duplicate email → bcrypt hash (10 rounds) → create user `isVerified: false` → return success (no token)
- **Login**: find user → check lockout → compare password → on fail: increment attempts, lock at 5 → on success: reset attempts, generate JWT `{ id, email, role, isVerified }` (24h, or 30d with rememberMe)
- **Verification gate**: ProtectedRoute checks `isVerified`; unverified users see "pending verification" and cannot access prediction features

**Edge cases handled**:
- Expired/malformed JWT → 401, clear token, redirect to login
- Token for deleted user → DB lookup after decode, 401 if not found
- Duplicate email → Mongoose unique index catches, return friendly error
- Password never in response → `select('-password')` on all User queries

**Verification**: Register user → login → see pending verification page. Login as admin → access admin routes.

---

### - [ ] Phase 3: ML Service & Prediction Flow

**Goal**: End-to-end prediction from health form to results display.

**ML service files**:
- `ml-service/app.py` — Flask app with `/predict` and `/health`
- `ml-service/predict.py` — load model at startup, run prediction
- `ml-service/preprocess.py` — feature engineering + encoding + scaling

**Backend files**:
- `server/routes/predictionRoutes.js`
- `server/controllers/predictionController.js` — predict, getHistory, getPredictionById
- `server/services/mlService.js` — axios POST to Flask, 10s timeout, 2 retries

**Frontend files**:
- `client/src/components/prediction/HealthForm.jsx` — multi-step container
- `client/src/components/prediction/HealthFormStep1.jsx` — age, gender, height/weight/BMI
- `client/src/components/prediction/HealthFormStep2.jsx` — medical history fields
- `client/src/components/prediction/PredictionResult.jsx` — results display
- `client/src/components/prediction/RiskGauge.jsx` — circular gauge
- `client/src/components/prediction/FeatureChart.jsx` — top risk factors bar chart
- `client/src/components/prediction/PredictionHistory.jsx` — history table
- `client/src/services/predictionService.js`

**ML predict logic** (predict.py):
1. Load model + preprocessor at startup (not per-request)
2. Engineer 5 features from input: `age_group`, `bmi_category`, `glucose_risk`, `composite_risk`, `age_bmi_interaction`
3. Apply preprocessor pipeline (encoding + scaling)
4. Run `predict_proba()`
5. Risk level: <0.3 Low, 0.3–0.6 Medium, >=0.6 High
6. Return prediction, probability, risk_level, confidence, top_features

**Backend controller**: validate 10 fields → check isVerified → POST to Flask → store in MongoDB → return result

**Frontend**: multi-step form with BMI auto-calc, progress bar, real-time validation, submit button disables on click

**Edge cases handled**:
- Model file missing/corrupted → 503 with clear error
- NaN in features → 400 with field name
- Flask unreachable → 10s timeout, 2 retries, graceful 503 to user
- Values outside training range → lower confidence + warning
- Probability at boundaries → consistent inclusive rules
- Double-click submit → button disabled

**Verification**: Submit health data as verified user → prediction returned <3s with risk level, probability, top features. View prediction history.

---

### - [ ] Phase 4: AI-Generated Health Plans

**Goal**: Diet and workout plans based on prediction results.

**Files**:
- `server/routes/planRoutes.js`
- `server/controllers/planController.js` — generateDietPlan, generateWorkoutPlan, getUserPlans
- `server/services/aiAgentService.js` — rule-based templates
- `client/src/components/plans/DietPlan.jsx`
- `client/src/components/plans/WorkoutPlan.jsx`
- `client/src/pages/DietPlanPage.jsx`, `WorkoutPlanPage.jsx`
- `client/src/services/planService.js`

**Approach**: Rule-based templates (not OpenAI) — avoids API costs and external dependency.

**`aiAgentService.js`**:
- Diet templates per risk level with guidelines, foods to eat/avoid, sample meal plans
- Modifiers: BMI > 30 → weight-loss foods, glucose > 200 → diabetic-friendly subs, age > 65 → calcium/soft textures
- Workout templates per risk level, modified by age/BMI, safety notes for high-risk/elderly
- Plans stored in MongoDB linked to predictionId

**Trigger**: Auto-generate after prediction for all risk levels. Higher risk = more specific recommendations.

**Verification**: After prediction, diet and workout plans available. Plans differ by risk level. Plans stored and retrievable.

---

### - [ ] Phase 5: Doctor Recommendation System

**Goal**: Display and filter doctors by risk level.

**Files**:
- `server/routes/doctorRoutes.js`
- `server/controllers/doctorController.js` — getRecommended, getAll, getById
- `server/seeds/doctorSeed.js` — 15–20 sample doctors
- `client/src/components/doctors/DoctorList.jsx`, `DoctorCard.jsx`, `DoctorFilters.jsx`
- `client/src/pages/DoctorsPage.jsx`
- `client/src/services/doctorService.js`

**Recommendation logic**:
- High → Cardiologist, Neurologist, Internal Medicine
- Medium → General Practitioner, Internal Medicine, Preventive Care
- Low → General Practitioner, Preventive Care
- Filter by `isActive: true`, sort by rating
- Distance: Haversine calculation in app code (hardcoded sample coordinates)

**Verification**: After High-risk prediction, see cardiologists/neurologists. Filters work. Doctor cards display all info.

---

### - [ ] Phase 6: Admin Dashboard

**Goal**: User management, doctor CRUD, feedback review, analytics.

**Backend**:
- `server/routes/adminRoutes.js`
- `server/controllers/adminController.js` — getUsers (paginated), verifyUser, rejectUser, getStats, doctor CRUD, feedback management

**Frontend**:
- `client/src/components/admin/AdminDashboard.jsx` — stats cards + charts
- `client/src/components/admin/AdminStats.jsx` — 4 stat cards
- `client/src/components/admin/UserManagement.jsx` — table, search, filters, pagination, bulk verify
- `client/src/components/admin/UserVerificationModal.jsx` — verify/reject with reason
- `client/src/components/admin/DoctorManagement.jsx` — CRUD table
- `client/src/components/admin/DoctorFormModal.jsx` — add/edit form
- `client/src/components/admin/FeedbackManagement.jsx` — review and respond
- `client/src/components/admin/AnalyticsCharts.jsx` — Recharts
- All admin pages + `adminService.js`

**Key details**:
- Verify: set `isVerified=true`, `verifiedBy`, `verifiedAt`
- Reject: set `rejectionReason`, keep `isVerified=false`
- Bulk verify: `updateMany({ _id: { $in: userIds } })`
- Doctor delete: soft delete (`isActive=false`)
- Stats: aggregation for totals, risk distribution, trends

**Edge cases handled**:
- Verify already-verified → "already verified"
- Reject verified user → disallowed
- Delete doctor → soft delete, historical refs intact
- Admin deletes self → prevented
- Last admin → prevent removal

**Verification**: Admin can see stats, verify/reject users, CRUD doctors, review feedback. Pagination works. Bulk verify works.

---

### - [ ] Phase 7: Chatbot & Feedback

**Goal**: Rule-based healthcare chatbot and feedback system.

**Chatbot files**:
- `client/src/components/chatbot/ChatWidget.jsx` — floating, minimizable
- `client/src/components/chatbot/ChatMessage.jsx` — bot vs user bubbles
- `client/src/components/chatbot/ChatInput.jsx`

**Feedback files**:
- `server/routes/feedbackRoutes.js`
- `server/controllers/feedbackController.js`
- `client/src/components/feedback/FeedbackForm.jsx`
- `client/src/pages/FeedbackPage.jsx`

**Chatbot**: Client-side keyword matching with ~20 response categories (stroke info, risk factors, system help, emergency contacts). Clear medical disclaimer.

**Feedback**: Category, subject, description, rating (1-5), optional screenshots (multer, 5MB/file, max 3, stored in `server/uploads/`).

**Verification**: Chatbot responds to keywords. Feedback submits and appears in admin dashboard.

---

### - [ ] Phase 8: UI Polish & Landing Page

**Goal**: Complete responsive UI.

**Files**:
- `client/src/pages/LandingPage.jsx` — hero, features, how-it-works, CTA
- `client/src/components/common/Navbar.jsx` — role-based menu
- `client/src/components/common/Footer.jsx` — medical disclaimer
- `client/src/components/common/ErrorBoundary.jsx`
- `client/src/components/common/LoadingSpinner.jsx`
- `client/src/pages/ProfilePage.jsx`
- `client/src/pages/NotFoundPage.jsx`
- `client/src/utils/validators.js`, `constants.js`

**Details**: Bootstrap 5 responsive grid, react-toastify notifications, medical disclaimer on every page, color-coded risk levels (Green/Yellow/Red).

**Verification**: All pages responsive at 320px, 768px, 1024px. Landing page renders. 404 page works. Navbar adapts per role.

---

### - [ ] Phase 9: Error Handling, Security & Testing

**Goal**: Harden the app and write critical tests.

**Files**:
- `server/middleware/errorHandler.js` — catches Mongoose errors, JWT errors, returns sanitized messages
- `server/utils/logger.js` — Winston, never logs health data

**Tests**:
- Backend (Jest): auth endpoints (register, login, lockout), prediction endpoint, admin verify
- ML (pytest): preprocessing, prediction format, edge inputs
- Frontend (React Testing Library): basic component rendering

**Edge cases hardened**:
- Global error handler catches all unhandled errors
- Rate limiting enforced (100 req/min)
- Helmet security headers
- Input sanitization (xss-clean)
- ObjectId validation on route params

**Verification**: Login lockout works after 5 failures. Invalid inputs return proper errors. Rate limiting triggers at threshold. All tests pass.

---

## Academic Simplifications

1. **Email**: Log to console (or Ethereal/Mailtrap)
2. **2FA for admin**: Skip; mention as future enhancement
3. **Chatbot**: Rule-based (not OpenAI)
4. **Diet/workout plans**: Template-based (not OpenAI)
5. **File storage**: Local `server/uploads/` (not S3)
6. **Geospatial**: Haversine in code (not MongoDB 2dsphere)
7. **PDF export**: `window.print()` with print CSS
8. **Token blacklist**: Skip; clear localStorage on logout
9. **CSRF tokens**: Not needed (JWT in Authorization header)
10. **MongoDB**: Atlas free tier recommended
11. **Docker/CI-CD**: Optional; run services directly
12. **Test coverage**: Focus on critical paths, not 80% target

---

## Phase Dependencies

```
Phase 1 (Scaffold) → Phase 2 (Auth) → Phase 3 (ML + Prediction) → Phase 4 (Plans)
                                     ↘ Phase 5 (Doctors)
                                     ↘ Phase 6 (Admin)
                      Phase 7 (Chatbot/Feedback) — after Phase 2
                      Phase 8 (UI Polish) — after Phase 2, parallel with others
                      Phase 9 (Hardening/Testing) — final, after all features
```
