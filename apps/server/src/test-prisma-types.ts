// This file is for TypeScript verification only
// You can delete this file after verifying the types work

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Test that Post model exists
async function testPostModel() {
    // This should not show TypeScript errors
    const posts = await prisma.post.findMany();
    const post = await prisma.post.findUnique({ where: { id: 'test' } });
    const newPost = await prisma.post.create({
        data: {
            content: 'Test',
            authorId: 'test',
        },
    });

    // Test PostLike model
    const postLike = await prisma.postLike.findMany();

    // Test Comment model
    const comments = await prisma.comment.findMany();

    console.log('All Prisma models are correctly typed!');
}

// Don't actually run this, it's just for type checking
// testPostModel();
