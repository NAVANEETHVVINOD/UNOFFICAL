import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async findAll(@Query('search') search?: string) {
    const where: Prisma.NoteWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { subject: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};
    return this.notesService.findAll({ where });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.notesService.findOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createNoteDto: Prisma.NoteCreateInput) {
    return this.notesService.create({
      ...createNoteDto,
      author: { connect: { id: req.user.userId } },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  async likeNote(@Request() req, @Param('id') noteId: string) {
    return this.notesService.likeNote(req.user.userId, noteId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  async unlikeNote(@Request() req, @Param('id') noteId: string) {
    return this.notesService.unlikeNote(req.user.userId, noteId);
  }
}
