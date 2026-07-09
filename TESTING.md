# Demo Setup & Testing Guide

## 1. Existing Sample Data
Prior to the full data seeding implementation, only **Jobs** possessed a seeder: `scraper/seed_sample_jobs.py` (a Python script using `pymongo` directly). This generated 50 mock jobs (rotating titles, companies, locations, salaries), tagged with accessibility categories, but bypassed the Node/Express backend layers entirely.

**Not Seeded by Python:** `UserProfile`, `Application`, `Feedback`, and `ShortLink` schemas. 
The application does not have multi-user registration or authentication. The UI collects credentials on sign-up but strictly upserts a **single, shared `UserProfile` document** that all endpoints operate upon. A "Guest login" action bypasses the network completely and defaults to a hardcoded local state (`Alex Johnson`), saving nothing to the DB.

## 2. Comprehensive Data Seeder
To resolve the data gap, a unified Node/TypeScript seed script (`scripts/seed.ts`) is included. It utilizes the actual Mongoose models, remaining perfectly in sync with the live application schema.

When executed, it generates:
| Collection | Created Assets |
|---|---|
| `UserProfile` | 1 profile ("Alex Johnson") featuring specific skills, `suitabilityCategories: ["Vision Impaired"]`, and accommodation requirements. |
| `Job` | 20 sample jobs (utilizing the same generator logic as the legacy Python script, ported to TS). |
| `Application` | 3 applications referencing the first 3 jobs, respectively in `applied`, `interviewing`, and `rejected` states. The `interviewing` record includes a pre-filled decay message to facilitate testing of the "trigger decay" notification flow. |
| `Feedback` | 5 entries encompassing job-match, chatbot, and general portal feedback types. |

The script is idempotent per collection (skipping creation if data is already present) and supports a `--reset` flag to wipe collections before reseeding.

## 3. End-to-End Testing Walkthrough

**Backend Prerequisites:** 
You must configure your local environment by copying `.env.example` to `.env.local` and ensuring you provide valid database credentials.

```env
MONGO_URI="mongodb+srv://.../kairos"
REDIS_URL="redis://127.0.0.1:6379"
GEMINI_API_KEY="..."
GROQ_API_KEY="..."
MISTRAL_API_KEY="..."
HF_TOKEN="..."
OPENROUTER_API_KEY="..."
```
*Note: Without valid `MONGO_URI` and `REDIS_URL` credentials, the backend application will crash on DB-dependent endpoints. Missing AI keys will merely degrade AI features gracefully to canned fallback responses.*

**Setup & Execution:**
```bash
npm install
npx tsx scripts/seed.ts          # Initial seed
npx tsx scripts/seed.ts --reset  # To wipe and reseed later
npm run dev
```
Navigate to `http://localhost:5173`.

**Account & Login Flow Testing:**
- **"Guest login"**: Instantly grants access utilizing local UI state only (useful for validating contrast, text scale, and TTS accessibility features without touching the DB).
- **"Sign Up" Form**: Submits a `POST` to `/api/profile`, either updating the existing seed profile or establishing a fresh one. Be aware that this merely modifies the **single shared profile account**.

**Core Features to Validate Post-Seeding:**
- **Jobs Tab:** Verify the 20 seeded jobs render with dynamic compatibility scores intelligently computed against the profile's `suitabilityCategories`, `skills`, and `accommodationRequirements`.
- **Applications Tab:** Confirm the 3 seeded applications appear. Execute the "trigger decay" action on the `interviewing` state application to validate the n8n webhook call path (it will safely warn/skip if `N8N_WEBHOOK_URL` is omitted).
- **Feedback Panel:** Ensure the 5 seeded entries correctly list.
- **Chatbot:** The AI assistant will dynamically query live jobs (`Job.find({isActive:true})`), functioning successfully regardless of seed data.
- **Company Review:** Test hitting `/api/company-review/:companyName` via browser or UI with a seeded company name. Note that this returns purely AI-generated/estimated data, not verified factual scrapes.

> [!WARNING]
> Because the architecture explicitly relies on a singular shared `UserProfile`, testing multi-tenant interactions or concurrent user sessions is inherently unsupported. All browsers and users hitting the backend will share identical profile, applications, and feedback data.
