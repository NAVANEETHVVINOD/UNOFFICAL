import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * Send a message (either to a listing or direct to a user).
   */
  @Post()
  async sendMessage(
    @Request() req,
    @Body() body: { listingId?: string; receiverId?: string; content: string },
  ) {
    return this.messagesService.sendMessage(req.user.userId, body);
  }

  /**
   * Create or get a direct conversation with another user.
   * 
   * **Validates: Requirements 29.1, 29.2**
   */
  @Post('direct')
  async createDirectConversation(
    @Request() req,
    @Body() body: { participantId: string; initialMessage?: string },
  ) {
    const conversation = await this.messagesService.createDirectConversation(
      req.user.userId,
      body.participantId,
    );

    // If initial message provided, send it
    if (body.initialMessage) {
      await this.messagesService.replyToConversation(
        req.user.userId,
        conversation.id,
        body.initialMessage,
      );
    }

    return conversation;
  }

  @Post(':id/reply')
  async reply(
    @Request() req,
    @Param('id') conversationId: string,
    @Body() body: { content: string },
  ) {
    return this.messagesService.replyToConversation(
      req.user.userId,
      conversationId,
      body.content,
    );
  }

  @Get()
  async getConversations(@Request() req) {
    return this.messagesService.getConversations(req.user.userId);
  }

  @Get(':id')
  async getMessages(@Request() req, @Param('id') conversationId: string) {
    return this.messagesService.getMessages(req.user.userId, conversationId);
  }

  @Patch(':id/seen')
  async markAsSeen(@Request() req, @Param('id') conversationId: string) {
    return this.messagesService.markAsSeen(req.user.userId, conversationId);
  }
}
