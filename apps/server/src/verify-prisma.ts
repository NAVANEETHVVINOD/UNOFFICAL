
import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    console.log('Prisma Client initialized successfully');
    try {
        // Just check if we can access a model property (it won't connect without DB, but types should exist)
        console.log('User model exists:', !!prisma.user);
        console.log('Event model exists:', !!prisma.event);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
