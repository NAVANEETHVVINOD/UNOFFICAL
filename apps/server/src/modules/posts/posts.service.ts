import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import sanitizeHtml from 'sanitize-html';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  async create(createPostDto: CreatePostDto, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.profile?.collegeId) {
      throw new NotFoundException('User or College not found');
    }

    const sanitizedContent = sanitizeHtml(createPostDto.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        'img': ['src', 'alt']
      }
    });

    return this.prisma.post.create({
      data: {
        ...createPostDto,
        content: sanitizedContent,
        authorId: userId,
        collegeId: user.profile.collegeId,
      },
      include: {
        author: {
          include: { profile: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });
  }

  async findAll(collegeSlug?: string) {
    const whereClause = collegeSlug ? { college: { slug: collegeSlug } } : {};

    return this.prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          include: { profile: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          include: { profile: true },
        },
        comments: {
          include: {
            author: { include: { profile: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async like(id: string, userId: string) {
    try {
      return await this.prisma.postLike.create({
        data: {
          postId: id,
          userId,
        },
      });
    } catch (error) {
      // If already liked, ignore (or could toggle)
      return { message: 'Already liked' };
    }
  }

  async unlike(id: string, userId: string) {
    try {
      return await this.prisma.postLike.delete({
        where: {
          postId_userId: {
            postId: id,
            userId,
          },
        },
      });
    } catch (error) {
      return { message: 'Not liked yet' };
    }
  }
}
