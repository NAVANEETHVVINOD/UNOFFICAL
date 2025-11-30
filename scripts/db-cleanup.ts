import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🧹 Starting database cleanup...');

    // 1. Fix empty string collegeIds
    console.log('🔍 Checking for empty string collegeIds...');
    const profilesWithEmptyCollege = await prisma.profile.findMany({
        where: { collegeId: "" }
    });

    if (profilesWithEmptyCollege.length > 0) {
        console.log(`Found ${profilesWithEmptyCollege.length} profiles with empty collegeId. Setting to null...`);
        await prisma.profile.updateMany({
            where: { collegeId: "" },
            data: { collegeId: null }
        });
    }

    // 2. Remove orphan profiles (no user or null userId)
    console.log('🔍 Checking for orphan profiles...');

    // 2a. Profiles with null userId (if any, though schema might enforce it, good to be safe if optional)
    // Note: In schema userId is String @unique, so it can't be null unless optional. 
    // If it's optional in schema, this is needed. If required, this won't find anything but won't hurt.
    // We'll check if we can query for it.
    try {
        // @ts-ignore - in case strict types complain
        const nullUserProfiles = await prisma.profile.findMany({ where: { userId: null } });
        if (nullUserProfiles.length > 0) {
            console.log(`Found ${nullUserProfiles.length} profiles with null userId. Deleting...`);
            // @ts-ignore
            await prisma.profile.deleteMany({ where: { userId: null } });
        }
    } catch (e) {
        console.log('Skipping null userId check (likely required field).');
    }

    // 2b. Profiles where User doesn't exist
    const allProfiles = await prisma.profile.findMany({
        select: { id: true, userId: true }
    });

    for (const profile of allProfiles) {
        if (!profile.userId) continue; // Should be handled above
        const user = await prisma.user.findUnique({ where: { id: profile.userId } });
        if (!user) {
            console.log(`🗑️ Deleting orphan profile ${profile.id} (User ${profile.userId} not found)`);
            await prisma.profile.delete({ where: { id: profile.id } });
        }
    }

    // 3. Normalize Onboarding Step
    console.log('🔍 Normalizing onboarding steps...');
    const invalidSteps = await prisma.profile.count({
        where: { onboardingStep: { lt: 0 } }
    });
    if (invalidSteps > 0) {
        console.log(`Found ${invalidSteps} profiles with invalid onboardingStep. Resetting to 0...`);
        await prisma.profile.updateMany({
            where: { onboardingStep: { lt: 0 } },
            data: { onboardingStep: 0 }
        });
    }

    // 4. Ensure Platform Admin exists
    console.log('🔍 Checking for Platform Admin...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@linker.com';
    const admin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!admin) {
        console.log('⚠️ Platform Admin not found. Please register manually or seed.');
    } else {
        if (admin.role !== 'PLATFORM_ADMIN') {
            console.log('👑 Promoting admin user to PLATFORM_ADMIN...');
            await prisma.user.update({
                where: { id: admin.id },
                data: { role: 'PLATFORM_ADMIN' }
            });
        }
    }

    console.log('✅ Cleanup complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
