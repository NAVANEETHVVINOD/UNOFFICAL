import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('messaging')
export class MessagingController {
    constructor(private readonly messagingService: MessagingService) { }

    @UseGuards(JwtAuthGuard)
    @Post('conversations')
    async createConversation(
        @Request() req,
        @Body() body: { participantId: string; listingId?: string },
    ) {
        return this.messagingService.createConversation(req.user.userId, body.participantId, body.listingId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('conversations')
    async getUserConversations(@Request() req) {
        return this.messagingService.getUserConversations(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('conversations/:id')
    async getConversation(@Request() req, @Param('id') id: string) {
        return this.messagingService.getConversation(id, req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('conversations/:id/messages')
    async sendMessage(
        @Request() req,
        @Param('id') conversationId: string,
        @Body('content') content: string,
    ) {
        return this.messagingService.sendMessage(conversationId, req.user.userId, content);
    }
}
