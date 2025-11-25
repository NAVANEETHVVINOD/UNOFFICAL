import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@collegeconnect.com',
      password: adminPassword,
      role: 'PLATFORM_ADMIN',
      profile: {
        create: {
          fullName: 'System Administrator',
        },
      },
    },
  });

  console.log({ admin });

  // Create Model Engineering College
  const mec = await prisma.college.upsert({
    where: { slug: 'model-engineering-college' },
    update: {},
    create: {
      name: 'Model Engineering College',
      slug: 'model-engineering-college',
      city: 'Kochi',
      state: 'Kerala',
    },
  });

  console.log({ mec });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });