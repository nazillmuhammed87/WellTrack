# WellTrack Database Schemas

---

## 1. User

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `fullName` | String | Yes | Max 100 chars |
| `email` | String | Yes | Unique, lowercase |
| `password` | String | Yes | Min 6 chars, hidden by default |
| `role` | String | — | `'user'` \| `'admin'`, default `'user'` |
| `isVerified` | Boolean | — | Default `false`, set by admin |
| `verifiedBy` | ObjectId → User | — | Admin who verified |
| `verifiedAt` | Date | — | |
| `rejectionReason` | String | — | |
| `loginAttempts` | Number | — | Default `0` |
| `lockUntil` | Date | — | Set after 5 failed logins (30 min lock) |
| `phone` | String | — | Optional |
| `dateOfBirth` | Date | — | Optional |
| `gender` | String | — | `'male'` \| `'female'` \| `'other'` \| `''` |
| `address` | String | — | Optional |
| `profileImage` | String | — | File path |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

---

## 2. Prediction

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `userId` | ObjectId → User | Yes | |
| `healthData.age` | Number | Yes | 18–100 |
| `healthData.gender` | String | Yes | |
| `healthData.hypertension` | Number | Yes | `0` or `1` |
| `healthData.heartDisease` | Number | Yes | `0` or `1` |
| `healthData.everMarried` | String | Yes | `'Yes'` \| `'No'` |
| `healthData.workType` | String | Yes | `Private` \| `Self-employed` \| `Govt_job` \| `children` \| `Never_worked` |
| `healthData.residenceType` | String | Yes | `'Urban'` \| `'Rural'` |
| `healthData.avgGlucoseLevel` | Number | Yes | 50–300 |
| `healthData.bmi` | Number | Yes | 10–60 |
| `healthData.smokingStatus` | String | Yes | `formerly smoked` \| `never smoked` \| `smokes` \| `Unknown` |
| `prediction` | Number | Yes | `0` (no stroke) or `1` (stroke) |
| `probability` | Number | Yes | 0.0–1.0 |
| `riskLevel` | String | Yes | `'Low'` \| `'Medium'` \| `'High'` |
| `confidence` | Number | — | 0.0–1.0 |
| `topFeatures` | Array | — | `[{ feature, value, impact }]` |
| `isActive` | Boolean | — | Default `true` (soft delete) |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

---

## 3. Doctor

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `name` | String | Yes | Max 100 chars |
| `email` | String | — | Optional |
| `phone` | String | — | Optional |
| `specialization` | String | Yes | `'Cardiologist'` \| `'Neurologist'` \| `'General Physician'` \| `'Endocrinologist'` |
| `hospital` | String | Yes | |
| `address` | String | — | Optional |
| `location.lat` | Number | — | Optional |
| `location.lng` | Number | — | Optional |
| `experience` | Number | — | Years, min 0 |
| `rating` | Number | — | 0–5, default `0` |
| `availableDays` | [String] | — | `Monday`–`Sunday` |
| `availableTime.from` | String | — | e.g. `'09:00'` |
| `availableTime.to` | String | — | e.g. `'17:00'` |
| `consultationFee` | Number | — | Optional |
| `image` | String | — | File path |
| `isActive` | Boolean | — | Default `true` (soft delete) |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

---

## 4. DietPlan

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `userId` | ObjectId → User | Yes | |
| `predictionId` | ObjectId → Prediction | Yes | |
| `riskLevel` | String | Yes | `'Low'` \| `'Medium'` \| `'High'` |
| `guidelines` | [String] | — | List of dietary guidelines |
| `foodsToEat` | [String] | — | Recommended foods |
| `foodsToAvoid` | [String] | — | Foods to avoid |
| `sampleMealPlan.breakfast` | [String] | — | |
| `sampleMealPlan.lunch` | [String] | — | |
| `sampleMealPlan.dinner` | [String] | — | |
| `sampleMealPlan.snacks` | [String] | — | |
| `specialNotes` | [String] | — | Modifiers based on BMI, glucose, age |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

---

## 5. WorkoutPlan

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `userId` | ObjectId → User | Yes | |
| `predictionId` | ObjectId → Prediction | Yes | |
| `riskLevel` | String | Yes | `'Low'` \| `'Medium'` \| `'High'` |
| `guidelines` | [String] | — | Exercise guidelines |
| `exercises` | [Object] | — | `[{ name, duration, frequency, intensity, description }]` |
| `weeklySchedule.monday` | String | — | |
| `weeklySchedule.tuesday` | String | — | |
| `weeklySchedule.wednesday` | String | — | |
| `weeklySchedule.thursday` | String | — | |
| `weeklySchedule.friday` | String | — | |
| `weeklySchedule.saturday` | String | — | |
| `weeklySchedule.sunday` | String | — | |
| `safetyNotes` | [String] | — | Safety instructions |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

---

## 6. Feedback

| Field | Type | Required | Notes |
|---|---|---|---|
| `_id` | ObjectId | auto | Primary key |
| `userId` | ObjectId → User | Yes | |
| `category` | String | Yes | `general` \| `prediction` \| `plans` \| `doctors` \| `chatbot` \| `bug` \| `feature` |
| `subject` | String | Yes | Max 100 chars |
| `description` | String | Yes | Max 500 chars |
| `rating` | Number | Yes | 1–5 |
| `screenshots` | [String] | — | File paths, max 3 files |
| `status` | String | — | `'pending'` \| `'reviewed'` \| `'resolved'`, default `'pending'` |
| `adminResponse` | String | — | Admin reply text |
| `respondedBy` | ObjectId → User | — | Admin who responded |
| `respondedAt` | Date | — | |
| `createdAt` | Date | auto | |
| `updatedAt` | Date | auto | |

---

## Relationships

| Collection | References | Type |
|---|---|---|
| Prediction | User (`userId`) | Many predictions → One user |
| DietPlan | User (`userId`), Prediction (`predictionId`) | One plan per prediction |
| WorkoutPlan | User (`userId`), Prediction (`predictionId`) | One plan per prediction |
| Feedback | User (`userId`) | Many feedbacks → One user |
| Doctor | — | Standalone (no user FK) |
