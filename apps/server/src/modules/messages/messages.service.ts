import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a direct conversation between two users.
   * Returns existing conversation if one already exists.
   * 
   * **Validates: Requirements 29.1, 29.2**
   */
  async createDirectConversation(userId: string, participantId: string) {
    // Prevent self-conversation
    if (userId === participantId) {
      throw new BadRequestException('Cannot start a conversation with yourself');
    }

    // Check if participant exists
    const participant = await this.prisma.user.findUnique({
      where: { id: participantId },
    });

    if (!participant) {
      throw new NotFoundException('User not found');
    }

    // Check for existing direct conversation (no listing)
    const existingConversation = await this.prisma.conversation.findFirst({
      where: {
        listingId: null, // Direct conversation (no listing)
        AND: [
          { participants: { some: { id: userId } } },
          { participants: { some: { id: participantId } } },
        ],
      },
      include: {
        participants: {
          include: { profile: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (existingConversation) {
      return existingConversation;
    }

    // Create new direct conversation
    return this.prisma.conversation.create({
      data: {
        participants: {
          connect: [{ id: userId }, { id: participantId }],
        },
      },
      include: {
        participants: {
          include: { profile: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
  }

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

    // Case 2: Direct message to a user
    if (!conversationId && data.receiverId) {
      const conversation = await this.createDirectConversation(senderId, data.receiverId);
      conversationId = conversation.id;
    }

    if (!conversationId) {
      throw new BadRequestException('Either listingId or receiverId is required to start a conversation');
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

  /**
   * Get all conversations for a user.
   * Includes both direct and listing-based conversations.
   * 
   * **Validates: Requirements 29.4**
   */
  async getConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
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
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: userId },
                seen: false,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Add type field to distinguish conversation types
    return conversations.map((conv) => ({
      ...conv,
      type: conv.listingId ? 'listing' : 'direct',
      unreadCount: conv._count?.messages || 0,
    }));
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
