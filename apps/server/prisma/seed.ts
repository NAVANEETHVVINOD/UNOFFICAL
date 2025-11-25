import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@collegeconnect.com' },
    update: {},
    create: {
      email: 'admin@collegeconnect.com',
      password: adminPassword,
      role: 'PLATFORM_ADMIN',
      profile: {
        create: {
          fullName: 'System Administrator',
          isOnboarded: true,
          onboardingStep: 5,
          bio: 'I am the system administrator.',
        },
      },
    },
  });

  console.log({ admin });

  // Dynamic Colleges
  const colleges = [
    {
      name: 'Model Engineering College',
      slug: 'model-engineering-college',
      city: 'Kochi',
      state: 'Kerala',
    },
    {
      name: 'Tech Institute of Innovation',
      slug: 'tech-institute',
      city: 'Bangalore',
      state: 'Karnataka',
    },
    {
      name: 'City Arts & Science College',
      slug: 'city-arts',
      city: 'Mumbai',
      state: 'Maharashtra',
    },
    {
      name: 'Global Business School',
      slug: 'global-business',
      city: 'Delhi',
      state: 'Delhi',
    },
  ];

  for (const college of colleges) {
    const c = await prisma.college.upsert({
      where: { slug: college.slug },
      update: {},
      create: college,
    });
    console.log(`Seeded college: ${c.name}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });