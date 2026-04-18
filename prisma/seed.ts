import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CampusIQ demo data...');

  // Clean up existing demo user
  await prisma.user.deleteMany({ where: { email: 'demo@campusiq.com' } });

  const hashed = await bcrypt.hash('demo123456', 10);

  const user = await prisma.user.create({
    data: {
      clerkId: 'seed_demo_user_clerk_id',
      name: 'Alex Johnson',
      email: 'demo@campusiq.com',
      passwordHash: hashed,
      profileCompleted: true,
      careerProfile: {
        create: {
          interests: ['Programming', 'Data Analysis', 'System Design'],
          skills: ['Python', 'JavaScript', 'SQL'],
          personalityTraits: ['Analytical', 'Detail-oriented', 'Problem-solver'],
          selectedCareer: 'Software Engineer',
          careerReadinessScore: 68.5,
        }
      },
      roadmaps: {
        create: [
          {
            semesterNumber: 1,
            status: 'COMPLETED',
            performanceScore: 72.5,
            gpa: 75, assignmentRate: 80, conceptScore: 70, timeConsistency: 65, mockTestScore: 68,
            subjects: ['Introduction to Programming', 'Discrete Mathematics', 'Computer Architecture', 'Communication Skills'],
            skills: ['Python Basics', 'Problem Decomposition', 'Git & Version Control'],
            projects: [{ name: 'Calculator CLI', description: 'A command-line calculator built in Python' }],
            weeklyBreakdown: [
              { week: 1, focus: 'Python Basics', tasks: ['Variables & Data Types', 'Control Flow'] },
              { week: 2, focus: 'Functions & Modules', tasks: ['Define functions', 'Import modules'] },
              { week: 3, focus: 'Discrete Math – Logic', tasks: ['Propositional Logic', 'Truth Tables'] },
              { week: 4, focus: 'Computer Architecture', tasks: ['Binary Number Systems', 'Logic Gates'] },
            ],
            aiSuggestions: [
              'Start every week with a 30-minute review of last week\'s content.',
              'Build one small project per month to reinforce concepts.',
              'Focus on strengthening time consistency — study at the same time daily.'
            ],
          },
          {
            semesterNumber: 2,
            status: 'COMPLETED',
            performanceScore: 76.0,
            gpa: 78, assignmentRate: 85, conceptScore: 76, timeConsistency: 72, mockTestScore: 70,
            subjects: ['Data Structures', 'Object-Oriented Programming', 'Linear Algebra', 'Digital Electronics'],
            skills: ['Java/C++', 'OOP Patterns', 'Array & Linked List Manipulation'],
            projects: [
              { name: 'Student Record System', description: 'OOP-based student database in Java' },
              { name: 'Sorting Visualiser', description: 'Animated sorting algorithm comparison tool' },
            ],
            weeklyBreakdown: [
              { week: 1, focus: 'Arrays & Linked Lists', tasks: ['Insertion/Deletion', 'Traversal'] },
              { week: 2, focus: 'Stacks & Queues', tasks: ['Implementation', 'Applications'] },
              { week: 3, focus: 'OOP Concepts', tasks: ['Encapsulation', 'Inheritance', 'Polymorphism'] },
              { week: 4, focus: 'Trees Introduction', tasks: ['Binary Trees', 'Tree Traversals'] },
            ],
            aiSuggestions: [
              'You improved by +3.5% from last semester — great momentum!',
              'Concept score is your strength. Share your understanding by teaching peers.',
              'Increase mock test practice to boost that metric next semester.'
            ],
          },
          {
            semesterNumber: 3,
            status: 'ACTIVE',
            subjects: ['Algorithms & Complexity', 'Database Management Systems', 'Operating Systems', 'Statistics & Probability'],
            skills: ['Dynamic Programming', 'SQL Queries', 'Process Scheduling', 'Probability Theory'],
            projects: [
              { name: 'Hospital DB System', description: 'Full relational database schema with SQL queries' },
              { name: 'LeetCode 50 Challenge', description: 'Solve 50 algorithm problems in 8 weeks' },
            ],
            weeklyBreakdown: [
              { week: 1, focus: 'Sorting Algorithms — Advanced', tasks: ['Merge Sort', 'Quick Sort', 'Radix Sort'] },
              { week: 2, focus: 'Graph Algorithms', tasks: ['BFS', 'DFS', 'Dijkstra\'s Algorithm'] },
              { week: 3, focus: 'SQL Fundamentals', tasks: ['DDL & DML', 'Joins', 'Subqueries'] },
              { week: 4, focus: 'ER Diagrams & Normalization', tasks: ['1NF – 3NF', 'Schema Design'] },
              { week: 5, focus: 'OS Processes & Threads', tasks: ['Scheduling Algorithms', 'Deadlocks'] },
              { week: 6, focus: 'Memory Management', tasks: ['Paging', 'Segmentation', 'Virtual Memory'] },
            ],
            aiSuggestions: [
              'Your trajectory shows a +3.5% average improvement per semester.',
              'Focus on DP problems — this is the most commonly tested area for placements.',
              'Start OS revision 2 weeks before exams, it is conceptually heavy.',
            ],
          }
        ]
      }
    }
  });

  console.log(`✅ Created demo user: demo@campusiq.com / demo123456`);
  console.log(`   User ID: ${user.id}`);
  console.log('🎉 Seeding complete!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
