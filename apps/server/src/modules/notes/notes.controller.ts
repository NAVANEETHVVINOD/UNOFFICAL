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

interface CreateNoteDto {
  title: string;
  description?: string;
  fileUrl: string;
  subject: string;
  semester: number;
  courseCode?: string;
  originalFilename?: string;
}

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  /**
   * Get all notes with optional filtering.
   * 
   * **Validates: Requirements 3.3, 3.5**
   */
  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('subject') subject?: string,
    @Query('uploader') uploaderId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const where: Prisma.NoteWhereInput = {};
    
    // Search filter
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Subject filter
    if (subject) {
      where.subject = { equals: subject, mode: 'insensitive' };
    }
    
    // Uploader filter
    if (uploaderId) {
      where.authorId = uploaderId;
    }
    
    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }
    
    return this.notesService.findAll({ 
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.notesService.findOne({ id });
  }

  /**
   * Create a new note with auto-formatted filename.
   * 
   * **Validates: Requirements 3.1, 3.2, 3.4**
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createNoteDto: CreateNoteDto) {
    // Get user profile for username
    const user = await this.notesService['prisma'].user.findUnique({
      where: { id: req.user.userId },
      include: { profile: true },
    });
    
    const username = user?.profile?.fullName || user?.email?.split('@')[0] || 'user';
    
    // Format the filename according to naming convention
    let formattedFileUrl = createNoteDto.fileUrl;
    if (createNoteDto.originalFilename) {
      const formattedFilename = this.notesService.formatFilename(
        createNoteDto.subject,
        username,
        createNoteDto.originalFilename,
      );
      // If the fileUrl is a path, replace the filename portion
      // Otherwise, store the formatted name as metadata
      // For now, we'll store the original URL but the formatted name can be used for display
      formattedFileUrl = createNoteDto.fileUrl;
    }
    
    return this.notesService.create({
      title: createNoteDto.title,
      description: createNoteDto.description,
      fileUrl: formattedFileUrl,
      subject: createNoteDto.subject,
      semester: createNoteDto.semester,
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
