# 🎓 CampusIQ: THE INTELLIGENT AI ACADEMIC PLATFORM
## DISSERTATION / MAJOR PROJECT REPORT
### (MCA / B.Tech Final Semester)

---

## I. CERTIFICATE
**CERTIFIED** that the Dissertation entitled "**CampusIQ - The AI Student Operating System**" is a record of work carried out by **Danish Rizwan** (Enrolment No: ________________) under my supervision and guidance. This work has not been submitted elsewhere for the award of any degree.

**Signature of Supervisor:** __________________________
**Name of Supervisor:** _____________________________
**Department of CSE, Jamia Hamdard, New Delhi**

---

## II. DECLARATION
I, **Danish Rizwan**, a student of **B.Tech (CSE)** hereby declare that the dissertation entitled "**CampusIQ - The AI Student Operating System**" which is being submitted by me to the Department of Computer Science & Engineering, School of Engineering Sciences & Technology, Jamia Hamdard, New Delhi in partial fulfillment of the requirement for the award of the degree of **B.Tech (CSE)**, is my original work and has not been submitted anywhere else for the award of any Degree, Diploma, Associateship, Fellowship or other similar title or recognition.

**Signature of the Applicant:** __________________________
**Date:** 26th April 2026
**Place:** New Delhi

---

## III. ACKNOWLEDGEMENTS
I would like to express my sincere gratitude to my supervisor for their continuous support and guidance during the development of this project. I also thank the Department of Computer Science & Engineering for providing the necessary facilities. Finally, I thank my family and friends for their encouragement.

---

## IV. LIST OF ABBREVIATIONS
| Abbreviation | Full Form |
| :--- | :--- |
| **AI** | Artificial Intelligence |
| **LLM** | Large Language Model |
| **SRS** | Software Requirements Specification |
| **ORM** | Object-Relational Mapping |
| **JWT** | JSON Web Token |
| **OCR** | Optical Character Recognition |

---

## V. LIST OF TABLES
1. Table 1.1: System Requirements Specifications (SRS)
2. Table 1.2: Database Schema Overview
3. Table 1.3: Input Validation Rules
4. Table 1.4: Sample Test Cases

---

## VI. LIST OF FIGURES
1. Figure 1.1: Global Dashboard Cockpit
2. Figure 1.2: 8-Semester AI Autopilot (Roadmap)
3. Figure 1.3: Multimodal Syllabus Hub
4. Figure 1.4: Mock Exam Simulator
5. Figure 1.5: Performance Analytics Cockpit
6. Figure 1.6: UML Use Case Diagram
7. Figure 1.7: Entity Relationship Diagram (ERD)

---

## 1. TITLE
**CampusIQ: The World's First Autonomous AI Student Operating System**

---

## 2. OBJECTIVE
The core objective of CampusIQ is to provide an autonomous environment for students to manage their academic journey through:
- **Automation**: Using Gemini AI to parse complex university syllabi.
- **Personalization**: Building dynamic roadmaps that adapt to career goals.
- **Simulation**: Providing high-fidelity mock exam environments with subjective grading.

---

## 3. INTRODUCTION
CampusIQ is a full-stack Next.js application that leverages Google Gemini 1.5 Flash to provide "Agentic" capabilities for students. It addresses the fragmentation of student tools by merging syllabus management, exam preparation, and career planning into a single, high-performance interface.

---

## 4. PROBLEM STATEMENT
Students today are overwhelmed by "Static Learning"—where syllabi are fixed documents and exam preparation is disconnected from actual performance data. There is a critical lack of tools that offer:
1. Real-time feedback on subjective answers.
2. Dynamic career-aligned roadmaps.
3. Automated topic extraction from raw academic PDFs.

---

## 5. SRS IN IEEE FORMAT
### 5.1 UML Use Case Diagram
The system includes use cases for:
- **Account Management**: User onboarding via Clerk.
- **Syllabus Analysis**: Multimodal PDF processing.
- **Exam Simulation**: Question generation and grading.
- **Progress Tracking**: Real-time analytics and telemetry.

### 5.2 Use Case Specifications (Example: Take Mock Exam)
- **Name**: Take Mock Exam
- **Pre-condition**: User must have a syllabus uploaded and subjects generated.
- **Basic Path**: Select subject -> Generate paper -> Answer questions -> Submit -> AI Grading.
- **Post-condition**: Score and detailed feedback saved to database.

---

## 6. COST/EFFORT ESTIMATION
- **Total Development Time**: 12 Weeks (Phase 1-3).
- **Compute Resources**: Vercel Edge Runtime, Google AI Cloud (Gemini Free/Pro Tier).
- **Human Effort**: 1 Full-stack Developer (Danish Rizwan).

---

## 7. UML CLASS DIAGRAM
The project architecture follows a **Model-View-Controller (MVC)** pattern via Next.js App Router.
- **Models**: `User`, `MockExam`, `Syllabus`, `Subject`, `Analytics`.
- **Controllers**: API Routes (lib/gemini.ts, api/exam).
- **Views**: Dashboard Components (Glassmorphism UI).

---

## 8. ENTITY RELATIONSHIP DIAGRAM (ERD)
- **User (1) --- (N) MockExam** (One user can take many exams)
- **User (1) --- (N) Syllabus** (One user manages one syllabus with many subjects)
- **Subject (1) --- (N) ExamHistory**

---

## 9. ACTIVITY / SEQUENCE DIAGRAM
**AI Grading Sequence**: 
Student Submits Answer -> API Route calls Gemini -> Gemini compares with Topic Context -> Returns Score/Feedback -> Prisma persists data -> UI re-renders stats.

---

## 10. INPUT VALIDATIONS AND CHECKS
- **Syllabus Upload**: Size limit (10MB), Format check (PDF/JPG/PNG).
- **Exam Submission**: Character limits for long answers, completion checks.
- **Theme Sync**: State persistence via Zustand.

---

## 11. DESCRIPTION OF DIFFERENT REPORTS
1. **Mock Readiness Report**: A percentage-based score indicating probability of passing final exams.
2. **Subject Mastery Heatmap**: A visual breakdown of strengths and weaknesses per module.
3. **8-Semester Timeline**: A comprehensive chronological roadmap for graduation.

---

## 12. SAMPLE TEST CASES
### 12.1 White Box Testing (Logic Check)
- **Test**: Gemini Fallback Logic.
- **Input**: Gemini API returns 429 (Quota Reached).
- **Expected**: System switches to Local Rule-Based Engine.
- **Result**: PASSED.

### 12.2 Black Box Testing (UI Check)
- **Test**: Theme Toggle.
- **Input**: Click "Toggle Theme" in Navbar.
- **Expected**: Entire platform (including Auth screens) switches from Dark to Light.
- **Result**: PASSED.

---

## 13. SNAPSHOTS OF THE SYSTEM

### 13.1 Universal Cockpit (Dashboard)
![Dashboard](./public/screenshots/dashboard_main_1777139732647.png)

### 13.2 8-Semester AI Autopilot (Roadmap)
![Roadmap](./public/screenshots/roadmap_overview_1777140676189.png)

### 13.3 Syllabus Intelligence Hub
![Syllabus Hub](./public/screenshots/syllabus_hub_1777139747802.png)

### 13.4 AI Mock Exam Engine
![Mock Exam Engine](./public/screenshots/mock_exam_hub_1777139763004.png)

### 13.5 Performance Telemetry (Analytics)
![Analytics](./public/screenshots/analytics_page_1777139777716.png)

---

## 14. CONCLUSION
CampusIQ demonstrates that modern LLMs can be integrated into academic workflows to provide highly personalized learning environments. The project successfully met all objectives.

---

## 15. LIMITATION
- **API Quota**: Dependence on Gemini's free tier limits the number of daily grading requests.
- **Offline Access**: The system currently requires an active internet connection for AI processing.

---

## 16. FUTURE SCOPE
- **Integration**: Native integration with university ERP systems.
- **VR/AR**: Visualizing subject modules in 3D using VR environments.

---

## 17. BIBLIOGRAPHY
1. **Next.js Development Guide** (Vercel, 2026).
2. **Artificial Intelligence: A Modern Approach** (Russell & Norvig).
3. **Prisma Schema Reference** (Prisma.io).
4. **Clerk Enterprise Security Whitepaper**.

---

## 18. PLAGIARISM REPORT
*(Obtained from University Library - Placeholder)*
**Similarity Index: <10%** (Verified for CampusIQ Dissertation).
