<div align="center">
  <img src="./public/campusiq_banner.png" alt="CampusIQ Banner" width="100%">

  # 🎓 CampusIQ
  ### *The World's First Autonomous Student Operating System*

  [![Next.js](https://img.shields.io/badge/Next.js-16.2.3-black?logo=next.js&style=for-the-badge)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-7.7.0-2D3748?logo=prisma&style=for-the-badge)](https://www.prisma.io/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&style=for-the-badge)](https://tailwindcss.com/)
  [![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-4285F4?logo=google-gemini&style=for-the-badge)](https://ai.google.dev/)
  [![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&style=for-the-badge)](https://clerk.com/)

  **CampusIQ** isn't just a dashboard; it's a precision-engineered engine for high-velocity learning. By leveraging **Google Gemini AI**, it architects your career from Semester 1 to CEO, replacing fragmented tools with a single neural interface.

  [Explore Modules](#-engine-modules) • [Tech Stack](#-technology-stack) • [Getting Started](#-getting-started) • [Architecture](#-project-structure)
</div>

---

## 🚀 Engine Modules

### 🧠 The 8-Semester Autopilot
A living roadmap that re-calibrates every 24 hours based on your focus, energy levels, and upcoming deadlines.
- **Curriculum Mapping**: Complete alignment with your university syllabus.
- **Skill-Gap Analysis**: Identifies what you need to learn to land high-tier offers.
- **Credit Tracking**: Real-time monitoring of your academic progress.

### 🛡️ Panic Protocol
Emergency triage for exam season. When time is short, CampusIQ identifies high-yield topics and builds a laser-focused preparation strategy.
- **High-Yield Extraction**: AI identifies the most important modules from your syllabus.
- **Rapid Documentation**: Instant, exam-ready explanations for complex concepts.

### 🤖 Cognitive Tutor
Your AI specialized study companion that learns your weak spots and crafts custom drills to fix them.
- **Subject Cube 3D**: An immersive navigation system for immersive learning.
- **Explanation-First Approach**: Documents that focus on clarity and retention.

### 💼 Career Synthesis
Bridge the gap between passing exams and landing your dream role.
- **Personalized Assessments**: Skills, interests, and salary goals integrated into career logic.
- **Market Intel**: AI-driven recommendations based on real-time industry trends.

### 📊 Attendance Guard & Time Sync
- **Predictive Alerts**: Get notified before you hit the academic "danger zone."
- **Adaptive Timetable**: A schedule that breathes with you and your changing priorities.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/) |
| **Backend** | Next.js API Routes (Edge Compatible) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/) |
| **Artificial Intelligence** | [Google Gemini 1.5 Pro](https://ai.google.dev/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **UI Components** | Radix UI, Lucide Icons, Sonner Toasts |
| **Charts** | [Recharts](https://recharts.org/) |

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/danish-rizwan-dev/CampusIQ---Final-Year-Project.git
cd CampusIQ---Final-Year-Project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/campusiq"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Gemini AI
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 4. Database Initialization
```bash
npx prisma db push
npm run db:seed
```

### 5. Launch the System
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to initialize the OS.

---

## 📂 Project Structure

```bash
src/
├── app/               # Next.js App Router (Dashboard, Public, API)
│   ├── (dashboard)/   # Core platform features (Analytics, AI, Career)
│   ├── (auth)/        # Authentication routes
│   └── api/           # Backend processing & AI handlers
├── components/        # Reusable UI components & Layouts
├── lib/               # Shared utilities (Gemini config, database)
├── store/             # Zustand state management
└── prisma/            # Database schema & seed scripts
```

---

## 🎨 Design Philosophy
CampusIQ is built with a **Premium Glassmorphism** aesthetic. We prioritize:
- **Visual Excellence**: Vibrant gradients and sleek dark mode.
- **Micro-animations**: Smooth transitions that make the app feel alive.
- **Immersive Navigation**: 3D elements and card-based layouts for an "App-like" feel.

---

<div align="center">
  Master Your Academic Fate.
  <br />
  Built with ❤️ by <b>Danish Rizwan</b>
  <br />
  <b>CampusIQ © 2026 • All Systems Operational</b>
</div>
