import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import sanitizeHtml from 'sanitize-html';
import { PostType, Poll, PollOption } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: any, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.profile?.collegeId) {
      throw new NotFoundException('User or College not found');
    }

    // Default to TEXT if not specified
    const type: PostType = createPostDto.type || PostType.TEXT;

    const sanitizedContent = createPostDto.content
      ? sanitizeHtml(createPostDto.content, {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
          allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            img: ['src', 'alt'],
          },
        })
      : '';

    // Data object for Prisma
    const postData: any = {
      content: sanitizedContent,
      authorId: userId,
      collegeId: user.profile.collegeId,
      type: type,
      title: createPostDto.title, // For Collabs
      isAnonymous: createPostDto.isAnonymous || false,
      imageUrl: createPostDto.imageUrl,
    };

    // If Poll, create nested Poll + Options
    if (type === PostType.POLL && createPostDto.poll) {
      postData.poll = {
        create: {
          question: createPostDto.poll.question,
          endDate: createPostDto.poll.endDate || null,
          options: {
            create: createPostDto.poll.options.map((opt: string) => ({
              text: opt,
            })),
          },
        },
      };
    }

    return this.prisma.post.create({
      data: postData,
      include: {
        author: {
          include: { profile: true },
        },
        poll: {
          include: { options: true },
        },
        _count: {
          select: { likes: true, comments: true },
        },
      },
    });
  }

  async findAll(collegeSlug?: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const whereClause: any = {};
    if (collegeSlug) {
      whereClause.college = { slug: collegeSlug };
    }

    // V1.5 Implementation: Just fetch everything for now and let Frontend filter or simple sort.
    // In strict smart feed, we would do complex SQL here.
    // We will ensure we fetch the "type" and "poll" data.

    const [total, posts] = await this.prisma.$transaction([
      this.prisma.post.count({ where: whereClause }),
      this.prisma.post.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          author: {
            include: { profile: true },
          },
          poll: {
            include: {
              options: {
                include: {
                  _count: { select: { votes: true } },
                },
              },
              _count: { select: { votes: true } },
            },
          },
          _count: {
            select: { likes: true, comments: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
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
        poll: {
          include: {
            options: {
              include: {
                _count: { select: { votes: true } },
              },
            },
          },
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

  async votePoll(userId: string, pollId: string, optionId: string) {
    // Check if already voted
    const existingVote = await this.prisma.pollVote.findUnique({
      where: {
        userId_pollId: { userId, pollId },
      },
    });

    if (existingVote) {
      throw new BadRequestException('You already voted.');
    }

    return this.prisma.pollVote.create({
      data: {
        userId,
        pollId,
        optionId,
      },
    });
  }
}
