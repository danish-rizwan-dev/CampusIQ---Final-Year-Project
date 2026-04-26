from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Table,
    TableStyle,
    Image,
    KeepTogether,
)
from reportlab.graphics.shapes import Drawing, Rect, String, Line, Circle, Ellipse


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "CampusIQ_Detailed_Dissertation.pdf"


def stylesheet():
    styles = getSampleStyleSheet()
    base = ParagraphStyle(
        "Base",
        parent=styles["Normal"],
        fontName="Times-Roman",
        fontSize=12,
        leading=18,
        alignment=TA_JUSTIFY,
        spaceAfter=8,
    )
    h1 = ParagraphStyle(
        "Chapter",
        parent=base,
        fontName="Times-Bold",
        fontSize=14,
        leading=20,
        alignment=TA_CENTER,
        spaceBefore=120,
        spaceAfter=18,
    )
    h2 = ParagraphStyle(
        "Section",
        parent=base,
        fontName="Times-Bold",
        fontSize=12,
        leading=18,
        alignment=TA_LEFT,
        spaceBefore=10,
        spaceAfter=6,
    )
    title = ParagraphStyle(
        "Title",
        parent=base,
        fontName="Times-Bold",
        fontSize=20,
        leading=26,
        alignment=TA_CENTER,
        spaceAfter=18,
    )
    center = ParagraphStyle("Center", parent=base, alignment=TA_CENTER)
    small = ParagraphStyle("Small", parent=base, fontSize=10, leading=13, alignment=TA_CENTER)
    return {"base": base, "h1": h1, "h2": h2, "title": title, "center": center, "small": small}


S = stylesheet()


def P(text, style="base"):
    return Paragraph(text, S[style])


def heading(text):
    return P(text, "h1")


def subheading(text):
    return P(text, "h2")


def bullet(items):
    story = []
    for item in items:
        story.append(P(f"&bull; {item}"))
    return story


def make_table(headers, rows, widths=None):
    data = [[Paragraph(f"<b>{h}</b>", S["base"]) for h in headers]]
    for row in rows:
        data.append([Paragraph(str(c), S["base"]) for c in row])
    tbl = Table(data, colWidths=widths, repeatRows=1)
    tbl.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, colors.black),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#e9eef7")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("FONTNAME", (0, 0), (-1, 0), "Times-Bold"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return tbl


def add_image(story, rel_path, caption, max_w=6.2 * inch, max_h=4.9 * inch):
    path = ROOT / rel_path
    with PILImage.open(path) as im:
        w, h = im.size
    scale = min(max_w / w, max_h / h)
    story.append(KeepTogether([Image(str(path), width=w * scale, height=h * scale), P(f"<b>{caption}</b>", "small")]))
    story.append(Spacer(1, 12))


def page_num(canvas, doc):
    canvas.saveState()
    canvas.setFont("Times-Roman", 10)
    canvas.drawCentredString(A4[0] / 2, 0.45 * inch, str(doc.page))
    canvas.restoreState()


def use_case_diagram():
    d = Drawing(470, 330)
    d.add(Rect(90, 25, 290, 285, strokeColor=colors.black, fillColor=colors.HexColor("#f7f9ff")))
    d.add(String(235, 292, "CampusIQ System", textAnchor="middle", fontName="Times-Bold", fontSize=12))
    d.add(Circle(45, 220, 13, strokeColor=colors.black, fillColor=None))
    d.add(Line(45, 207, 45, 165))
    d.add(Line(20, 190, 70, 190))
    d.add(Line(45, 165, 25, 135))
    d.add(Line(45, 165, 65, 135))
    d.add(String(45, 118, "Student", textAnchor="middle", fontSize=10))
    d.add(Circle(425, 210, 13, strokeColor=colors.black, fillColor=None))
    d.add(Line(425, 197, 425, 155))
    d.add(Line(400, 180, 450, 180))
    d.add(Line(425, 155, 405, 125))
    d.add(Line(425, 155, 445, 125))
    d.add(String(425, 108, "AI Core", textAnchor="middle", fontSize=10))
    cases = [
        (180, 245, "Authenticate"),
        (290, 245, "Sync Profile"),
        (180, 200, "Generate Roadmap"),
        (290, 200, "Analyze Syllabus"),
        (180, 155, "Take Mock Exam"),
        (290, 155, "Grade Answers"),
        (180, 110, "Manage Tasks"),
        (290, 110, "View Analytics"),
        (235, 65, "Ask Assistant"),
    ]
    for x, y, label in cases:
        d.add(Ellipse(x - 58, y - 17, x + 58, y + 17, strokeColor=colors.black, fillColor=colors.white))
        d.add(String(x, y - 4, label, textAnchor="middle", fontSize=8.5))
    for x2, y2 in [(122, 245), (122, 200), (122, 155), (122, 110), (177, 65)]:
        d.add(Line(70, 190, x2, y2, strokeColor=colors.grey))
    for x2, y2 in [(348, 200), (348, 155), (293, 65)]:
        d.add(Line(400, 180, x2, y2, strokeColor=colors.grey))
    return d


def class_diagram():
    d = Drawing(480, 410)
    boxes = [
        (190, 310, 110, 70, "User", ["id", "clerkId", "email"]),
        (25, 205, 125, 80, "CareerProfile", ["selectedCareer", "readinessScore"]),
        (180, 190, 140, 95, "SemesterRoadmap", ["semesterNumber", "status", "subjects", "weeklyBreakdown"]),
        (350, 205, 125, 80, "SyllabusTopic", ["subjectName", "topicName", "difficulty"]),
        (25, 65, 125, 80, "MockExam", ["examData", "results", "score"]),
        (180, 65, 125, 80, "Task", ["title", "priority", "status"]),
        (350, 65, 125, 80, "ChatSession", ["topicContext", "messages"]),
    ]
    for x, y, w, h, name, attrs in boxes:
        d.add(Rect(x, y, w, h, strokeColor=colors.black, fillColor=colors.white))
        d.add(Rect(x, y + h - 18, w, 18, strokeColor=colors.black, fillColor=colors.HexColor("#e9eef7")))
        d.add(String(x + w / 2, y + h - 13, name, textAnchor="middle", fontName="Times-Bold", fontSize=9))
        for i, attr in enumerate(attrs):
            d.add(String(x + 5, y + h - 33 - i * 12, "- " + attr, fontSize=8))
    for x2, y2 in [(87, 285), (250, 285), (412, 285), (87, 145), (242, 145), (412, 145)]:
        d.add(Line(245, 310, x2, y2, strokeColor=colors.grey))
    return d


def erd_diagram():
    d = Drawing(480, 320)
    entities = [
        (190, 235, "USER", ["id PK", "clerkId", "email"]),
        (20, 135, "CAREER_PROFILE", ["id PK", "userId FK"]),
        (180, 125, "ROADMAP", ["id PK", "userId FK"]),
        (340, 135, "SYLLABUS_TOPIC", ["id PK", "userId FK"]),
        (20, 30, "MOCK_EXAM", ["id PK", "userId FK"]),
        (180, 30, "TASK", ["id PK", "userId FK"]),
        (340, 30, "CHAT_SESSION", ["id PK", "userId FK"]),
    ]
    for x, y, name, attrs in entities:
        d.add(Rect(x, y, 120, 58, strokeColor=colors.black, fillColor=colors.white))
        d.add(Rect(x, y + 40, 120, 18, strokeColor=colors.black, fillColor=colors.HexColor("#e9eef7")))
        d.add(String(x + 60, y + 45, name, textAnchor="middle", fontName="Times-Bold", fontSize=8))
        for i, attr in enumerate(attrs):
            d.add(String(x + 5, y + 28 - i * 12, attr, fontSize=8))
    for x2, y2, label in [(80, 193, "1:1"), (240, 183, "1:N"), (400, 193, "1:N"), (80, 88, "1:N"), (240, 88, "1:N"), (400, 88, "1:N")]:
        d.add(Line(250, 235, x2, y2, strokeColor=colors.grey))
        d.add(String((250 + x2) / 2, (235 + y2) / 2, label, fontSize=8))
    return d


def sequence_diagram():
    d = Drawing(480, 300)
    actors = ["Student", "Exam UI", "Grade API", "Prisma DB", "Gemini AI"]
    xs = [40, 140, 240, 340, 440]
    for x, a in zip(xs, actors):
        d.add(Rect(x - 35, 260, 70, 22, strokeColor=colors.black, fillColor=colors.HexColor("#e9eef7")))
        d.add(String(x, 267, a, textAnchor="middle", fontSize=8))
        d.add(Line(x, 260, x, 20, strokeColor=colors.lightgrey))
    steps = [
        (40, 140, 230, "Submit answers"),
        (140, 240, 200, "POST /grade"),
        (240, 340, 170, "Fetch exam"),
        (340, 240, 140, "Verified"),
        (240, 440, 110, "Evaluate"),
        (440, 240, 80, "Feedback"),
        (240, 340, 50, "Save result"),
        (140, 40, 25, "Show report"),
    ]
    for x1, x2, y, label in steps:
        d.add(Line(x1, y, x2, y, strokeColor=colors.black))
        d.add(String((x1 + x2) / 2, y + 5, label, textAnchor="middle", fontSize=7.5))
    return d


def gantt_chart():
    d = Drawing(480, 220)
    weeks = [f"W{i}" for i in range(1, 13)]
    for i, w in enumerate(weeks):
        x = 145 + i * 25
        d.add(String(x, 190, w, textAnchor="middle", fontSize=7))
        d.add(Line(x, 30, x, 180, strokeColor=colors.lightgrey))
    tasks = [
        ("Requirement Analysis", 0, 1),
        ("UI/UX Design", 1, 2),
        ("Database Design", 2, 2),
        ("Authentication", 3, 1),
        ("AI Integration", 4, 2),
        ("Dashboard Modules", 5, 4),
        ("Testing", 9, 2),
        ("Documentation", 10, 2),
    ]
    for i, (name, start, length) in enumerate(tasks):
        y = 160 - i * 18
        d.add(String(10, y + 3, name, fontSize=8))
        d.add(Rect(130 + start * 25, y, length * 25, 10, fillColor=colors.HexColor("#5b6ee1"), strokeColor=colors.HexColor("#25318a")))
    return d


def build():
    story = []

    story += [
        Spacer(1, 25),
        P("Bachelor of Technology (Computer Science & Engineering)", "center"),
        P("Final Semester Dissertation / Major Project Report", "center"),
    ]
    add_image(story, "public/campusiq_banner.jpg", "", max_w=5.8 * inch, max_h=1.7 * inch)
    story += [
        P("CampusIQ: The AI Student Operating System", "title"),
        P("Submitted in partial fulfillment of the requirements for the award of the degree of", "center"),
        P("<b>Bachelor of Technology (Computer Science & Engineering)</b>", "center"),
        Spacer(1, 18),
        P("Submitted by", "center"),
        P("<b>Danish Rizwan</b><br/>Enrollment Number: ____________________", "center"),
        Spacer(1, 18),
        P("Under the supervision of", "center"),
        P("<b>Supervisor Name: ____________________</b>", "center"),
        Spacer(1, 18),
        P("Department of Computer Science & Engineering<br/>School of Engineering Sciences & Technology<br/>Jamia Hamdard, New Delhi", "center"),
        P("<b>Academic Year: 2025-2026</b>", "center"),
        PageBreak(),
    ]

    story += [
        P("<b>Certificate</b>", "title"),
        P("This is to certify that the Dissertation / Major Project Report entitled <b>CampusIQ: The AI Student Operating System</b> is a bonafide record of the project work carried out by <b>Danish Rizwan</b>, Enrollment Number ____________________, in partial fulfillment of the requirements for the award of the degree of Bachelor of Technology (Computer Science & Engineering) at the Department of Computer Science & Engineering, School of Engineering Sciences & Technology, Jamia Hamdard, New Delhi."),
        P("The work reported in this dissertation has been carried out under my supervision and guidance. To the best of my knowledge, the work is original and has not been submitted to any other university or institution for the award of any degree, diploma, associateship, fellowship, or similar title."),
        Spacer(1, 80),
        make_table(["Signature of Supervisor", "Department Office Seal"], [["Name: ____________________<br/>Date: ____________________", "Department of CSE<br/>Jamia Hamdard, New Delhi"]], [3 * inch, 3 * inch]),
        PageBreak(),
        P("<b>Declaration</b>", "title"),
        P("I, <b>Danish Rizwan</b>, a student of <b>Bachelor of Technology (Computer Science & Engineering)</b>, Enrollment Number ____________________, hereby declare that the dissertation entitled <b>CampusIQ: The AI Student Operating System</b>, which is being submitted by me to the Department of Computer Science & Engineering, School of Engineering Sciences & Technology, Jamia Hamdard, New Delhi, in partial fulfillment of the requirement for the award of the degree of Bachelor of Technology (Computer Science & Engineering), is my original work."),
        P("I further declare that this work has not been submitted anywhere else for the award of any Degree, Diploma, Associateship, Fellowship, or other similar title or recognition. All references, tools, APIs, frameworks, and supporting materials used in the project have been acknowledged appropriately in the bibliography."),
        Spacer(1, 80),
        make_table(["Signature and Name of Applicant", "Date and Place"], [["Danish Rizwan", "Date: 26 April 2026<br/>Place: New Delhi"]], [3 * inch, 3 * inch]),
        PageBreak(),
        P("<b>Acknowledgements</b>", "title"),
        P("I express my sincere gratitude to my project supervisor for continuous guidance, valuable feedback, and encouragement throughout the planning, design, development, testing, and documentation of this project. Their advice helped shape CampusIQ from an initial idea into a complete full-stack academic software system."),
        P("I am thankful to the Department of Computer Science & Engineering, School of Engineering Sciences & Technology, Jamia Hamdard, New Delhi, for providing the academic environment and technical foundation required to complete this work. I also acknowledge the documentation and developer communities around Next.js, React, Prisma, Clerk, PostgreSQL, and Google Gemini, whose resources were helpful during implementation."),
        P("Finally, I thank my family, friends, and peers for their support, patience, and motivation during the development of this final year project."),
        Spacer(1, 80),
        make_table(["Signature", "Date and Place"], [["Danish Rizwan", "Date: 26 April 2026<br/>Place: New Delhi"]], [3 * inch, 3 * inch]),
        PageBreak(),
    ]

    story += [
        P("<b>List of Abbreviations</b>", "title"),
        make_table(["Abbreviation", "Full Form"], [
            ["AI", "Artificial Intelligence"], ["API", "Application Programming Interface"], ["B.Tech", "Bachelor of Technology"],
            ["CSE", "Computer Science & Engineering"], ["DBMS", "Database Management System"], ["ERD", "Entity Relationship Diagram"],
            ["HTTP", "Hypertext Transfer Protocol"], ["IEEE", "Institute of Electrical and Electronics Engineers"], ["JSON", "JavaScript Object Notation"],
            ["LLM", "Large Language Model"], ["ORM", "Object Relational Mapping"], ["PDF", "Portable Document Format"],
            ["SRS", "Software Requirements Specification"], ["UI", "User Interface"], ["UML", "Unified Modeling Language"],
        ], [2 * inch, 4 * inch]),
        PageBreak(),
        P("<b>List of Tables</b>", "title"),
        make_table(["Table No.", "Caption", "Page No."], [
            ["Table 5.1", "Functional Requirements", "12"], ["Table 5.2", "Non-functional Requirements", "13"],
            ["Table 5.3", "Use Case Specifications", "15"], ["Table 6.1", "Cost and Effort Estimation", "20"],
            ["Table 10.1", "Input Validations and Checks", "27"], ["Table 11.1", "Description of Reports", "29"],
            ["Table 12.1", "White Box Test Cases", "31"], ["Table 12.2", "Black Box Test Cases", "32"],
        ], [1.2 * inch, 3.7 * inch, 1.1 * inch]),
        Spacer(1, 20),
        P("<b>List of Figures</b>", "title"),
        make_table(["Figure No.", "Caption", "Page No."], [
            ["Figure 5.1", "UML Use Case Diagram", "14"], ["Figure 7.1", "UML Class Diagram", "22"], ["Figure 8.1", "Entity Relationship Diagram", "24"], ["Figure 9.1", "Mock Exam Grading Sequence Diagram", "26"], ["Figure 12.1", "Gantt Chart", "33"], ["Figure 13.1-13.14", "Application screenshots", "35 onwards"],
        ], [1.4 * inch, 3.5 * inch, 1.1 * inch]),
        PageBreak(),
    ]

    chapters = [
        ("1. Title", [
            "The title of the dissertation is <b>CampusIQ: The AI Student Operating System</b>. CampusIQ is a full-stack, AI-assisted academic management platform designed for students who need one unified environment for career planning, semester roadmaps, syllabus intelligence, examination preparation, mock assessment, class scheduling, task management, and performance analytics.",
            "The project has been developed as a modern web application using Next.js 16, React 19, Prisma, PostgreSQL, Clerk authentication, Google Gemini AI, Zustand, Recharts, and a responsive custom CSS interface. It demonstrates how artificial intelligence can be integrated into academic workflows to reduce manual planning effort and provide personalized guidance.",
        ]),
        ("2. Objective", [
            "The objective of CampusIQ is to convert a fragmented student workflow into a unified, intelligent, and measurable academic operating system. Students commonly use separate tools for timetables, notes, syllabus tracking, exam preparation, career research, and performance review. This separation creates duplicated effort and weak feedback loops.",
            "The primary objectives are: secure onboarding, adaptive semester roadmap generation, syllabus analysis, exam preparation planning, 75-mark mock exam generation, AI-assisted grading, task and schedule management, analytics, and an AI study assistant.",
            "The scope includes a complete student-facing web platform, protected dashboard routes, API route handlers, database persistence, AI generation endpoints, analytics aggregation, and a responsive user interface. The system complements institutional ERP systems by providing a student-owned planning and preparation layer.",
        ]),
        ("3. Introduction", [
            "Education technology has evolved from static information systems to adaptive digital environments. Traditional academic tools often record information but rarely interpret it. A timetable application may store class timings, a note application may store text, and a syllabus PDF may list topics, but these tools usually do not connect the information to career goals, examination readiness, or learning progress.",
            "CampusIQ is built around the idea that a student needs an academic command center. The system connects four major data flows: the student's identity and profile, the curriculum or syllabus, semester-wise planning, and performance evidence from tasks, mocks, and evaluations. Once these data flows exist together, AI can help generate roadmaps, explain topics, recommend preparation plans, and evaluate answers.",
            "The application uses Next.js App Router for routing and server-side API handlers. Clerk provides authentication. Prisma with PostgreSQL stores structured data. Google Gemini is used for natural language reasoning and JSON generation. The interface follows a dashboard model with Roadmap, Career, Syllabus, Assistant, Exam Prep, Mock Exam, Timetable, Analytics, and Settings modules.",
        ]),
        ("4. Problem Statement", [
            "Students in technical courses face a combination of academic, organizational, and career-planning challenges. Their learning resources are scattered across PDF syllabi, classroom notes, online tutorials, exam papers, placement advice, spreadsheets, and messaging groups.",
            "The problem is not merely the absence of information. In most cases, students have too much unstructured information. The real challenge is converting that information into a personalized plan and then measuring progress against it.",
            "CampusIQ addresses the lack of an integrated, AI-assisted academic platform that can transform syllabus and performance data into personalized roadmaps, exam simulations, study assistance, and analytics for students in computer science and related programs.",
        ]),
    ]
    for title, paras in chapters:
        story.append(heading(title))
        for para in paras:
            story.append(P(para))
        story.append(PageBreak())

    story.append(heading("5. SRS in IEEE Format"))
    story.append(subheading("5.1 Purpose"))
    story.append(P("This Software Requirements Specification describes the functional and non-functional requirements for CampusIQ. It defines the behavior expected from the system, the major actors, use cases, data interactions, and quality constraints."))
    story.append(subheading("5.2 Functional Requirements"))
    story.append(make_table(["Req. ID", "Requirement", "Description", "Priority"], [
        ["FR-01", "Authentication", "Allow students to sign up, sign in, and sign out securely.", "High"],
        ["FR-02", "User Sync", "Synchronize authenticated Clerk users into the local database.", "High"],
        ["FR-03", "Roadmap Generation", "Generate an initial semester roadmap using target career, course, duration, skill level, and study hours.", "High"],
        ["FR-04", "Roadmap Evaluation", "Evaluate semester performance and generate the next semester roadmap.", "High"],
        ["FR-05", "Syllabus Analysis", "Analyze syllabus text/PDF-derived content and generate structured study topics.", "High"],
        ["FR-06", "Mock Exam", "Generate, store, display, grade, and retake mock exams.", "High"],
        ["FR-07", "AI Assistant", "Provide a study assistant that answers academic queries.", "Medium"],
        ["FR-08", "Timetable and Tasks", "Allow class schedule and task management.", "Medium"],
        ["FR-09", "Analytics", "Aggregate roadmap and mock exam data into visual reports.", "High"],
    ], [0.8 * inch, 1.3 * inch, 3.3 * inch, 0.7 * inch]))
    story.append(subheading("5.3 Non-functional Requirements"))
    story.append(make_table(["Req. ID", "Category", "Requirement"], [
        ["NFR-01", "Security", "Dashboard and API routes must be protected by authenticated sessions."],
        ["NFR-02", "Usability", "The interface must be responsive and usable on desktop and mobile devices."],
        ["NFR-03", "Reliability", "The system should provide fallback responses for selected AI failures."],
        ["NFR-04", "Maintainability", "Code should follow modular Next.js route and component structure."],
        ["NFR-05", "Performance", "Dashboard pages should fetch only necessary internal API data."],
        ["NFR-06", "Scalability", "Database models should support multiple users and one-to-many academic records."],
    ], [0.9 * inch, 1.2 * inch, 3.9 * inch]))
    story.append(PageBreak())
    story.append(subheading("5.4 UML Use Case Diagram"))
    story.append(use_case_diagram())
    story.append(P("<b>Figure 5.1:</b> UML Use Case Diagram", "small"))
    story.append(subheading("5.5 Use Case Specifications"))
    story.append(make_table(["Use Case", "Actor", "Pre-condition", "Basic Path", "Post-condition"], [
        ["Register and authenticate", "Student", "Valid email or social login", "Sign up/sign in through Clerk and sync user profile.", "Dashboard session is available."],
        ["Generate roadmap", "Student, AI Core", "Authenticated user enters course/career data.", "Gemini creates subjects, skills, projects, setup, and 24-week plan.", "Semester 1 roadmap becomes ACTIVE."],
        ["Evaluate semester", "Student, AI Core", "Active roadmap exists.", "Submit performance metrics; system calculates weighted score and generates next semester.", "Current semester COMPLETED and next semester ACTIVE."],
        ["Analyze syllabus", "Student, AI Core", "Text or PDF syllabus is available.", "System extracts topics, difficulty, documentation, resources, and questions.", "Syllabus topics are saved."],
        ["Take mock exam", "Student, AI Core", "Subject and syllabus context exist.", "Generate exam, answer questions, submit for grading.", "Score and feedback are stored."],
        ["Ask assistant", "Student, AI Core", "Authenticated user.", "User submits topic/question and receives short or detailed answer.", "Chat history is updated."],
    ], [1.0 * inch, 1.0 * inch, 1.25 * inch, 1.7 * inch, 1.1 * inch]))
    story.append(PageBreak())

    story.append(heading("6. Cost/Effort Estimation"))
    story.append(P("Cost and effort estimation is prepared for a student-led final year software project. The development was performed by one full-stack developer using open-source frameworks and free or student-accessible cloud services. Monetary cost is low, while effort cost is measured in analysis, design, implementation, testing, and documentation time."))
    story.append(make_table(["Activity", "Estimated Duration", "Effort Description", "Output"], [
        ["Requirement analysis", "1 week", "Study academic workflow, identify modules, prepare feature list.", "Problem definition and SRS"],
        ["UI/UX design", "1.5 weeks", "Design landing page, dashboard shell, cards, forms, and themes.", "Responsive interface"],
        ["Database design", "1 week", "Design Prisma models for users, roadmaps, tasks, syllabus, exams, chats, and analytics.", "Database schema"],
        ["Authentication setup", "0.5 week", "Integrate Clerk, protected proxy, login, signup, user sync.", "Secure access flow"],
        ["AI integration", "2 weeks", "Prepare Gemini prompts, JSON schemas, fallbacks, roadmap/exam/syllabus/chat logic.", "AI service layer"],
        ["Dashboard modules", "3 weeks", "Build roadmap, syllabus, assistant, exam, mock exam, timetable, analytics pages.", "Functional modules"],
        ["Testing and debugging", "1.5 weeks", "Run build checks, validate API behavior, test UI flows, handle errors.", "Stable release"],
        ["Documentation", "1 week", "Prepare report, diagrams, screenshots, testing tables, bibliography.", "Dissertation"],
    ], [1.25 * inch, 0.9 * inch, 2.75 * inch, 1.1 * inch]))
    story.append(PageBreak())

    story.append(heading("7. UML Class Diagram"))
    story.append(P("The UML class model is derived from the Prisma schema and the application modules. The main aggregate root is User. A User can have one CareerProfile and many SemesterRoadmap, Task, ClassSchedule, ChatSession, ExamPrep, SyllabusTopic, and MockExam records. JSON fields are used where AI-generated structures are flexible."))
    story.append(class_diagram())
    story.append(P("<b>Figure 7.1:</b> UML Class Diagram", "small"))
    story.append(PageBreak())

    story.append(heading("8. Entity Relationship Diagram"))
    story.append(P("The database is implemented using PostgreSQL and Prisma. User is the central entity, and most academic records depend on it through foreign key relationships with cascade delete."))
    story.append(erd_diagram())
    story.append(P("<b>Figure 8.1:</b> Entity Relationship Diagram", "small"))
    story += bullet([
        "One User has zero or one CareerProfile.",
        "One User has many SemesterRoadmap records, one for each generated or completed semester.",
        "One User has many SyllabusTopic records because each syllabus can produce multiple topics.",
        "One User has many MockExam records to preserve attempts and grading output.",
        "One User has many Task, ClassSchedule, ChatSession, and ExamPrep records.",
    ])
    story.append(PageBreak())

    story.append(heading("9. Activity / Sequence Diagram"))
    story.append(P("The following sequence diagram describes the mock exam grading workflow. This flow combines user interaction, protected API access, database ownership checks, AI evaluation, fallback logic, persistence, and analytics."))
    story.append(sequence_diagram())
    story.append(P("<b>Figure 9.1:</b> Mock Exam Grading Sequence Diagram", "small"))
    story.append(PageBreak())

    story.append(heading("10. Descriptions of Different Input Validations and Checks"))
    story.append(P("Input validation is necessary because CampusIQ processes user-generated academic content, AI prompts, and database-changing operations. The most important validation objective is to ensure that all operations are performed only for the authenticated user."))
    story.append(make_table(["Area", "Validation / Check", "Implementation", "Purpose"], [
        ["Authentication", "Clerk session must exist.", "src/proxy.ts and route handlers call auth().", "Prevents anonymous access."],
        ["User sync", "Clerk user must have id and email.", "/api/user/sync validates clerkId and email.", "Avoids orphan records."],
        ["Roadmap generation", "Course, duration, career, skill level, and hours required.", "/api/roadmap/generate rejects incomplete requests.", "Ensures useful AI prompts."],
        ["Duplicate roadmap", "Existing roadmap cannot be overwritten unless overwrite is true.", "Transaction checks existing roadmap.", "Protects progress."],
        ["Syllabus analysis", "Text content is required.", "/api/syllabus/analyze returns 400 for missing text.", "Prevents empty AI calls."],
        ["Mock grading", "Exam must belong to current user and not already be completed.", "/api/exam/mock/[id]/grade checks ownership/status.", "Prevents duplicate grading."],
        ["Tasks/schedule", "Records filtered by current user id.", "/api/tasks and /api/schedule query by userId.", "Maintains tenant isolation."],
    ], [1.1 * inch, 1.7 * inch, 1.7 * inch, 1.5 * inch]))
    story.append(PageBreak())

    story.append(heading("11. Description of Different Reports"))
    story.append(P("CampusIQ produces several dashboard reports computed from persisted records and AI-generated structures."))
    story.append(make_table(["Report", "Input Data", "Output / Interpretation"], [
        ["Dashboard Overview", "User, active roadmap, tasks, latest mock exam, analytics summary", "Greeting, semester status, task count, mock readiness, and career progress."],
        ["Roadmap Timeline", "SemesterRoadmap subjects, skills, projects, weeklyBreakdown, environmentSetup", "Semester goals, weekly plan, projects, tools, resources, and recommendations."],
        ["Syllabus Topic Report", "SyllabusTopic subject, topic, difficulty, documentation, practice questions", "Study cards and detailed topic pages."],
        ["Mock Exam Result Report", "MockExam examData, answers, results, score, totalMarks", "Marks, feedback, correctness, and readiness insight."],
        ["Analytics Report", "Completed roadmaps and graded mock exams", "Charts, trends, weakest metric, career readiness, and mock history."],
        ["Career Assessment Report", "Interests, skills, traits, salary and work-life preferences", "Career recommendations and readiness score."],
    ], [1.45 * inch, 2.2 * inch, 2.35 * inch]))
    story.append(PageBreak())

    story.append(heading("12. Sample Test Cases"))
    story.append(subheading("12.1 White Box Testing"))
    story.append(make_table(["Test ID", "Module", "Input / Condition", "Expected Internal Path", "Result"], [
        ["WB-01", "Roadmap fallback", "Gemini API unavailable or JSON parse fails", "generateInitialRoadmap catches error and returns local 24-week mock roadmap", "PASS"],
        ["WB-02", "Performance score", "80,70,75,90,60", "Weighted score = 76.25", "PASS"],
        ["WB-03", "Mock grading fallback", "Subjective answer above 50 words", "Local evaluator awards approximate 75 percent marks", "PASS"],
        ["WB-04", "Analytics", "No semesters and no mocks", "Endpoint returns hasData=false and setup guidance", "PASS"],
    ], [0.75 * inch, 1.2 * inch, 1.45 * inch, 2.0 * inch, 0.55 * inch]))
    story.append(P("For the roadmap evaluation module, major decision points are authentication check, roadmapId validation, final semester check, and normal next-semester generation. The approximate cyclomatic complexity is decision points + 1, which gives V(G) = 4. Independent paths include unauthorized request, missing roadmapId, final semester completion, and normal next-semester generation."))
    story.append(subheading("12.2 Black Box Testing"))
    story.append(make_table(["Test ID", "Use Case", "Input / Action", "Expected Output", "Result"], [
        ["BB-01", "Login access control", "Unauthenticated user opens /dashboard", "User is protected by Clerk", "PASS"],
        ["BB-02", "Create roadmap", "Submit without targetCareer", "API returns 400 Missing fields", "PASS"],
        ["BB-03", "Theme toggle", "Click theme control", "App switches light/dark variables", "PASS"],
        ["BB-04", "Generate mock exam", "Select subject and generate", "Pending mock exam record appears", "PASS"],
        ["BB-05", "Delete task", "Click delete on existing task", "Task disappears", "PASS"],
        ["BB-06", "Analyze syllabus", "Paste syllabus and submit", "Structured topics appear", "PASS"],
    ], [0.75 * inch, 1.2 * inch, 1.45 * inch, 2.0 * inch, 0.55 * inch]))
    story.append(PageBreak())
    story.append(subheading("12.3 Gantt Chart"))
    story.append(gantt_chart())
    story.append(P("<b>Figure 12.1:</b> Gantt Chart Depicting Project Timeline", "small"))
    story.append(PageBreak())

    story.append(heading("13. Snapshots of Different Input and Output Screens"))
    story.append(P("This chapter includes screenshots from the implemented CampusIQ application. The screenshots demonstrate the public landing experience, authentication, dashboard cockpit, roadmap generation, syllabus hub, mock exam engine, and analytics reports."))
    screenshots = [
        ("public/screenshots/landing_page_1777139480870.png", "Figure 13.1: CampusIQ landing page in dark theme"),
        ("public/screenshots/landing_page_light_1777139630164.png", "Figure 13.2: CampusIQ landing page in light theme"),
        ("public/screenshots/signin_page_1777139500217.png", "Figure 13.3: Secure sign-in page"),
        ("public/screenshots/dashboard_main_1777139732647.png", "Figure 13.4: Dashboard cockpit overview"),
        ("public/screenshots/dashboard_stats_bar_1777140143425.png", "Figure 13.5: Dashboard telemetry stats bar"),
        ("public/screenshots/roadmap_overview_1777140676189.png", "Figure 13.6: Roadmap overview"),
        ("public/screenshots/roadmap_detailed_timeline_1777140705086.png", "Figure 13.7: Roadmap detailed timeline"),
        ("public/screenshots/roadmap_active_semester_1777140733123.png", "Figure 13.8: Active semester roadmap"),
        ("public/screenshots/syllabus_hub_1777139747802.png", "Figure 13.9: Syllabus intelligence hub"),
        ("public/screenshots/mock_exam_hub_1777139763004.png", "Figure 13.10: Mock exam hub"),
        ("public/screenshots/mock_exam_question_box_detail_1777140357782.png", "Figure 13.11: Mock exam question detail screen"),
        ("public/screenshots/analytics_page_1777139777716.png", "Figure 13.12: Analytics cockpit"),
        ("public/screenshots/subject_breakdown_chart_1777140175215.png", "Figure 13.13: Subject breakdown chart"),
        ("public/screenshots/quick_generate_grid_1777140202532.png", "Figure 13.14: Quick generate grid"),
    ]
    for rel, cap in screenshots:
        add_image(story, rel, cap)

    story.append(heading("14. Conclusion"))
    story.append(P("CampusIQ successfully demonstrates the design and implementation of an AI-assisted academic operating system for students. The project integrates authentication, relational data modeling, AI-based generation, dashboard workflows, syllabus analysis, exam simulation, subjective grading, timetable management, and analytics into a single coherent web application."))
    story.append(P("The major achievement of the system is not only that it stores academic data, but that it converts academic data into useful actions. A syllabus becomes structured topics. A career goal becomes a semester roadmap. A mock exam becomes feedback and analytics. This transformation shows how modern AI systems can support student decision-making when combined with reliable software engineering practices."))
    story.append(PageBreak())

    story.append(heading("15. Limitation"))
    story += bullet([
        "Advanced generation and grading depend on Gemini API availability and quota limits.",
        "AI-based subjective answer evaluation can vary and should be treated as guidance rather than final academic marking.",
        "The current system does not directly integrate with university ERP, attendance machines, or official grade portals.",
        "Most AI features require internet connectivity.",
        "Syllabus extraction quality depends on PDF clarity, formatting, and text availability.",
        "AI-generated roadmaps, references, and topic explanations should be reviewed before high-stakes use.",
    ])
    story.append(PageBreak())

    story.append(heading("16. Future Scope"))
    story += bullet([
        "University ERP integration for official attendance, grades, timetables, and examination data.",
        "Placement intelligence that maps semester subjects and projects to job descriptions and internship roles.",
        "Collaborative learning features such as group roadmaps and shared mock exam sessions.",
        "Native Android and iOS applications for reminders, offline notes, and quick assistant access.",
        "Advanced analytics for predictive risk detection in weak subjects, attendance shortage, and exam readiness.",
        "Faculty mode for approved syllabus templates, question banks, and evaluation rubrics.",
        "Retrieval-augmented learning using uploaded notes, textbooks, and previous papers.",
    ])
    story.append(PageBreak())

    story.append(heading("17. Bibliography"))
    for item in [
        'Vercel, "Next.js Documentation," 2026. [Online]. Available: https://nextjs.org/docs.',
        'Meta Open Source, "React Documentation," 2026. [Online]. Available: https://react.dev/.',
        'Prisma Data, "Prisma ORM Documentation," 2026. [Online]. Available: https://www.prisma.io/docs.',
        'Clerk, "Clerk Authentication Documentation," 2026. [Online]. Available: https://clerk.com/docs.',
        'Google, "Gemini API Documentation," 2026. [Online]. Available: https://ai.google.dev/.',
        'IEEE Computer Society, "IEEE Recommended Practice for Software Requirements Specifications," IEEE Std 830-1998.',
        "R. S. Pressman and B. R. Maxim, Software Engineering: A Practitioner's Approach, McGraw-Hill Education.",
        "I. Sommerville, Software Engineering, Pearson Education.",
        "S. Russell and P. Norvig, Artificial Intelligence: A Modern Approach, Pearson.",
        "M. Fowler, UML Distilled: A Brief Guide to the Standard Object Modeling Language, Addison-Wesley.",
    ]:
        story.append(P(item))
    story.append(PageBreak())

    story.append(heading("18. Plagiarism Report"))
    story.append(P("<b>Placeholder:</b> The official plagiarism report is to be obtained from the University Library through the respective supervisor, as specified in the dissertation format notice."))
    story.append(P("Similarity Index: ____________________"))
    story.append(P("Verified by: ____________________"))
    story.append(P("Date: ____________________"))

    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        rightMargin=inch,
        leftMargin=inch,
        topMargin=inch,
        bottomMargin=inch,
        title="CampusIQ Detailed Dissertation",
        author="Danish Rizwan",
    )
    doc.build(story, onFirstPage=page_num, onLaterPages=page_num)
    print(OUT)


if __name__ == "__main__":
    build()
