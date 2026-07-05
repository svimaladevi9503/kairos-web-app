# Kairos - Empowering Inclusive Opportunities

Kairos is a specialized career portal designed to bridge the gap between digital talents and highly accommodating work environments. With a strong focus on accessibility and human-centric design principles, Kairos helps differently-abled job seekers discover, track, and apply for roles that meet their specific sensory, physical, and cognitive requirements.

## 🌟 Key Features

- **Accessibility-First UI:** Built-in High Contrast mode, Dark Mode, adjustable Text Scaling, and native Screen Reader Audio Guide with speech synthesis.
- **Intelligent AI Auto-Apply Engine:** Computes dynamic compatibility scores based on your accommodation profile and auto-submits applications to highly matched jobs.
- **AI Conversational Discovery (Kairos Assistant):** Ask questions about support setups, matching listings, or how to prepare accessible resumes using AI.
- **Job Scraper & Classifier:** Simulates scraping job descriptions and classifies them based on disability suitability.
- **Proactive Match Recommendations:** Background crawlers highlight the best opportunities and tag relevant skills for recruiters.
- **Application Tracking:** Monitor your job applications and automate follow-ups via integrated communication channels (WhatsApp, Telegram, Email).

## 🚀 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS (v4)
- **Icons:** Lucide React
- **AI & Data Integrations:** Google Gemini API, Groq, Mistral, Hugging Face, OpenRouter, Apify
- **State Management:** React `useReducer` and Custom Hooks

## 🛠️ Run Locally

**Prerequisites:** Node.js (v18+ recommended)

1. **Clone the project & Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Set up your AI API Keys in a `.env.local` file (or provide them through the app's settings when available). For example:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   GROQ_API_KEY=your_groq_api_key
   APIFY_API_TOKEN=your_apify_token
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Navigate to `http://localhost:5173` to explore the Kairos inclusive workspace.

## ♿ Core Accessibility Principles

- Human-Centric Design Principles
- Screen-Reader Compatibility (Atkinson Hyperlegible guidelines)
- Deep AI Job Accommodation Audit
- Keyboard Navigation Support

## 🗄️ Backend & Database Architecture

Kairos utilizes a robust three-layer NoSQL database system, ensuring clearly separated concerns across intelligence, file management, and operational speed:

1. **MongoDB Atlas (Intelligence & Content Layer)**
   - Serves as the primary AI and scraping database.
   - Stores scraped job listings (both raw and AI-processed).
   - Archives Groq/LLaMA conversation histories.
   - Maintains job classifications, plain-language summaries, scraping logs, and user profile data.

2. **Firebase (File Management Layer)**
   - Utilizes Firestore and Firebase Storage.
   - Handles all user uploads including resumes, accessibility documents, and profile pictures.
   - Manages file metadata (upload timestamps, linked user IDs).
   - Powers **Firebase Dynamic Links** for shareable, dynamic job URLs.

3. **Redis (Operational & Speed Layer)**
   - Manages high-speed operational data like user sessions and authentication tokens.
   - Handles the state of recently applied and follow-up application queues.
   - Tracks **n8n automation** notification statuses (pending/sent).
   - Caches job listings to prevent redundant scraping cycles.

### ⚙️ Automation & Fallback Pipeline
Kairos relies heavily on **n8n automation pipelines** to coordinate data flows:
- **Notifications:** Dynamic shareable job links are generated via Firebase and seamlessly routed through n8n for delivery to the user via WhatsApp, Telegram, or Email.
- **Resilience Fallback:** If an originally scraped job link becomes dead or unavailable, the system automatically falls back to the internally stored MongoDB record and delivers a reconstructed Firebase Dynamic Link via n8n to ensure zero data loss for the job seeker.

---
*Kairos Systems • Continuous Calibration Enabled*
