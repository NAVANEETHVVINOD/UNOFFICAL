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

  @Post()
  async sendMessage(
    @Request() req,
    @Body() body: { listingId?: string; content: string },
  ) {
    return this.messagesService.sendMessage(req.user.userId, body);
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
