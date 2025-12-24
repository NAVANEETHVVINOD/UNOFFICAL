import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import sanitizeHtml from 'sanitize-html';
import { PostType, Poll, PollOption, NotificationType } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

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
      visibility: createPostDto.visibility || 'PUBLIC',
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

  async findAll(
    currentUser: { id: string; role: string; collegeId: string | null },
    collegeSlug?: string,
    page: number = 1,
    limit: number = 10,
    filter: 'all' | 'college' = 'college',
    isOfficial: boolean = false,
  ) {
    const skip = (page - 1) * limit;

    // 1. Base Logic: Start with empty AND array
    const andConditions: any[] = [];

    // Filter by specific college feed (e.g. visiting a college profile? No, Feed is global now)
    // If 'collegeSlug' is passed, we filter posts from that college ONLY.
    // If no collegeSlug, global feed.
    if (collegeSlug) {
      andConditions.push({ college: { slug: collegeSlug } });
    }

    // New Filter: "My College" vs "All"
    if (filter === 'college' && currentUser.collegeId) {
      andConditions.push({ collegeId: currentUser.collegeId });
    }

    // 2. Role-Based Restrictions
    if (currentUser.role === 'FACULTY') {
      andConditions.push({ isAnonymous: false });
    }

    // Official Filter
    if (isOfficial) {
      andConditions.push({ author: { role: 'COLLEGE_ADMIN' } });
    }

    // 3. Visibility Logic (Complex OR)
    // User sees:
    // - PUBLIC posts
    // - COLLEGE posts (IF user's collegeId matches post's collegeId)
    // - PRIVATE posts (IF authorId matches userId)

    const visibilityConditions: any[] = [{ visibility: 'PUBLIC' }];

    if (currentUser.collegeId) {
      visibilityConditions.push({
        visibility: 'COLLEGE',
        collegeId: currentUser.collegeId,
      });
    }

    visibilityConditions.push({
      visibility: 'PRIVATE',
      authorId: currentUser.id,
    });

    // Combine
    const whereClause: any = {
      AND: [...andConditions, { OR: visibilityConditions }],
    };

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
      const like = await this.prisma.postLike.create({
        data: {
          postId: id,
          userId,
        },
        include: {
          post: true,
          user: { include: { profile: true } },
        },
      });

      // Send Notification
      if (like.post.authorId && like.post.authorId !== userId) {
        await this.notificationsService.createNotification({
          userId: like.post.authorId,
          type: NotificationType.LIKE,
          title: 'New Like',
          message: `${like.user.profile?.fullName || 'Someone'} liked your post`,
          actionUrl: `/feed?post=${id}`,
          actorId: userId,
        });
      }

      return like;
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
