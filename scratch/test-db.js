
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    const examCount = await prisma.mockExam.count();
    console.log('MockExam count:', examCount);
    
    const users = await prisma.user.findMany({ take: 1 });
    console.log('Sample user:', users[0]?.id);
    
    if (users[0]) {
        const exams = await prisma.mockExam.findMany({ where: { userId: users[0].id } });
        console.log('Exams for user:', exams.length);
    }
  } catch (e) {
    console.error('Prisma Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
