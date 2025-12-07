import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Starting database cleanup...");

  // 1. Fix empty string collegeIds
  console.log("🔍 Checking for empty string collegeIds...");
  await prisma.profile.updateMany({
    where: { collegeId: "" },
    data: { collegeId: null },
  });

  // 2. Remove ghost users (no auth method)
  console.log("🔍 Removing ghost users (no Auth)...");
  await prisma.user.deleteMany({
    where: {
      AND: [
        { supabaseId: null },
        { password: null },
      ],
    },
  });

  // 3. Remove orphan profiles (their user doesn't exist)
  console.log("🔍 Checking for orphan profiles...");
  const allProfiles = await prisma.profile.findMany({
    select: { id: true, userId: true },
  });

  for (const profile of allProfiles) {
    const userExists = await prisma.user.findUnique({
      where: { id: profile.userId },
    });

    if (!userExists) {
      console.log(`🗑️ Deleting orphan profile ${profile.id}`);
      await prisma.profile.delete({
        where: { id: profile.id },
      });
    }
  }

  // 4. Normalize onboarding steps
  console.log("🔍 Normalizing onboarding steps...");
  await prisma.profile.updateMany({
    where: { onboardingStep: { lt: 0 } },
    data: { onboardingStep: 0 },
  });

  // 5. Ensure Platform Admin exists
  console.log("🔍 Checking for Platform Admin...");
  const adminEmail = process.env.ADMIN_EMAIL || "admin@linker.com";
  const admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    console.log("⚠️ Platform Admin not found. Please register manually.");
  } else if (admin.role !== "PLATFORM_ADMIN") {
    console.log("👑 Promoting admin to PLATFORM_ADMIN...");
    await prisma.user.update({
      where: { id: admin.id },
      data: { role: "PLATFORM_ADMIN" },
    });
  }

  console.log("✅ Cleanup complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
