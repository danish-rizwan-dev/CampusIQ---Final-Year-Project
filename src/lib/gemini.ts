import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

// Optimized for your Pro Tier access
const model = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.3
  }
});

export async function generateInitialRoadmap(targetCareer: string, skillLevel: string, availableHours: number) {
  if (!apiKey) {
    return getMockInitialRoadmap();
  }

  const prompt = `You are an expert AI academic advisor. Generate a DETAILED first semester study roadmap for a student aiming to be a ${targetCareer}. 
A semester is 6 months (24 weeks). You MUST provide a comprehensive guide for each week.

CRITICAL REQUIREMENT:
Include a dedicated "environmentSetup" object. This includes:
1. "tools": List of specific IDEs (e.g., VS Code), GitHub, and industry-standard software for ${targetCareer}.
2. "why": For each tool, explain exactly WHY it is necessary for this career.
3. "resources": A list of links for software downloads, official documentation, and curated YouTube setup videos.
4. "books": At least 2-3 book recommendations specifically for the subjects of this semester or the career path.

Provide relevant internal study material links in the form of YouTube search URLs for specific topics throughout the 24 weeks.

Respond purely in JSON format matching this schema:
{
  "subjects": ["string"],
  "skills": ["string"],
  "projects": [{"name": "string", "description": "string", "month": number, "youtubeSearchUrl": "string"}],
  "environmentSetup": {
    "tools": ["string"],
    "reasons": ["string"], // Detailed "why" for each tool
    "resources": [{"name": "string", "url": "string", "type": "Software" | "Documentation" | "Video"}],
    "books": [{"title": "string", "author": "string", "description": "string"}]
  },
  "weeklyBreakdown": [
    {
      "week": number, 
      "month": number, 
      "focus": "string", 
      "tasks": ["string"], 
      "details": "string",
      "youtubeSearchUrl": "string" 
    }
  ],
  "aiSuggestions": ["string"]
}
Ensure EXACTLY 24 weeks for the breakdown.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI error:", error);
    return getMockInitialRoadmap();
  }
}

export async function generateNextSemester(currentSemesterNum: number, score: number, previousSubjects: string[], previousWeaknesses: string[]) {
  if (!apiKey) {
    return getMockNextRoadmap(currentSemesterNum + 1);
  }

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
  "weeklyBreakdown": [{"week": number, "month": number, "focus": "string", "tasks": ["string"], "details": "string", "youtubeSearchUrl": "string"}],
  "aiSuggestions": ["string"]
}
Ensure EXACTLY 24 weeks for the breakdown.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini AI error:", error);
    return getMockNextRoadmap(currentSemesterNum + 1);
  }
}

export async function generateExamStrategy(examName: string, topics: string, targetDate: string) {
  if (!apiKey) return null;

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
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Exam AI Error:", error);
    return null;
  }
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
