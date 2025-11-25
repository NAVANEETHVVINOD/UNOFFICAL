import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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
        listingId,
        participants: {
          connect: [{ id: userId }, { id: participantId }],
        },
      },
      include: { participants: true, listing: true },
    });
  }

  async getUserConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        participants: true,
        listing: true,
        messages: {
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
        participants: true,
        listing: true,
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (
      !conversation ||
      !conversation.participants.some((p) => p.id === userId)
    ) {
      throw new NotFoundException('Conversation not found or access denied');
    }

    return conversation;
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    const message = await this.prisma.message.create({
      data: {
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
