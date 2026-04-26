# 🎓 CampusIQ: THE INTELLIGENT AI ACADEMIC PLATFORM
## DISSERTATION / MAJOR PROJECT REPORT
### (MCA / B.Tech Final Semester)

---

## DECLARATION

I, **Danish Rizwan**, a student of **B.Tech (Computer Science & Engineering)** hereby declare that the dissertation entitled "**CampusIQ - The AI Student Operating System**" which is being submitted by me to the Department of Computer Science & Engineering, School of Engineering Sciences & Technology, Jamia Hamdard, New Delhi in partial fulfillment of the requirement for the award of the degree of **B.Tech (CSE)**, is my original work and has not been submitted anywhere else for the award of any Degree, Diploma, Associateship, Fellowship or other similar title or recognition.

**Signature of the Applicant:** __________________________

**Date:** 26th April 2026
**Place:** New Delhi

---

## 1. OBJECTIVE
The primary objective of **CampusIQ** is to transform the fragmented academic experience into a unified, AI-driven operating system. It aims to:
- Automate syllabus analysis and topic extraction using Multimodal AI.
- Provide a living academic roadmap (8-Semester Autopilot) that re-calibrates based on career goals.
- Simulate professional 75-mark examinations with real-time AI grading.
- Bridge the gap between university curriculum and industry-standard skills.

---

## 2. PROBLEM STATEMENT
Modern students face "Academic Overload" caused by:
1. **Fragmented Tools**: Using separate apps for notes, schedules, and career tracking.
2. **Static Curriculum**: University syllabi often lack direct links to industry-ready skills.
3. **Assessment Anxiety**: Lack of high-fidelity mock environments for terminal examinations.
4. **Manual Tracking**: Manually calculating attendance, GPA readiness, and career progress.

---

## 3. SRS (IEEE FORMAT)
### 3.1 UML Use Case Diagram
The system facilitates three primary actors:
- **Student**: Manages syllabus, takes exams, tracks roadmap.
- **AI Core (Gemini)**: Processes PDFs, generates questions, grades subjective answers.
- **Database (PostgreSQL)**: Persists student progress, analytics, and mock history.

### 3.2 System Requirements
- **Frontend**: Next.js 16 (App Router), React 19, Vanilla CSS (Glassmorphism).
- **Backend**: Next.js API Routes, Prisma ORM.
- **AI Engine**: Google Gemini 1.5 Flash.
- **Auth**: Clerk Enterprise Security.

---

## 4. SNAPSHOTS OF DIFFERENT SCREENS

### 4.1 Global Cockpit (Dashboard)
The central hub for academic telemetry and rapid action.
![Dashboard](./public/screenshots/dashboard_main_1777139732647.png)

### 4.2 8-Semester AI Autopilot (Roadmap)
The living roadmap bridging academic modules to industry careers.
![Roadmap Overview](./public/screenshots/roadmap_overview_1777140676189.png)

### 4.3 Multimodal Syllabus Hub
Extracting structured intelligence from university PDFs.
![Syllabus Hub](./public/screenshots/syllabus_hub_1777139747802.png)

### 4.4 Professional Mock Exam Player
Simulating the 75-mark university examination format with AI grading.
![Mock Exam Engine](./public/screenshots/mock_exam_hub_1777139763004.png)

### 4.5 Performance Analytics
Visual mastery mapping and GPA readiness tracking.
![Analytics Page](./public/screenshots/analytics_page_1777139777716.png)

---

## 5. UML CLASS DIAGRAM
- **User**: ClerkID, Name, Email, Stats.
- **MockExam**: SubjectID, ExamData (JSON), Results (JSON), Score.
- **Syllabus**: SubjectName, Modules, Topics, Credits.
- **Roadmap**: CareerPath, Milestones, Progress.

---

## 6. CONCLUSION & FUTURE SCOPE
CampusIQ successfully demonstrates how Agentic AI can revolutionize student productivity. 
**Future Scope includes:**
- Integration with LinkedIn for real-time job market skill mapping.
- Collaborative 3D Subject Cubes for group learning.
- Mobile native application for cross-platform availability.

---

## 7. BIBLIOGRAPHY
1. Next.js Documentation (2026) - https://nextjs.org/docs
2. Google Gemini AI API Reference (2026) - https://ai.google.dev/
3. Prisma ORM Schema Design Patterns - https://www.prisma.io/docs
4. IEEE Standard for System and Software Requirements (830-1998).
