import { getAIResponse } from './llm';

export async function generateInitialRoadmap(targetCareer: string, skillLevel: string, availableHours: number) {

  const prompt = `You are an expert AI academic advisor. Generate a DETAILED first semester study roadmap for a student aiming to be a ${targetCareer}. 
A semester is 6 months (24 weeks). You MUST provide a comprehensive guide for each week.

CRITICAL REQUIREMENT:
Include a dedicated "environmentSetup" object. This is a step-by-step guide for the student:
1. "tools": List of specific IDEs (e.g., "Visual Studio Code with Python Extension"), GitHub, and industry-standard software for ${targetCareer}.
2. "reasons": For each tool, explain exactly HOW to set it up (e.g., "Install VS Code, then add the Prettier & ESLint extensions") and why it's used.
3. "resources": A list of links for software downloads, official documentation, and curated YouTube setup videos (specifically "How to setup VS Code for ${targetCareer}").
4. "books": At least 2-3 specific book recommendations (Title & Author) that are essential for the subjects this semester.

Provide relevant internal study material links in the form of YouTube search URLs for specific topics throughout the 24 weeks.

Respond purely in JSON format matching this schema:
{
  "subjects": ["string"],
  "skills": ["string"],
  "projects": [{"name": "string", "description": "string", "month": number, "youtubeSearchUrl": "string"}],
  "environmentSetup": {
    "tools": ["string"],
    "reasons": ["string"], 
    "resources": [{"name": "string", "url": "string", "type": "Software" | "Documentation" | "Video"}],
    "books": [{"title": "string", "author": "string", "description": "string"}]
  },
  "weeklyBreakdown": [
    {
      "week": number, 
      "month": number, 
      "focus": "string", 
      "tasks": ["string (max 3 words)"], 
      "details": "string (max 5 words)",
      "youtubeSearchUrl": "string" 
    }
  ],
  "aiSuggestions": ["string (max 10 words)"]
}
Ensure EXACTLY 24 weeks for the breakdown. KEEP ALL TEXT EXTREMELY SHORT AND CONCISE to maximize generation speed.`;

  try {
    const text = await getAIResponse(prompt);
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Generation error:", error);
    return getMockInitialRoadmap();
  }
}

export async function generateNextSemester(currentSemesterNum: number, score: number, previousSubjects: string[], previousWeaknesses: string[]) {

  const prompt = `You are an expert AI academic advisor. The student just finished semester ${currentSemesterNum} with a performance score of ${score}/100.
Generate a DETAILED curriculum for Semester ${currentSemesterNum + 1} (24 weeks / 6 months).

CRITICAL REQUIREMENT:
Include a dedicated "environmentSetup" object if new tools are introduced this semester. If no new tools are needed, list advanced tools or plugins.
1. "tools": List of specific software/tools for this level.
2. "why": Explain why these are needed for Semester ${currentSemesterNum + 1}.
3. "resources": Links for software, documentation, and setup videos.
4. "books": 2-3 advanced book recommendations for this semester's curriculum.

Include YouTube search links for the most difficult topics this semester.

Respond purely in JSON format matching this schema:
{
  "subjects": ["string"],
  "skills": ["string"],
  "projects": [{"name": "string", "description": "string", "month": number, "youtubeSearchUrl": "string"}],
  "environmentSetup": {
    "tools": ["string"],
    "reasons": ["string"],
    "resources": [{"name": "string", "url": "string", "type": "Software" | "Documentation" | "Video"}],
    "books": [{"title": "string", "author": "string", "description": "string"}]
  },
  "weeklyBreakdown": [{"week": number, "month": number, "focus": "string", "tasks": ["string (max 3 words)"], "details": "string (max 5 words)", "youtubeSearchUrl": "string"}],
  "aiSuggestions": ["string (max 10 words)"]
}
Ensure EXACTLY 24 weeks for the breakdown. KEEP ALL TEXT EXTREMELY SHORT AND CONCISE to maximize generation speed.`;

  try {
    const text = await getAIResponse(prompt);
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Generation error:", error);
    return getMockNextRoadmap(currentSemesterNum + 1);
  }
}

export async function generateExamStrategy(examName: string, topics: string, targetDate: string) {

  const prompt = `You are an Exam Strategy AI. A student has an exam "${examName}" on ${targetDate}.
Topics: ${topics}

Generate an exam preparation plan in JSON:
{
  "importantTopics": [{ "name": "string", "weight": "Very High"|"High"|"Medium", "reason": "string", "youtubeSearchUrl": "string" }],
  "revisionPlan": [{ "day": number, "focus": "string", "hours": number, "youtubeSearchUrl": "string" }],
  "mockTests": [{ "question": "string", "answer": "string" }]
}
Provide YouTube search links for every important topic and revision day focus.`;

  try {
    const text = await getAIResponse(prompt);
    return JSON.parse(text);
  } catch (error) {
    console.error("Exam AI Error:", error);
    return null;
  }
}

export async function generateMockExam(subject: string, syllabus: string) {

  const prompt = `You are an expert Professor. Generate a high-stakes 75-MARK MOCK EXAM for the subject: ${subject}.
Syllabus Context: ${syllabus}

EXAM STRUCTURE (TOTAL 75 MARKS):
1. Section A: 10 Short Answer Questions - 2 marks each (20 marks total).
2. Section B: 5 Multiple Choice Questions (MCQs) - 1 mark each (5 marks total).
3. Section C: 6 Long/Detailed Questions - 12.5 marks each. (Student must ATTEMPT ANY 4 out of these 6 to make up 50 marks total).

Respond ONLY in JSON matching this schema:
{
  "examTitle": "string",
  "subject": "string",
  "totalMarks": 75,
  "durationMinutes": 180,
  "sections": [
    {
      "sectionName": "string",
      "instructions": "string (e.g., Attempt any 4 out of 6)",
      "questions": [
        {
          "id": "string",
          "type": "MCQ" | "SHORT" | "DETAILED",
          "question": "string",
          "options": ["string"], (only if type is MCQ)
          "correctAnswer": "string", (only if type is MCQ)
          "markingCriteria": "string", (only if type is SHORT/DETAILED)
          "marks": number
        }
      ]
    }
  ]
}`;

  try {
    const text = await getAIResponse(prompt);
    return JSON.parse(text);
  } catch (error) {
    console.error("Mock Exam AI Error:", error);
    return getMockExam(subject);
  }
}

export async function gradeMockExam(examData: any, userAnswers: any) {

  const prompt = `You are an expert Professor grading an exam.
EXAM DATA: ${JSON.stringify(examData)}
USER ANSWERS: ${JSON.stringify(userAnswers)}

TASK:
1. For Section A (MCQs): Compare user answer with correct answer. 1 mark if correct, 0 otherwise.
2. For Section B (DETAILED): Evaluate the user's answer based on the marking criteria. Award marks (0 to 5) based on depth, accuracy, and logic.
3. Provide a final score.
4. Provide constructive feedback for the student.

Respond ONLY in JSON matching this schema:
{
  "score": number,
  "totalMarks": number,
  "feedback": "string",
  "questionResults": [
    {
      "id": "string",
      "marksAwarded": number,
      "feedback": "string"
    }
  ]
}`;

  try {
    const text = await getAIResponse(prompt);
    return JSON.parse(text);
  } catch (error) {
    console.error("Mock Exam Grading Error (Falling back to local grading):", error);
    return getMockGrading(examData, userAnswers);
  }
}

function getMockGrading(examData: any, userAnswers: any) {
  let totalScore = 0;
  let totalAvailableMarks = 0;
  const questionResults: any[] = [];

  examData.sections.forEach((section: any) => {
    section.questions.forEach((q: any) => {
      totalAvailableMarks += q.marks;
      const userAnswer = userAnswers[q.id];
      let marksAwarded = 0;
      let feedback = "";

      if (!userAnswer) {
        feedback = "No answer provided.";
      } else if (q.type === 'MCQ') {
        if (userAnswer === q.correctAnswer) {
          marksAwarded = q.marks;
          feedback = "Correct.";
        } else {
          feedback = `Incorrect. Correct answer: ${q.correctAnswer}`;
        }
      } else {
        // Fallback for subjective: give 60-80% marks if they wrote something substantial
        const wordCount = userAnswer.trim().split(/\s+/).length;
        if (wordCount > 50) {
          marksAwarded = Math.floor(q.marks * 0.75);
          feedback = "Good depth of explanation. Local evaluation applied.";
        } else if (wordCount > 10) {
          marksAwarded = Math.floor(q.marks * 0.5);
          feedback = "Brief explanation provided. Local evaluation applied.";
        } else {
          marksAwarded = Math.floor(q.marks * 0.2);
          feedback = "Answer is too short. Local evaluation applied.";
        }
      }

      totalScore += marksAwarded;
      questionResults.push({
        id: q.id,
        marksAwarded,
        feedback
      });
    });
  });

  return {
    score: totalScore,
    totalMarks: totalAvailableMarks,
    feedback: "Exam successfully evaluated. Focus on the detailed feedback for each question to improve your score.",
    questionResults
  };
}

function getMockExam(subject: string) {
  return {
    examTitle: `Mock Exam: ${subject}`,
    subject: subject,
    totalMarks: 35,
    durationMinutes: 60,
    sections: [
      {
        sectionName: "Section A: Objective",
        questions: [
          {
            id: "mcq_1",
            type: "MCQ",
            question: `Which of the following is a core concept of ${subject}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: "Option A",
            marks: 1
          },
          {
            id: "mcq_2",
            type: "MCQ",
            question: `In the context of ${subject}, what does 'X' typically represent?`,
            options: ["Variable", "Constant", "Function", "Module"],
            correctAnswer: "Variable",
            marks: 1
          }
        ]
      },
      {
        sectionName: "Section B: Subjective",
        questions: [
          {
            id: "det_1",
            type: "DETAILED",
            question: `Explain the fundamental principles of ${subject} and their real-world applications.`,
            markingCriteria: "Clarity, technical accuracy, and relevant examples.",
            marks: 5
          }
        ]
      }
    ]
  };
}

function getMockInitialRoadmap() {
  const weeks = Array.from({ length: 24 }, (_, i) => ({
    week: i + 1,
    month: Math.floor(i / 4) + 1,
    focus: `Academic Focus - Week ${i + 1}`,
    tasks: ["Study core concepts", "Complete practice exercises"],
    details: "Focus on building a solid foundation.",
    youtubeSearchUrl: "https://www.youtube.com/results?search_query=programming+basics"
  }));

  return {
    subjects: ["Programming Principles", "Applied Mathematics"],
    skills: ["Logic Building", "Syntax"],
    projects: [{ name: "First Milestone", description: "Month 2 project", month: 2, youtubeSearchUrl: "https://www.youtube.com/results?search_query=python+project+ideas" }],
    weeklyBreakdown: weeks,
    aiSuggestions: ["Consistency is key."]
  };
}

function getMockNextRoadmap(nextSem: number) {
  const weeks = Array.from({ length: 24 }, (_, i) => ({
    week: i + 1,
    month: Math.floor(i / 4) + 1,
    focus: `Advanced Focus - Week ${i + 1}`,
    tasks: ["Master complex topics"],
    details: "Deep dive into specialization.",
    youtubeSearchUrl: "https://www.youtube.com/results?search_query=data+structures+advanced"
  }));

  return {
    subjects: ["Data Structures & Algorithms"],
    skills: ["Optimization"],
    projects: [{ name: "Capstone", description: "Large scale app", month: 6, youtubeSearchUrl: "https://www.youtube.com/results?search_query=full+stack+project+tutorial" }],
    weeklyBreakdown: weeks,
    aiSuggestions: ["Focus on real-world application."]
  };
}
