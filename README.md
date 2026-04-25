<!--
  CampusIQ - The AI Student Operating System
  Simple. Elegant. Powerful.
-->

<div align="center">
  <img src="./public/campusiq_banner.jpg" alt="CampusIQ Banner" width="100%">
 
  # 🎓 CampusIQ
  ### *Transforming Academic Complexity into AI-Driven Clarity*

  [![Next.js](https://img.shields.io/badge/Next.js-16.2.3-black?logo=next.js&style=flat-square)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2.4-61DAFB?logo=react&style=flat-square&logoColor=black)](https://react.dev/)
  [![Prisma](https://img.shields.io/badge/Prisma-7.7.0-2D3748?logo=prisma&style=flat-square)](https://www.prisma.io/)
  [![Google Gemini](https://img.shields.io/badge/AI-Gemini_1.5-4285F4?logo=google-gemini&style=flat-square)](https://ai.google.dev/)
  [![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&style=flat-square)](https://clerk.com/)

  **CampusIQ** is a premium, AI-powered academic operating system designed for modern students. It bridges the gap between curriculum and career by building an autonomous bridge from Semester 1 to your professional debut.

  [**Explore Features**](#-core-features) • [**Tech Stack**](#-tech-stack) • [**Setup Guide**](#-quick-start)
</div>

---

## 🛸 The Platform Experience

### 🌌 Universal Landing Page
A high-fidelity entry point featuring a "Cyber-Nexus" aesthetic with seamless dual-theme transitions.
<div align="center">
  <img src="./public/screenshots/landing_page_1777139480870.png" width="48%" alt="Landing Dark">
  <img src="./public/screenshots/landing_page_light_1777139630164.png" width="48%" alt="Landing Light">
</div>

### 🔑 Secure Authentication
Glassmorphic Sign-in/Sign-up flows with native theme synchronization and marketing-led onboarding.
<div align="center">
  <img src="./public/screenshots/signin_page_1777139500217.png" width="48%" alt="Signin Dark">
  <img src="./public/screenshots/signin_page_light_1777139670356.png" width="48%" alt="Signin Light">
</div>

---

## ⚙️ Core Engine

### 🔋 Intelligence Cockpit
The centralized dashboard to track activity, latest mock scores, and overall readiness at a glance.
<img src="./public/screenshots/dashboard_main_1777139732647.png" alt="Dashboard Hub" width="100%" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px;">

### 🧠 8-Semester Autopilot
A living academic roadmap that re-calibrates based on career goals, bridging the gap to industry-ready skills.
<div align="center">
  <img src="./public/screenshots/roadmap_overview_1777140676189.png" width="48%" alt="Roadmap Overview">
  <img src="./public/screenshots/roadmap_detailed_timeline_1777140705086.png" width="48%" alt="Detailed Timeline">
</div>
<br/>

### 📁 Syllabus Hub
Multimodal subject extraction—upload your syllabus and let Gemini AI generate interactive academic cards.
<img src="./public/screenshots/syllabus_hub_1777139747802.png" alt="Syllabus Hub" width="100%" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px;">

### 🛡️ Exam Simulator
A professional 75-mark simulator featuring AI grading and a resilient local fallback engine.
<img src="./public/screenshots/mock_exam_hub_1777139763004.png" alt="Mock Exam Engine" width="100%" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px;">

### 📈 Global Analytics
Deep-dive into subject mastery through heatmaps and track your complete mock examination history.
<img src="./public/screenshots/analytics_page_1777139777716.png" alt="Analytics Cockpit" width="100%" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px;">

---

## 🎨 Component Showcase

Individual UI building blocks engineered for visual excellence.

<div align="center">
  <table border="0">
    <tr>
      <td width="50%">
        <strong>Telemetry Cockpit</strong><br/>
        <img src="./public/screenshots/dashboard_stats_bar_1777140143425.png" width="100%"><br/>
        <em>Real-time monitoring of academic vigor.</em>
      </td>
      <td width="50%">
        <strong>Subject Selector</strong><br/>
        <img src="./public/screenshots/quick_generate_grid_1777140202532.png" width="100%"><br/>
        <em>Instant generation grid.</em>
      </td>
    </tr>
    <tr>
      <td width="50%">
        <strong>Heatmap Analytics</strong><br/>
        <img src="./public/screenshots/subject_breakdown_chart_1777140175215.png" width="100%"><br/>
        <em>Visual mastery mapping.</em>
      </td>
      <td width="50%">
        <strong>Focus Answering</strong><br/>
        <img src="./public/screenshots/mock_exam_question_box_detail_1777140357782.png" width="100%"><br/>
        <em>Distraction-free environment.</em>
      </td>
    </tr>
  </table>
</div>

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | **Next.js 16** (App Router) |
| **Intelligence** | **Google Gemini 1.5 Flash** |
| **Database** | **PostgreSQL** via **Prisma** |
| **Security** | **Clerk** (Enterprise Auth) |
| **UI Engine** | **Vanilla CSS & Framer Motion** |
| **State** | **Zustand** |

---

## 🚀 Getting Started

1.  **Clone & Install**
    ```bash
    git clone https://github.com/danish-rizwan-dev/CampusIQ.git
    cd CampusIQ
    npm install
    ```

2.  **Initialize**
    Create `.env` with your keys, then run:
    ```bash
    npx prisma db push
    npm run db:seed
    npm run dev
    ```

---

<div align="center">
  <b>Built for the ambitious. Engineered by Danish Rizwan.</b>
  <br />
  CampusIQ © 2026 • Your Academic OS is Online.
</div>
