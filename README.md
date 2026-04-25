<!--
  CampusIQ - The AI Student Operating System
  Simple. Elegant. Powerful.
-->

<div align="center">
  <img src="./public/campusiq_banner.png" alt="CampusIQ Banner" width="100%" style="border-radius: 20px; margin-bottom: 20px;">

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

## 💎 The Platform Experience

### 🌌 Immersive Landing Page
A high-fidelity entry point featuring a "Cyber-Nexus" aesthetic with dual-theme support.
<div align="center">
  <img src="./public/screenshots/landing_page_1777139480870.png" width="48%" alt="Landing Dark">
  <img src="./public/screenshots/landing_page_light_1777139630164.png" width="48%" alt="Landing Light">
</div>

### 🔑 Premium Authentication
Re-engineered Sign-in/Sign-up flows with glassmorphism, native dark/light mode sync, and marketing-led onboarding.
<div align="center">
  <img src="./public/screenshots/signin_page_1777139500217.png" width="48%" alt="Signin Dark">
  <img src="./public/screenshots/signin_page_light_1777139670356.png" width="48%" alt="Signin Light">
</div>

---

## 🧠 Core Features

### 🚀 Intelligent Dashboard
The centralized academic cockpit. Track your recent activity, latest mock scores, and overall readiness at a glance.
<img src="./public/screenshots/dashboard_main_1777139732647.png" alt="Dashboard Hub" width="100%" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px;">

### 📚 Syllabus Hub
Upload your university syllabus (PDF/Image) and let Gemini AI extract subjects and topics into interactive glass-cards.
<img src="./public/screenshots/syllabus_hub_1777139747802.png" alt="Syllabus Hub" width="100%" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px;">

### 🛡️ Mock Exam Engine
A professional 75-mark examination simulator. Features multiple sections (Objective, Short, Long) with AI-powered grading and a resilient local fallback engine.
<img src="./public/screenshots/mock_exam_hub_1777139763004.png" alt="Mock Exam Engine" width="100%" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px;">

### 📊 Performance Analytics
Deep-dive into your academic data. Monitor subject mastery through heatmaps and track your mock exam history.
<img src="./public/screenshots/analytics_page_1777139777716.png" alt="Analytics Cockpit" width="100%" style="border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px;">

---

## 🛠️ Tech Stack

Built with the latest bleeding-edge technologies for speed and reliability.

| Category | Technology |
| :--- | :--- |
| **Framework** | **Next.js 16** (App Router & Server Actions) |
| **Intelligence** | **Google Gemini 1.5 Flash** (Vision & Text) |
| **Database** | **PostgreSQL** via **Prisma ORM** |
| **Security** | **Clerk** (JWT-based Enterprise Auth) |
| **UI Engine** | **Vanilla CSS & Framer Motion** (Glassmorphism) |
| **State** | **Zustand** (Ultra-light reactive state) |

---

## 🚀 Quick Start

Get CampusIQ running on your local machine in under 2 minutes.

1.  **Clone & Install**
    ```bash
    git clone https://github.com/danish-rizwan-dev/CampusIQ.git
    cd CampusIQ
    npm install
    ```

2.  **Environment Setup**
    Create a `.env` file with your **Clerk**, **Database**, and **Gemini** keys.

3.  **Database Push**
    ```bash
    npx prisma db push
    npm run db:seed
    ```

4.  **Run Development**
    ```bash
    npm run dev
    ```

---

<div align="center">
  <b>Built for the ambitious. Engineered by Danish Rizwan.</b>
  <br />
  CampusIQ © 2026 • Your Academic OS is Online.
</div>
