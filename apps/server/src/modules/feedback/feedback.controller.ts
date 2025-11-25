import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body() body: { content: string; category: string },
  ) {
    return this.feedbackService.create({
      content: body.content,
      category: body.category,
      userId: req.user.userId,
      collegeId: req.user.profile?.collegeId,
    });
  }
}
