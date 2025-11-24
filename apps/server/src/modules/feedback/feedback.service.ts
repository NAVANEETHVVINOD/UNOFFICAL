import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FeedbackService {
    constructor(private prisma: PrismaService) { }

    async create(data: { content: string; category: string; userId?: string; collegeId?: string }) {
        return this.prisma.feedback.create({
            data,
        });
    }
}
