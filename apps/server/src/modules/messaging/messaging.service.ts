import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class MessagingService {
  constructor(private prisma: PrismaService) {}

  async createConversation(
    userId: string,
    participantId: string,
    listingId?: string,
  ) {
    // Check if conversation already exists
    // This logic is simplified; real logic needs to check if BOTH are participants
    // For now, create new
    return this.prisma.conversation.create({
      data: {
        id: randomUUID(),
        updatedAt: new Date(),
        listingId,
        User: {
          connect: [{ id: userId }, { id: participantId }],
        },
      },
      include: { User: true, MarketplaceListing: true },
    });
  }

  async getUserConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        User: {
          some: { id: userId },
        },
      },
      include: {
        User: true,
        MarketplaceListing: true,
        Message: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getConversation(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        User: true,
        MarketplaceListing: true,
        Message: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (
      !conversation ||
      !conversation.User.some((p) => p.id === userId)
    ) {
      throw new NotFoundException('Conversation not found or access denied');
    }

    return conversation;
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const message = await this.prisma.message.create({
      data: {
        id: randomUUID(),
        conversationId,
        senderId,
        content,
      },
    });

    // Update conversation updatedAt
    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return message;
  }
}
