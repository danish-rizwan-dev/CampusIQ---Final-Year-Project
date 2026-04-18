import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  console.log('User model fields:', Object.keys(prisma.user));
  // We can also check the types indirectly
  const test: any = {};
  console.log('Done');
}

main();
