import { PrismaClient } from '@prisma/client';

async function main() {
    console.log('🔌 Connecting to Database...');
    const prisma = new PrismaClient();

    try {
        await prisma.$connect();
        console.log('✅ Connected to Database!');

        // Test query
        const userCount = await prisma.user.count();
        console.log(`📊 Current User Count: ${userCount}`);

        console.log('✅ Database Verification Successful.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to connect to Database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
