const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "scratch");
const pdfPath = path.join(root, "CampusIQ_Detailed_Dissertation.pdf");
const htmlPath = path.join(root, "CampusIQ_Detailed_Dissertation.html");

const img = (rel) => path.join(root, rel).replace(/\\/g, "/");

const figures = [
  ["Figure 13.1", "CampusIQ landing page in dark theme", "public/screenshots/landing_page_1777139480870.png"],
  ["Figure 13.2", "CampusIQ landing page in light theme", "public/screenshots/landing_page_light_1777139630164.png"],
  ["Figure 13.3", "Secure sign-in page", "public/screenshots/signin_page_1777139500217.png"],
  ["Figure 13.4", "Dashboard cockpit overview", "public/screenshots/dashboard_main_1777139732647.png"],
  ["Figure 13.5", "Dashboard telemetry stats bar", "public/screenshots/dashboard_stats_bar_1777140143425.png"],
  ["Figure 13.6", "Roadmap overview", "public/screenshots/roadmap_overview_1777140676189.png"],
  ["Figure 13.7", "Roadmap detailed timeline", "public/screenshots/roadmap_detailed_timeline_1777140705086.png"],
  ["Figure 13.8", "Active semester roadmap", "public/screenshots/roadmap_active_semester_1777140733123.png"],
  ["Figure 13.9", "Syllabus intelligence hub", "public/screenshots/syllabus_hub_1777139747802.png"],
  ["Figure 13.10", "Mock exam hub", "public/screenshots/mock_exam_hub_1777139763004.png"],
  ["Figure 13.11", "Mock exam question detail screen", "public/screenshots/mock_exam_question_box_detail_1777140357782.png"],
  ["Figure 13.12", "Analytics cockpit", "public/screenshots/analytics_page_1777139777716.png"],
  ["Figure 13.13", "Subject breakdown chart", "public/screenshots/subject_breakdown_chart_1777140175215.png"],
  ["Figure 13.14", "Quick generate grid", "public/screenshots/quick_generate_grid_1777140202532.png"],
];

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function p(text) {
  return `<p>${text}</p>`;
}

function table(headers, rows) {
  return `<table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
}

function figure(id, caption, rel, wide = true) {
  return `<figure class="${wide ? "wide" : ""}"><img src="file:///${img(rel)}" alt="${esc(caption)}"><figcaption>${id}: ${caption}</figcaption></figure>`;
}

const useCaseRows = [
  ["UC-01", "Register and authenticate user", "Student", "User has valid email or social login", "User signs up or signs in through Clerk, then the application syncs the Clerk identity into the Prisma User table.", "Authenticated dashboard session is available."],
  ["UC-02", "Generate academic roadmap", "Student, AI Core", "User is authenticated and enters course, duration, target career, skill level, and available hours.", "System calls Gemini, receives semester subjects, skills, projects, environment setup, and 24-week plan, then stores SemesterRoadmap.", "Semester 1 roadmap becomes ACTIVE."],
  ["UC-03", "Evaluate completed semester", "Student, AI Core", "At least one active roadmap exists.", "Student submits GPA, assignments, concept score, consistency, and mock score. System calculates weighted score and generates next semester.", "Current semester becomes COMPLETED and next semester becomes ACTIVE."],
  ["UC-04", "Analyze syllabus", "Student, AI Core", "User has raw text or supported PDF/image syllabus content.", "System extracts or receives text, asks Gemini for structured topics, difficulty, documentation, resources, and practice questions.", "SyllabusTopic records are saved and displayed."],
  ["UC-05", "Take mock examination", "Student, AI Core", "Subject and syllabus context are available.", "System generates a 75-mark exam, user answers questions, grading endpoint evaluates objective and subjective answers.", "MockExam is marked COMPLETED with score and feedback."],
  ["UC-06", "Use AI study assistant", "Student, AI Core", "User is authenticated.", "User enters topic and question; assistant responds in short or detailed mode and saves chat history.", "ChatSession is updated."],
  ["UC-07", "View analytics", "Student", "Roadmap or mock exam records exist.", "Dashboard aggregates completed semester metrics and mock scores.", "Charts, weakness indicator, and readiness score are displayed."],
];

const validationRows = [
  ["Authentication", "Clerk session must exist before protected APIs are executed.", "src/proxy.ts and each route handler call auth().", "Prevents anonymous access to academic records."],
  ["User synchronization", "Clerk user must have id and email before Prisma upsert.", "/api/user/sync validates clerkId and email.", "Avoids orphaned user records."],
  ["Roadmap generation", "targetCourse, durationYears, targetCareer, skillLevel, and availableHours are required.", "/api/roadmap/generate rejects incomplete requests.", "Ensures useful AI prompts and valid total semester count."],
  ["Duplicate roadmap", "Semester 1 roadmap cannot be regenerated unless overwrite is true.", "Transaction checks existing roadmap before creation.", "Protects user progress from accidental loss."],
  ["Syllabus analysis", "Text content is required before AI extraction.", "/api/syllabus/analyze returns 400 for missing text.", "Prevents empty model calls."],
  ["PDF parsing", "Uploaded file must exist and be within accepted processing limits.", "/api/syllabus/parse-pdf checks form data.", "Reduces malformed input failures."],
  ["Mock exam grading", "Exam must belong to authenticated user and not already be completed.", "/api/exam/mock/[id]/grade verifies ownership/status.", "Prevents duplicate grading and cross-user access."],
  ["Task and schedule ownership", "Task/class records are filtered by current user's Prisma id.", "/api/tasks and /api/schedule query by userId.", "Maintains tenant isolation."],
];

const whiteBoxRows = [
  ["WB-01", "Roadmap generation fallback", "Gemini API unavailable or JSON parse fails", "generateInitialRoadmap catches error and returns local 24-week mock roadmap", "PASS"],
  ["WB-02", "Performance score calculation", "gpa=80, consistency=70, concept=75, assignments=90, mock=60", "Weighted score = 80*.30 + 70*.20 + 75*.25 + 90*.15 + 60*.10 = 76.25", "PASS"],
  ["WB-03", "Mock grading fallback", "Subjective answer above 50 words", "Local evaluator awards approximately 75 percent of marks and returns feedback", "PASS"],
  ["WB-04", "Dashboard aggregation", "No completed semesters and no graded mocks", "Analytics endpoint returns hasData=false and setup guidance", "PASS"],
];

const blackBoxRows = [
  ["BB-01", "Login access control", "Unauthenticated user opens /dashboard", "User is redirected/protected by Clerk", "PASS"],
  ["BB-02", "Create roadmap with missing career", "Submit roadmap form without targetCareer", "API returns 400 Missing fields", "PASS"],
  ["BB-03", "Theme toggle", "Click theme control from navbar/topbar", "Application switches between light and dark variables", "PASS"],
  ["BB-04", "Generate mock exam", "Select subject and click generate", "A pending mock exam record appears and opens exam player", "PASS"],
  ["BB-05", "Delete task", "Click delete on an existing task", "Task disappears from timetable/task list", "PASS"],
  ["BB-06", "Analyze syllabus text", "Paste syllabus and submit", "Structured topics with difficulty, documentation, questions, and resources appear", "PASS"],
];

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>CampusIQ Detailed Dissertation</title>
<style>
  @page { size: A4; margin: 1in; @bottom-center { content: counter(page); font-family: "Times New Roman", serif; font-size: 10pt; } }
  * { box-sizing: border-box; }
  body { font-family: "Times New Roman", Times, serif; font-size: 12pt; line-height: 1.5; color: #111; margin: 0; }
  h1, h2, h3, h4 { font-family: "Times New Roman", Times, serif; color: #000; }
  h1 { font-size: 16pt; text-align: center; text-transform: uppercase; margin: 0 0 18pt; }
  h2.chapter { font-size: 14pt; text-transform: uppercase; text-align: center; margin: 0 0 18pt; padding-top: 1.2in; }
  h2.front { font-size: 14pt; text-transform: uppercase; text-align: center; margin: 0 0 18pt; }
  h3 { font-size: 12pt; margin: 14pt 0 6pt; }
  h4 { font-size: 12pt; margin: 10pt 0 4pt; font-style: italic; }
  p { text-align: justify; margin: 0 0 9pt; }
  ul, ol { margin-top: 0; }
  li { margin-bottom: 4pt; text-align: justify; }
  table { width: 100%; border-collapse: collapse; margin: 10pt 0 16pt; page-break-inside: avoid; }
  th, td { border: 1px solid #333; padding: 5pt 6pt; vertical-align: top; font-size: 10.5pt; line-height: 1.3; }
  th { background: #e9eef7; font-weight: bold; text-align: left; }
  .page { page-break-after: always; min-height: 9.6in; }
  .chapter-page { page-break-before: always; }
  .center { text-align: center; }
  .right { text-align: right; }
  .muted { color: #444; }
  .title-page { text-align: center; padding-top: 0.4in; }
  .title-page p { text-align: center; }
  .title-main { font-size: 22pt; line-height: 1.2; font-weight: bold; text-transform: uppercase; margin: 24pt 0; }
  .subtitle { font-size: 15pt; font-weight: bold; }
  .logo-box { margin: 24pt auto; width: 88%; border: 1px solid #aaa; padding: 10pt; }
  .signature { margin-top: 40pt; display: flex; justify-content: space-between; gap: 30pt; }
  .sig-box { width: 45%; }
  .toc td:first-child { width: 80%; }
  figure { margin: 14pt 0 20pt; page-break-inside: avoid; text-align: center; }
  figure img { max-width: 100%; max-height: 5.6in; border: 1px solid #777; }
  figure.wide img { width: 100%; height: auto; }
  figcaption { font-size: 10.5pt; font-weight: bold; margin-top: 5pt; text-align: center; }
  .diagram { display: block; margin: 12pt auto 20pt; max-width: 100%; border: 1px solid #777; background: #fff; page-break-inside: avoid; }
  .small { font-size: 10.5pt; }
  .no-break { page-break-inside: avoid; }
  .appendix-note { border: 1px solid #999; padding: 10pt; margin-top: 12pt; }
</style>
</head>
<body>

<section class="page title-page">
  <p class="subtitle">Bachelor of Technology (Computer Science &amp; Engineering)</p>
  <p class="subtitle">Final Semester Dissertation / Major Project Report</p>
  <div class="logo-box">
    <img src="file:///${img("public/campusiq_banner.jpg")}" style="max-width:100%; max-height:2.2in; border:0" alt="CampusIQ Banner">
  </div>
  <div class="title-main">CampusIQ: The AI Student Operating System</div>
  <p>Submitted in partial fulfillment of the requirements for the award of the degree of</p>
  <p><b>Bachelor of Technology (Computer Science &amp; Engineering)</b></p>
  <p>Submitted by</p>
  <p><b>Danish Rizwan</b><br>Enrollment Number: ____________________</p>
  <p>Under the supervision of</p>
  <p><b>Supervisor Name: ____________________</b></p>
  <p>Department of Computer Science &amp; Engineering<br>School of Engineering Sciences &amp; Technology<br>Jamia Hamdard, New Delhi</p>
  <p><b>Academic Year: 2025-2026</b></p>
</section>

<section class="page">
  <h2 class="front">Certificate</h2>
  ${p("This is to certify that the Dissertation / Major Project Report entitled <b>\"CampusIQ: The AI Student Operating System\"</b> is a bonafide record of the project work carried out by <b>Danish Rizwan</b>, Enrollment Number ____________________, in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology (Computer Science & Engineering) at the Department of Computer Science & Engineering, School of Engineering Sciences & Technology, Jamia Hamdard, New Delhi.")}
  ${p("The work reported in this dissertation has been carried out under my supervision and guidance. To the best of my knowledge, the work is original and has not been submitted to any other university or institution for the award of any degree, diploma, associateship, fellowship, or similar title.")}
  <div class="signature">
    <div class="sig-box"><p><b>Signature of Supervisor</b></p><p>Name: ____________________</p><p>Date: ____________________</p></div>
    <div class="sig-box"><p><b>Department Office Seal</b></p><p>Department of CSE</p><p>Jamia Hamdard, New Delhi</p></div>
  </div>
</section>

<section class="page">
  <h2 class="front">Declaration</h2>
  ${p("I, <b>Danish Rizwan</b>, a student of <b>Bachelor of Technology (Computer Science & Engineering)</b>, Enrollment Number ____________________, hereby declare that the dissertation entitled <b>\"CampusIQ: The AI Student Operating System\"</b>, which is being submitted by me to the Department of Computer Science & Engineering, School of Engineering Sciences & Technology, Jamia Hamdard, New Delhi, in partial fulfillment of the requirement for the award of the degree of Bachelor of Technology (Computer Science & Engineering), is my original work.")}
  ${p("I further declare that this work has not been submitted anywhere else for the award of any Degree, Diploma, Associateship, Fellowship, or other similar title or recognition. All references, tools, APIs, frameworks, and supporting materials used in the project have been acknowledged appropriately in the bibliography.")}
  <div class="signature">
    <div class="sig-box"><p><b>Signature and Name of Applicant</b></p><p>Danish Rizwan</p></div>
    <div class="sig-box"><p>Date: 26 April 2026</p><p>Place: New Delhi</p></div>
  </div>
</section>

<section class="page">
  <h2 class="front">Acknowledgements</h2>
  ${p("I express my sincere gratitude to my project supervisor for continuous guidance, valuable feedback, and encouragement throughout the planning, design, development, testing, and documentation of this project. Their advice helped shape CampusIQ from an initial idea into a complete full-stack academic software system.")}
  ${p("I am thankful to the Department of Computer Science & Engineering, School of Engineering Sciences & Technology, Jamia Hamdard, New Delhi, for providing the academic environment and technical foundation required to complete this work. I also acknowledge the documentation and developer communities around Next.js, React, Prisma, Clerk, PostgreSQL, and Google Gemini, whose resources were helpful during implementation.")}
  ${p("Finally, I thank my family, friends, and peers for their support, patience, and motivation during the development of this final year project.")}
  <div class="signature">
    <div class="sig-box"><p><b>Signature</b></p><p>Danish Rizwan</p></div>
    <div class="sig-box"><p>Date: 26 April 2026</p><p>Place: New Delhi</p></div>
  </div>
</section>

<section class="page">
  <h2 class="front">List of Abbreviations</h2>
  ${table(["Abbreviation", "Full Form"], [
    ["AI", "Artificial Intelligence"],
    ["API", "Application Programming Interface"],
    ["B.Tech", "Bachelor of Technology"],
    ["CSE", "Computer Science & Engineering"],
    ["DBMS", "Database Management System"],
    ["ERD", "Entity Relationship Diagram"],
    ["HTTP", "Hypertext Transfer Protocol"],
    ["IEEE", "Institute of Electrical and Electronics Engineers"],
    ["JSON", "JavaScript Object Notation"],
    ["LLM", "Large Language Model"],
    ["ORM", "Object Relational Mapping"],
    ["PDF", "Portable Document Format"],
    ["SRS", "Software Requirements Specification"],
    ["UI", "User Interface"],
    ["UML", "Unified Modeling Language"],
  ])}
</section>

<section class="page">
  <h2 class="front">List of Tables</h2>
  ${table(["Table No.", "Caption", "Page No."], [
    ["Table 5.1", "Functional Requirements", "12"],
    ["Table 5.2", "Non-functional Requirements", "13"],
    ["Table 5.3", "Use Case Specifications", "15"],
    ["Table 6.1", "Cost and Effort Estimation", "20"],
    ["Table 10.1", "Input Validations and Checks", "27"],
    ["Table 11.1", "Description of Reports", "29"],
    ["Table 12.1", "White Box Test Cases", "31"],
    ["Table 12.2", "Black Box Test Cases", "32"],
  ])}
  <h2 class="front">List of Figures</h2>
  ${table(["Figure No.", "Caption", "Page No."], [
    ["Figure 5.1", "UML Use Case Diagram", "14"],
    ["Figure 7.1", "UML Class Diagram", "22"],
    ["Figure 8.1", "Entity Relationship Diagram", "24"],
    ["Figure 9.1", "Mock Exam Grading Sequence Diagram", "26"],
    ["Figure 12.1", "Gantt Chart", "33"],
    ...figures.map((f, i) => [f[0], f[1], String(35 + i)]),
  ])}
</section>

<section class="chapter-page">
  <h2 class="chapter">1. Title</h2>
  ${p("The title of the dissertation is <b>CampusIQ: The AI Student Operating System</b>. CampusIQ is a full-stack, AI-assisted academic management platform designed for students who need one unified environment for career planning, semester roadmaps, syllabus intelligence, examination preparation, mock assessment, class scheduling, task management, and performance analytics.")}
  ${p("The project has been developed as a modern web application using Next.js 16, React 19, Prisma, PostgreSQL, Clerk authentication, Google Gemini AI, Zustand, Recharts, and a responsive custom CSS interface. It demonstrates how artificial intelligence can be integrated into academic workflows to reduce manual planning effort and provide personalized guidance.")}
</section>

<section class="chapter-page">
  <h2 class="chapter">2. Objective</h2>
  ${p("The objective of CampusIQ is to convert a fragmented student workflow into a unified, intelligent, and measurable academic operating system. Students commonly use separate tools for timetables, notes, syllabus tracking, exam preparation, career research, and performance review. This separation creates duplicated effort and weak feedback loops. CampusIQ addresses this by centralizing academic data and applying AI where interpretation, generation, and evaluation are useful.")}
  <h3>2.1 Primary Objectives</h3>
  <ol>
    <li>To provide secure student onboarding and dashboard access through Clerk authentication.</li>
    <li>To generate adaptive semester-wise academic roadmaps based on course duration, current skill level, available study hours, and target career.</li>
    <li>To parse or analyze syllabus content and convert it into structured topics, subtopics, difficulty levels, documentation, resources, and practice questions.</li>
    <li>To generate exam preparation strategies and 75-mark mock examination papers from syllabus context.</li>
    <li>To grade mock exams with AI support and local fallback logic where possible.</li>
    <li>To track progress through analytics, charts, readiness scores, and historical performance snapshots.</li>
    <li>To provide an AI study assistant that can answer conceptual questions in short or detailed modes.</li>
  </ol>
  <h3>2.2 Scope of the Project</h3>
  ${p("The scope includes a complete student-facing web platform, protected dashboard routes, API route handlers, database persistence, AI generation endpoints, analytics aggregation, and a responsive user interface. The system is not intended to replace institutional ERP systems; rather, it complements them by providing a student-owned planning and preparation layer.")}
</section>

<section class="chapter-page">
  <h2 class="chapter">3. Introduction</h2>
  ${p("Education technology has evolved from static information systems to adaptive digital environments. Traditional academic tools often record information but rarely interpret it. A timetable application may store class timings, a note application may store text, and a syllabus PDF may list topics, but these tools usually do not connect the information to career goals, examination readiness, or learning progress. CampusIQ has been designed to bridge that gap.")}
  ${p("CampusIQ is built around the idea that a student needs an academic command center. The system connects four major data flows: the student's identity and profile, the curriculum or syllabus, semester-wise planning, and performance evidence from tasks, mocks, and evaluations. Once these data flows exist together, AI can help generate roadmaps, explain topics, recommend preparation plans, and evaluate answers.")}
  ${p("The application uses Next.js App Router for routing and server-side API handlers. Clerk provides authentication. Prisma with PostgreSQL stores structured data. Google Gemini is used for natural language reasoning and JSON generation. The user interface follows a dashboard model with major modules such as Roadmap, Career, Syllabus, Assistant, Exam Prep, Mock Exam, Timetable, Analytics, and Settings.")}
  <h3>3.1 Motivation</h3>
  ${p("The motivation behind CampusIQ is the observation that students often know what they must study, but not how to prioritize it, how it connects to career outcomes, or how prepared they are for assessment. CampusIQ transforms static academic information into actionable plans and measurable feedback.")}
  <h3>3.2 Technology Overview</h3>
  ${table(["Layer", "Technology Used", "Purpose"], [
    ["Frontend", "Next.js 16, React 19, Vanilla CSS, Lucide Icons", "Responsive student dashboard and public landing pages"],
    ["Authentication", "Clerk", "Secure login, signup, session management, and protected routes"],
    ["Backend", "Next.js Route Handlers", "Internal APIs for roadmap, syllabus, chat, exams, tasks, analytics, and users"],
    ["Database", "PostgreSQL with Prisma 7", "Persistent relational data and JSON academic structures"],
    ["AI", "Google Gemini", "Roadmap generation, syllabus analysis, chat assistant, exam generation, grading"],
    ["State", "Zustand", "Client-side theme and lightweight app state"],
    ["Charts", "Recharts", "Analytics and performance visualization"],
  ])}
</section>

<section class="chapter-page">
  <h2 class="chapter">4. Problem Statement</h2>
  ${p("Students in technical courses face a combination of academic, organizational, and career-planning challenges. Their learning resources are scattered across PDF syllabi, classroom notes, online tutorials, exam papers, placement advice, spreadsheets, and messaging groups. This fragmentation makes it difficult to answer practical questions such as: Which topics should I study first? How does this semester connect to my target career? Am I improving over time? What kind of questions can appear in the exam?")}
  ${p("The problem is not merely the absence of information. In most cases, students have too much unstructured information. The real challenge is converting that information into a personalized plan and then measuring progress against it.")}
  <h3>4.1 Existing Challenges</h3>
  <ol>
    <li><b>Static syllabus documents:</b> University syllabi are often distributed as documents that require manual interpretation.</li>
    <li><b>Disconnected preparation:</b> Exam preparation is often separated from syllabus tracking and career planning.</li>
    <li><b>Lack of feedback:</b> Students rarely receive quick feedback for long-form theoretical answers outside the classroom.</li>
    <li><b>Manual performance tracking:</b> Students manually track assignments, consistency, GPA, mock tests, and readiness.</li>
    <li><b>Career uncertainty:</b> Students may not understand how semester subjects and projects align with industry roles.</li>
  </ol>
  <h3>4.2 Proposed Problem Definition</h3>
  ${p("The problem addressed by CampusIQ is the lack of an integrated, AI-assisted academic platform that can transform syllabus and performance data into personalized roadmaps, exam simulations, study assistance, and analytics for students in computer science and related programs.")}
</section>

<section class="chapter-page">
  <h2 class="chapter">5. Software Requirements Specification in IEEE Format</h2>
  <h3>5.1 Purpose</h3>
  ${p("This Software Requirements Specification describes the functional and non-functional requirements for CampusIQ. It defines the behavior expected from the system, the major actors, use cases, data interactions, and quality constraints.")}
  <h3>5.2 Intended Audience</h3>
  ${p("The intended audience includes students, faculty supervisors, evaluators, developers maintaining the system, and future researchers who may extend the platform.")}
  <h3>5.3 Product Perspective</h3>
  ${p("CampusIQ is a web-based academic management and intelligence platform. It operates as a browser-accessible application backed by cloud-compatible services. It relies on external providers for authentication and AI processing while maintaining its own PostgreSQL database for user-owned academic data.")}
  <h3>5.4 Functional Requirements</h3>
  ${table(["Req. ID", "Requirement", "Description", "Priority"], [
    ["FR-01", "Authentication", "The system shall allow students to sign up, sign in, and sign out securely.", "High"],
    ["FR-02", "User Sync", "The system shall synchronize authenticated Clerk users into the local database.", "High"],
    ["FR-03", "Roadmap Generation", "The system shall generate an initial semester roadmap using target career, course, duration, skill level, and study hours.", "High"],
    ["FR-04", "Roadmap Evaluation", "The system shall evaluate semester performance and generate the next semester roadmap.", "High"],
    ["FR-05", "Syllabus Analysis", "The system shall analyze syllabus text/PDF-derived content and generate structured study topics.", "High"],
    ["FR-06", "Mock Exam", "The system shall generate, store, display, grade, and retake mock exams.", "High"],
    ["FR-07", "AI Assistant", "The system shall provide a study assistant that answers academic queries.", "Medium"],
    ["FR-08", "Timetable", "The system shall allow class schedule creation and viewing.", "Medium"],
    ["FR-09", "Tasks", "The system shall allow task creation, update, completion, and deletion.", "Medium"],
    ["FR-10", "Analytics", "The system shall aggregate roadmap and mock exam data into visual reports.", "High"],
  ])}
  <h3>5.5 Non-functional Requirements</h3>
  ${table(["Req. ID", "Category", "Requirement"], [
    ["NFR-01", "Security", "All dashboard and API routes must be protected by authenticated sessions."],
    ["NFR-02", "Usability", "The interface must be responsive and usable on desktop and mobile devices."],
    ["NFR-03", "Reliability", "The system should provide fallback responses for selected AI failures."],
    ["NFR-04", "Maintainability", "Code should follow modular Next.js route and component structure."],
    ["NFR-05", "Performance", "Dashboard pages should fetch only necessary internal API data."],
    ["NFR-06", "Scalability", "Database models should support multiple users and one-to-many academic records."],
    ["NFR-07", "Compatibility", "The system should work in modern browsers and deploy on standard Node/Next hosting."],
  ])}
  <h3>5.6 UML Use Case Diagram</h3>
  <svg class="diagram" width="680" height="500" viewBox="0 0 680 500" xmlns="http://www.w3.org/2000/svg">
    <rect x="130" y="30" width="420" height="430" rx="10" fill="#f7f9ff" stroke="#333"/>
    <text x="340" y="55" text-anchor="middle" font-family="Times New Roman" font-size="16" font-weight="bold">CampusIQ System</text>
    <circle cx="60" cy="145" r="18" fill="none" stroke="#000"/><line x1="60" y1="163" x2="60" y2="220" stroke="#000"/><line x1="25" y1="182" x2="95" y2="182" stroke="#000"/><line x1="60" y1="220" x2="30" y2="260" stroke="#000"/><line x1="60" y1="220" x2="90" y2="260" stroke="#000"/><text x="60" y="285" text-anchor="middle" font-size="13">Student</text>
    <circle cx="620" cy="170" r="18" fill="none" stroke="#000"/><line x1="620" y1="188" x2="620" y2="245" stroke="#000"/><line x1="585" y1="207" x2="655" y2="207" stroke="#000"/><line x1="620" y1="245" x2="590" y2="285" stroke="#000"/><line x1="620" y1="245" x2="650" y2="285" stroke="#000"/><text x="620" y="310" text-anchor="middle" font-size="13">AI Core</text>
    ${[
      [250,95,"Authenticate"],[420,95,"Sync Profile"],[250,160,"Generate Roadmap"],[420,160,"Analyze Syllabus"],[250,225,"Take Mock Exam"],[420,225,"AI Grade Answers"],[250,290,"Manage Timetable"],[420,290,"Track Analytics"],[335,355,"Ask Study Assistant"]
    ].map(([x,y,t]) => `<ellipse cx="${x}" cy="${y}" rx="88" ry="25" fill="#fff" stroke="#333"/><text x="${x}" y="${y+4}" text-anchor="middle" font-size="12">${t}</text>`).join("")}
    ${[[95,145,162,95],[95,150,162,160],[95,160,162,225],[95,175,162,290],[95,190,247,355],[532,170,508,160],[532,185,508,225],[532,205,423,355]].map(([x1,y1,x2,y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#555"/>`).join("")}
  </svg>
  <p class="center small"><b>Figure 5.1:</b> UML Use Case Diagram</p>
  <h3>5.7 Use Case Specifications</h3>
  ${table(["Use Case", "Name", "Actor", "Pre-condition", "Basic Path", "Post-condition"], useCaseRows)}
</section>

<section class="chapter-page">
  <h2 class="chapter">6. Cost and Effort Estimation</h2>
  ${p("Cost and effort estimation is prepared for a student-led final year software project. The development was performed by one full-stack developer using open-source frameworks and free or student-accessible cloud services. Monetary cost is therefore low, while effort cost is measured in analysis, design, implementation, testing, and documentation time.")}
  ${table(["Activity", "Estimated Duration", "Effort Description", "Output"], [
    ["Requirement analysis", "1 week", "Study academic workflow, identify modules, prepare feature list.", "Problem definition and SRS"],
    ["UI/UX design", "1.5 weeks", "Design landing page, dashboard shell, sidebar, mobile navigation, cards, forms, and themes.", "Responsive interface"],
    ["Database design", "1 week", "Design Prisma models for users, roadmaps, tasks, syllabus, exams, chats, and analytics.", "Database schema"],
    ["Authentication setup", "0.5 week", "Integrate Clerk, protected proxy, login, signup, user sync.", "Secure access flow"],
    ["AI integration", "2 weeks", "Prepare Gemini prompts, JSON schemas, fallbacks, roadmap/exam/syllabus/chat logic.", "AI service layer"],
    ["Dashboard modules", "3 weeks", "Build roadmap, syllabus, assistant, exam, mock exam, timetable, analytics pages.", "Functional modules"],
    ["Testing and debugging", "1.5 weeks", "Run build checks, validate API behavior, test UI flows, handle errors.", "Stable release"],
    ["Documentation", "1 week", "Prepare report, diagrams, screenshots, testing tables, bibliography.", "Dissertation"],
  ])}
  ${p("The project uses Next.js, React, Prisma, PostgreSQL, Clerk, Gemini, and Recharts. The use of managed tools reduces infrastructure cost but increases dependency on API availability and correct environment configuration.")}
</section>

<section class="chapter-page">
  <h2 class="chapter">7. UML Class Diagram</h2>
  ${p("The UML class model is derived from the Prisma schema and the application modules. The main aggregate root is User. A User can have one CareerProfile and many SemesterRoadmap, Task, ClassSchedule, ChatSession, ExamPrep, SyllabusTopic, and MockExam records. JSON fields are used where AI-generated structures are flexible, such as weeklyBreakdown, examData, results, resources, and practice questions.")}
  <svg class="diagram" width="700" height="610" viewBox="0 0 700 610" xmlns="http://www.w3.org/2000/svg">
    <defs><style>.c{fill:#fff;stroke:#222}.h{fill:#e9eef7}.t{font-family:Times New Roman;font-size:11px}.b{font-weight:bold}</style></defs>
    ${[
      [260,20,180,120,"User",["id: String","clerkId: String","email: String","profileCompleted: Boolean"],["syncProfile()","viewDashboard()"]],
      [40,190,180,115,"CareerProfile",["selectedCareer: String","interests: String[]","careerReadinessScore: Float"],["evaluateCareer()"]],
      [260,190,180,135,"SemesterRoadmap",["semesterNumber: Int","status: String","subjects: Json","weeklyBreakdown: Json","performanceScore: Float"],["generate()","evaluate()"]],
      [480,190,180,115,"SyllabusTopic",["subjectName: String","topicName: String","difficulty: String","documentation: Text"],["analyze()"]],
      [40,390,180,115,"MockExam",["subject: String","examData: Json","results: Json","score: Int","status: String"],["generateExam()","gradeExam()"]],
      [260,390,180,95,"Task",["title: String","type: String","priority: String","status: String"],["create()","complete()"]],
      [480,390,180,95,"ChatSession",["topicContext: String","messages: Json"],["askAssistant()"]],
      [260,520,180,75,"ClassSchedule",["subjectName: String","dayOfWeek: Int","startTime: String","endTime: String"],["addClass()"]],
    ].map(([x,y,w,h,name,attrs,methods]) => `
      <rect class="c" x="${x}" y="${y}" width="${w}" height="${h}"/>
      <rect class="h" x="${x}" y="${y}" width="${w}" height="24"/>
      <text class="t b" x="${x+w/2}" y="${y+16}" text-anchor="middle">${name}</text>
      <line x1="${x}" y1="${y+24}" x2="${x+w}" y2="${y+24}" stroke="#222"/>
      ${attrs.map((a,i)=>`<text class="t" x="${x+7}" y="${y+42+i*14}">- ${a}</text>`).join("")}
      <line x1="${x}" y1="${y+h-28}" x2="${x+w}" y2="${y+h-28}" stroke="#222"/>
      ${methods.map((m,i)=>`<text class="t" x="${x+7}" y="${y+h-12+i*14}">+ ${m}</text>`).join("")}
    `).join("")}
    ${[[350,140,130,190],[350,140,350,190],[350,140,570,190],[350,140,130,390],[350,140,350,390],[350,140,570,390],[350,140,350,520]].map(([x1,y1,x2,y2])=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#555"/><text class="t" x="${(x1+x2)/2}" y="${(y1+y2)/2-4}">1..*</text>`).join("")}
  </svg>
  <p class="center small"><b>Figure 7.1:</b> UML Class Diagram</p>
</section>

<section class="chapter-page">
  <h2 class="chapter">8. Entity Relationship Diagram</h2>
  ${p("The database is implemented using PostgreSQL and Prisma. The schema includes strong entities such as User, CareerProfile, SemesterRoadmap, Task, ClassSchedule, ChatSession, ExamPrep, SyllabusTopic, and MockExam. User is the central entity, and most academic records depend on it through foreign key relationships with cascade delete.")}
  <svg class="diagram" width="700" height="500" viewBox="0 0 700 500" xmlns="http://www.w3.org/2000/svg">
    <defs><style>.e{fill:#fff;stroke:#111}.eh{fill:#dfeafa}.txt{font-family:Times New Roman;font-size:12px}.key{font-weight:bold;text-decoration:underline}</style></defs>
    ${[
      [275,30,150,70,"USER",["id PK","clerkId UNIQUE","email UNIQUE"]],
      [40,150,150,70,"CAREER_PROFILE",["id PK","userId FK UNIQUE","selectedCareer"]],
      [275,150,150,85,"ROADMAP",["id PK","userId FK","semesterNumber","status"]],
      [510,150,150,85,"SYLLABUS_TOPIC",["id PK","userId FK","subjectName","topicName"]],
      [40,315,150,85,"MOCK_EXAM",["id PK","userId FK","subject","score"]],
      [275,315,150,85,"TASK",["id PK","userId FK","title","status"]],
      [510,315,150,85,"CHAT_SESSION",["id PK","userId FK","messages"]],
    ].map(([x,y,w,h,name,attrs]) => `
      <rect class="e" x="${x}" y="${y}" width="${w}" height="${h}"/>
      <rect class="eh" x="${x}" y="${y}" width="${w}" height="22"/>
      <text class="txt" x="${x+w/2}" y="${y+15}" text-anchor="middle" font-weight="bold">${name}</text>
      ${attrs.map((a,i)=>`<text class="txt" x="${x+8}" y="${y+40+i*13}">${a}</text>`).join("")}
    `).join("")}
    ${[[350,100,115,150,"1:1"],[350,100,350,150,"1:N"],[350,100,585,150,"1:N"],[350,100,115,315,"1:N"],[350,100,350,315,"1:N"],[350,100,585,315,"1:N"]].map(([x1,y1,x2,y2,l])=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#333"/><text class="txt" x="${(x1+x2)/2}" y="${(y1+y2)/2-4}">${l}</text>`).join("")}
  </svg>
  <p class="center small"><b>Figure 8.1:</b> Entity Relationship Diagram</p>
  <h3>8.1 Cardinality Explanation</h3>
  <ul>
    <li>One User has zero or one CareerProfile.</li>
    <li>One User has many SemesterRoadmap records, one for each generated or completed semester.</li>
    <li>One User has many SyllabusTopic records because each syllabus can produce multiple topics.</li>
    <li>One User has many MockExam records to preserve historical attempts and grading output.</li>
    <li>One User has many Task, ClassSchedule, ChatSession, and ExamPrep records.</li>
  </ul>
</section>

<section class="chapter-page">
  <h2 class="chapter">9. Sequence Diagram</h2>
  ${p("The following sequence diagram describes the mock exam grading workflow. This is one of the most important flows in the project because it combines user interaction, protected API access, database ownership checks, AI evaluation, fallback logic, persistence, and analytics.")}
  <svg class="diagram" width="700" height="510" viewBox="0 0 700 510" xmlns="http://www.w3.org/2000/svg">
    <defs><marker id="arr" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#111"/></marker></defs>
    ${["Student","Exam UI","Grade API","Prisma DB","Gemini AI"].map((n,i)=>`<rect x="${35+i*135}" y="30" width="100" height="30" fill="#e9eef7" stroke="#111"/><text x="${85+i*135}" y="50" text-anchor="middle" font-family="Times New Roman" font-size="12">${n}</text><line x1="${85+i*135}" y1="60" x2="${85+i*135}" y2="470" stroke="#999" stroke-dasharray="4 3"/>`).join("")}
    ${[
      [85,105,220,"Submit answers"],
      [220,155,355,"POST /grade"],
      [355,205,490,"Fetch exam and user"],
      [490,250,355,"Exam ownership verified"],
      [355,300,625,"Send exam + answers"],
      [625,345,355,"Score + feedback"],
      [355,390,490,"Update MockExam"],
      [490,435,220,"Saved result"],
      [220,465,85,"Display report"]
    ].map(([x1,y,x2,t])=>`<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#111" marker-end="url(#arr)"/><text x="${(x1+x2)/2}" y="${y-5}" text-anchor="middle" font-family="Times New Roman" font-size="11">${t}</text>`).join("")}
  </svg>
  <p class="center small"><b>Figure 9.1:</b> Mock Exam Grading Sequence Diagram</p>
</section>

<section class="chapter-page">
  <h2 class="chapter">10. Descriptions of Input Validations and Checks</h2>
  ${p("Input validation is necessary because CampusIQ processes user-generated academic content, AI prompts, and database-changing operations. Validation is implemented at the API route layer and in selected UI forms. The most important validation objective is to ensure that all operations are performed only for the authenticated user.")}
  ${table(["Area", "Validation / Check", "Implementation", "Purpose"], validationRows)}
  ${p("In addition to explicit checks, the Prisma schema uses unique constraints for fields such as clerkId and email. Foreign key relationships and cascade delete behavior ensure relational consistency when user-owned records are removed.")}
</section>

<section class="chapter-page">
  <h2 class="chapter">11. Description of Different Reports</h2>
  ${p("CampusIQ produces several student-facing reports. These reports are not static documents; they are dashboard views computed from persisted records and AI-generated structures.")}
  ${table(["Report", "Input Data", "Output / Interpretation"], [
    ["Dashboard Overview", "User, active roadmap, pending tasks, latest mock exam, analytics summary", "Shows greeting, semester status, task count, attendance placeholder, mock readiness, and career progress."],
    ["Roadmap Timeline", "SemesterRoadmap subjects, skills, projects, weeklyBreakdown, environmentSetup", "Displays semester goals, weekly plan, projects, tools, resources, and recommendations."],
    ["Syllabus Topic Report", "SyllabusTopic subject, topic, difficulty, documentation, practice questions", "Converts raw syllabus into study cards and detailed topic pages."],
    ["Mock Exam Result Report", "MockExam examData, user answers, results, score, totalMarks", "Shows marks, feedback, correctness, and readiness insight."],
    ["Analytics Report", "Completed roadmaps and graded mock exams", "Shows chart data, performance trends, weakest metric, career readiness, and mock history."],
    ["Career Assessment Report", "Interests, skills, traits, expected salary, work-life preferences", "Generates top career recommendations and readiness score."],
  ])}
</section>

<section class="chapter-page">
  <h2 class="chapter">12. Sample Test Cases</h2>
  <h3>12.1 White Box Testing</h3>
  ${p("White box testing checks internal logic paths. For CampusIQ, important internal paths include AI fallback behavior, weighted performance computation, local grading fallback, and analytics aggregation.")}
  ${table(["Test ID", "Module", "Input / Condition", "Expected Internal Path", "Result"], whiteBoxRows)}
  <h3>12.2 Flow Graph and Cyclomatic Complexity</h3>
  ${p("For the roadmap evaluation module, the main decision points are: user authentication check, roadmapId validation, last-semester completion check, and AI next-semester generation path. The approximate cyclomatic complexity is V(G) = E - N + 2, represented practically as decision points + 1. With three major decision points, V(G) is approximately 4. Independent paths include unauthorized request, missing roadmapId, final semester completion, and normal next-semester generation.")}
  <h3>12.3 Black Box Testing</h3>
  ${p("Black box testing validates user-visible behavior without inspecting internal implementation. The following cases use equivalence class testing, boundary behavior, and decision-based scenarios.")}
  ${table(["Test ID", "Use Case", "Input / Action", "Expected Output", "Result"], blackBoxRows)}
  <h3>12.4 Gantt Chart</h3>
  <svg class="diagram" width="700" height="330" viewBox="0 0 700 330" xmlns="http://www.w3.org/2000/svg">
    <text x="350" y="25" text-anchor="middle" font-family="Times New Roman" font-size="14" font-weight="bold">Project Timeline Gantt Chart</text>
    ${["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12"].map((w,i)=>`<text x="${170+i*42}" y="55" font-size="10" text-anchor="middle">${w}</text><line x1="${170+i*42}" y1="65" x2="${170+i*42}" y2="305" stroke="#ddd"/>`).join("")}
    ${[
      ["Requirement Analysis",0,1],["UI/UX Design",1,2],["Database Design",2,2],["Authentication",3,1],["AI Integration",4,2],["Dashboard Modules",5,4],["Testing",9,2],["Documentation",10,2]
    ].map(([name,start,len],i)=>`<text x="20" y="${85+i*28}" font-size="11">${name}</text><rect x="${150+start*42}" y="${70+i*28}" width="${len*42}" height="16" fill="#5b6ee1" stroke="#25318a"/>`).join("")}
  </svg>
  <p class="center small"><b>Figure 12.1:</b> Gantt Chart Depicting Project Timeline</p>
</section>

<section class="chapter-page">
  <h2 class="chapter">13. Snapshots of Different Input and Output Screens</h2>
  ${p("This chapter includes screenshots from the implemented CampusIQ application. The screenshots demonstrate the public landing experience, authentication, dashboard cockpit, roadmap generation, syllabus hub, mock exam engine, and analytics reports.")}
  ${figures.map((f) => figure(f[0], f[1], f[2])).join("\n")}
</section>

<section class="chapter-page">
  <h2 class="chapter">14. Conclusion</h2>
  ${p("CampusIQ successfully demonstrates the design and implementation of an AI-assisted academic operating system for students. The project integrates authentication, relational data modeling, AI-based generation, dashboard workflows, syllabus analysis, exam simulation, subjective grading, timetable management, and analytics into a single coherent web application.")}
  ${p("The major achievement of the system is not only that it stores academic data, but that it converts academic data into useful actions. A syllabus becomes structured topics. A career goal becomes a semester roadmap. A mock exam becomes feedback and analytics. This transformation shows how modern AI systems can support student decision-making when combined with reliable software engineering practices.")}
  ${p("The build verification confirms that the current application compiles successfully under Next.js 16. The modular route structure, Prisma schema, and dashboard modules provide a strong base for future extension.")}
</section>

<section class="chapter-page">
  <h2 class="chapter">15. Limitation</h2>
  <ol>
    <li><b>Dependence on AI service:</b> Advanced generation and grading depend on Gemini API availability and quota limits.</li>
    <li><b>Subjective grading variability:</b> AI-based subjective answer evaluation can vary and should be treated as guidance rather than final academic marking.</li>
    <li><b>Institutional integration:</b> The current system does not directly integrate with university ERP, attendance machines, or official grade portals.</li>
    <li><b>Offline usage:</b> Most AI features require internet connectivity.</li>
    <li><b>PDF parsing accuracy:</b> Syllabus extraction quality depends on PDF clarity, formatting, and text availability.</li>
    <li><b>Manual verification required:</b> AI-generated roadmaps, references, and topic explanations should be reviewed by students or faculty before high-stakes use.</li>
  </ol>
</section>

<section class="chapter-page">
  <h2 class="chapter">16. Future Scope</h2>
  <ol>
    <li><b>University ERP integration:</b> Connect with official attendance, grades, timetable, and examination APIs where available.</li>
    <li><b>Placement intelligence:</b> Map semester subjects and projects to live job descriptions, internship roles, and skill demand trends.</li>
    <li><b>Collaborative learning:</b> Add group roadmaps, peer study rooms, and shared mock exam sessions.</li>
    <li><b>Mobile application:</b> Build native Android/iOS versions for reminders, offline notes, and quick assistant access.</li>
    <li><b>Advanced analytics:</b> Add predictive risk detection for weak subjects, attendance shortage, and exam readiness.</li>
    <li><b>Faculty mode:</b> Allow teachers to upload approved syllabus templates, question banks, and evaluation rubrics.</li>
    <li><b>Retrieval-augmented learning:</b> Connect uploaded notes, textbooks, and previous papers with a search-based AI assistant.</li>
  </ol>
</section>

<section class="chapter-page">
  <h2 class="chapter">17. Bibliography</h2>
  <ol>
    <li>Vercel, "Next.js Documentation," 2026. [Online]. Available: https://nextjs.org/docs.</li>
    <li>Meta Open Source, "React Documentation," 2026. [Online]. Available: https://react.dev/.</li>
    <li>Prisma Data, "Prisma ORM Documentation," 2026. [Online]. Available: https://www.prisma.io/docs.</li>
    <li>Clerk, "Clerk Authentication Documentation," 2026. [Online]. Available: https://clerk.com/docs.</li>
    <li>Google, "Gemini API Documentation," 2026. [Online]. Available: https://ai.google.dev/.</li>
    <li>IEEE Computer Society, "IEEE Recommended Practice for Software Requirements Specifications," IEEE Std 830-1998.</li>
    <li>R. S. Pressman and B. R. Maxim, <i>Software Engineering: A Practitioner's Approach</i>, McGraw-Hill Education.</li>
    <li>I. Sommerville, <i>Software Engineering</i>, Pearson Education.</li>
    <li>S. Russell and P. Norvig, <i>Artificial Intelligence: A Modern Approach</i>, Pearson.</li>
    <li>M. Fowler, <i>UML Distilled: A Brief Guide to the Standard Object Modeling Language</i>, Addison-Wesley.</li>
  </ol>
</section>

<section class="chapter-page">
  <h2 class="chapter">18. Plagiarism Report</h2>
  <div class="appendix-note">
    ${p("<b>Placeholder:</b> The official plagiarism report is to be obtained from the University Library through the respective supervisor, as specified in the dissertation format notice.")}
    ${p("Similarity Index: ____________________")}
    ${p("Verified by: ____________________")}
    ${p("Date: ____________________")}
  </div>
</section>

</body>
</html>`;

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(htmlPath, html, "utf8");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
  });
  await browser.close();
  console.log(pdfPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
