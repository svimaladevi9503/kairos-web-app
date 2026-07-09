## Report: Sample Data & How to Test

### 1. What sample data already existed
Only **Jobs** had a seeder: `scraper/seed_sample_jobs.py` (Python, uses `pymongo` directly). It generates 50 fake jobs — rotating titles/companies/locations/salaries, tagged with 1–2 accessibility categories, with template `description`/`aiSummary` text. It writes straight into the `jobs` collection in MongoDB (bypassing the Node/Express layer entirely).

**Nothing existed for:** `UserProfile`, `Application`, `Feedback`, `ShortLink`. And there's no real signup — `LoginPage.tsx` collects a password in the UI but never sends or checks it; it just `POST`s name/email/preferences to `/api/profile`, which upserts the **one and only** UserProfile document the whole app operates on (no multi-user support at all). There's also a "Guest login" button that skips the network entirely and hardcodes a local user (`Alex Johnson`) — nothing is saved to the DB in that path.

### 2. New seed script I generated
`scripts/seed.ts` — TypeScript, uses the real Mongoose models so it stays in sync with the schema (unlike the Python script, which duplicates the shape by hand). It seeds:

| Collection | What it creates |
|---|---|
| `UserProfile` | 1 profile: "Alex Johnson", skills, `suitabilityCategories: ["Vision Impaired"]`, accommodation needs |
| `Job` | 20 sample jobs (same generator logic as the Python script, ported to TS) |
| `Application` | 3 applications against the first 3 jobs, one each in `applied` / `interviewing` / `rejected` status (the `interviewing` one has a decay message pre-filled, so you can test the "trigger decay" notification flow immediately) |
| `Feedback` | 5 entries covering job-match, chatbot, and general-portal feedback types |

It's idempotent per collection (skips if data exists) and supports `--reset` to wipe and reseed.

### 3. How to actually test this end-to-end

**Backend prerequisites** — you need real values in `.env.local` (copy from `.env.example` and add two more vars it's missing):
```env
MONGO_URI="mongodb+srv://.../kairos"
REDIS_URL="redis://..."
GEMINI_API_KEY="..."
GROQ_API_KEY="..."
MISTRAL_API_KEY="..."
HF_TOKEN="..."
OPENROUTER_API_KEY="..."
```
Without `MONGO_URI`/`REDIS_URL`, the app boots but every DB-backed endpoint 500s (Redis calls will also throw — worth wrapping those too, but that's out of scope here). Without the AI keys, each AI feature falls back to a canned response instead of failing outright — you can test the UI without any AI keys at all.

**Steps:**
```bash
npm install
npx tsx scripts/seed.ts          # first run
npx tsx scripts/seed.ts --reset  # to wipe and reseed later
npm run dev
```
Then open `http://localhost:5173`.

**Testing "creating an account":**
- Click **"Guest login"** → instantly in, but this never touches the DB, so it's only useful for UI/accessibility-feature testing (contrast, text scale, TTS), not for exercising `/api/profile` or job matching against a real profile.
- Use the **Sign Up** form instead → it calls `POST /api/profile`, which will either update the profile the seed script created, or create a fresh one if you haven't seeded yet. Either way, since there's no auth check, whatever email you type just overwrites the single shared profile — you're not creating a separate account, you're editing "the" account.

**What to check once seeded:**
- **Jobs tab** — should show the 20 seeded jobs with compatibility scores computed against your profile's `suitabilityCategories`/`skills`/`accommodationRequirements`.
- **Applications tab** — should show the 3 seeded applications; try the "trigger decay" action on the `interviewing` one to test the n8n webhook call path (it'll warn/skip if `N8N_WEBHOOK_URL` isn't set, which is fine).
- **Feedback panel** — should list the 5 seeded entries.
- **Chatbot** — works even without seed data since it queries live `Job.find({isActive:true})` each time.
- **Company review** (`/api/company-review/:companyName`) — try one of the seeded company names; this is AI-generated/estimated data, not real scraped info, worth remembering when reading the ratings it returns.

One thing worth flagging again given this new seed script: since there is truly only one `UserProfile` in the whole system, testing "multiple users" isn't possible without adding real auth — every browser session hitting this backend shares the same profile, applications, and feedback data.
