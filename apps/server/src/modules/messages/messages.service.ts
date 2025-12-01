import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(
    senderId: string,
    data: { listingId?: string; receiverId?: string; content: string },
  ) {
    let conversationId: string | undefined;

    // Case 1: Starting a chat from a listing
    if (data.listingId) {
      const listing = await this.prisma.marketplaceListing.findUnique({
        where: { id: data.listingId },
        include: { conversations: { include: { participants: true } } },
      });

      if (!listing) throw new NotFoundException('Listing not found');

      // Check if conversation already exists between these two for this listing
      const existing = listing.conversations.find((c) =>
        c.participants.some((p) => p.id === senderId),
      );

      if (existing) {
        conversationId = existing.id;
      } else {
        // Create new conversation
        const conversation = await this.prisma.conversation.create({
          data: {
            listing: { connect: { id: data.listingId } },
            participants: {
              connect: [{ id: senderId }, { id: listing.ownerId }],
            },
          },
        });
        conversationId = conversation.id;
      }
    }

    if (!conversationId && !data.receiverId) {
      throw new NotFoundException('Listing ID required to start conversation');
    }

    if (!conversationId) {
      throw new NotFoundException(
        'Direct messaging not yet implemented. Please start from a listing.',
      );
    }

    return this.prisma.message.create({
      data: {
        content: data.content,
        sender: { connect: { id: senderId } },
        conversation: { connect: { id: conversationId } },
      },
      include: { conversation: true },
    });
  }

  async replyToConversation(
    senderId: string,
    conversationId: string,
    content: string,
  ) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    if (!conversation) throw new NotFoundException('Conversation not found');

    // Verify participant
    if (!conversation.participants.some((p) => p.id === senderId)) {
      throw new ForbiddenException('You are not a participant');
    }

    return this.prisma.message.create({
      data: {
        content,
        conversation: { connect: { id: conversationId } },
        sender: { connect: { id: senderId } },
      },
    });
  }

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        participants: { some: { id: userId } },
      },
      include: {
        listing: true,
        participants: {
          where: { id: { not: userId } }, // Get other participant
          include: { profile: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getMessages(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    if (
      !conversation ||
      !conversation.participants.some((p) => p.id === userId)
    ) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: { sender: { include: { profile: true } } },
    });
  }

  async markAsSeen(userId: string, conversationId: string) {
    // Update all messages in this conversation sent by OTHERS that are not seen
    return this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        seen: false,
      },
      data: {
        seen: true,
        seenAt: new Date(),
      },
    });
  }
}
