import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Request() req,
    @Query('collegeSlug') collegeSlug?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('filter') filter: 'all' | 'college' = 'college',
    @Query('isOfficial') isOfficial?: string,
  ) {
    // req.user is populated by JwtStrategy. Ideally it has userId, role, collegeId.
    // We map it to the service's expected format.
    const currentUser = {
      id: req.user.userId,
      role: req.user.role,
      collegeId: req.user.collegeId || null,
    };
    return this.postsService.findAll(
      currentUser,
      collegeSlug,
      Number(page),
      Number(limit),
      filter,
      isOfficial === 'true',
    );
  }

  /**
   * Cursor-based pagination endpoint for infinite scroll.
   * More efficient than offset pagination for large datasets.
   * 
   * **Validates: Requirements 26.1, 26.2, 26.3, 26.4**
   */
  @UseGuards(JwtAuthGuard)
  @Get('feed/cursor')
  findAllCursor(
    @Request() req,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @Query('collegeSlug') collegeSlug?: string,
    @Query('filter') filter: 'all' | 'college' = 'college',
    @Query('isOfficial') isOfficial?: string,
  ) {
    const currentUser = {
      id: req.user.userId,
      role: req.user.role,
      collegeId: req.user.collegeId || null,
    };
    return this.postsService.findAllCursor(currentUser, {
      cursor,
      limit: limit ? Number(limit) : undefined,
      collegeSlug,
      filter,
      isOfficial: isOfficial === 'true',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/like')
  like(@Param('id') id: string, @Request() req) {
    return this.postsService.like(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/like')
  unlike(@Param('id') id: string, @Request() req) {
    return this.postsService.unlike(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/vote')
  vote(
    @Param('id') id: string,
    @Body() body: { optionId: string },
    @Request() req,
  ) {
    return this.postsService.votePoll(req.user.userId, id, body.optionId);
  }

  /**
   * Save a post for the authenticated user.
   * 
   * **Validates: Requirements 27.1, 27.2**
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/save')
  savePost(@Param('id') id: string, @Request() req) {
    return this.postsService.savePost(id, req.user.userId);
  }

  /**
   * Unsave a post for the authenticated user.
   * 
   * **Validates: Requirements 27.1, 27.2**
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/save')
  unsavePost(@Param('id') id: string, @Request() req) {
    return this.postsService.unsavePost(id, req.user.userId);
  }

  /**
   * Check if a post is saved by the authenticated user.
   * 
   * **Validates: Requirements 27.3**
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/saved')
  isPostSaved(@Param('id') id: string, @Request() req) {
    return this.postsService.isPostSaved(id, req.user.userId);
  }
}
