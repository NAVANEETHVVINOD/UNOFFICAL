import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string) {
    if (!query || query.trim().length < 2) {
      return {
        users: [],
        posts: [],
        notes: [],
        events: [],
        listings: [],
        clubs: [],
      };
    }

    const searchTerm = query.trim();

    const [users, posts, notes, events, listings, clubs] = await Promise.all([
      // Users
      this.prisma.user.findMany({
        where: {
          OR: [
            {
              Profile: {
                fullName: { contains: searchTerm, mode: 'insensitive' },
              },
            },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { Profile: { bio: { contains: searchTerm, mode: 'insensitive' } } },
          ],
        },
        select: {
          id: true,
          email: true,
          Profile: {
            select: {
              fullName: true,
              avatarUrl: true,
              bio: true,
              userId: true,
            },
          },
        },
        take: 5,
      }),

      // Posts
      this.prisma.post.findMany({
        where: {
          OR: [
            { content: { contains: searchTerm, mode: 'insensitive' } },
            // Add title if it exists in schema, otherwise just content
            { title: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        include: { User: { include: { Profile: true } } },
        take: 5,
      }),

      // Notes
      this.prisma.note.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { subject: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        include: { User: { include: { Profile: true } } },
        take: 5,
      }),

      // Events
      this.prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { venue: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),

      // Marketplace
      this.prisma.marketplaceListing.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
      // Clubs
      this.prisma.club.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        take: 5,
      }),
    ]);

    return { users, posts, notes, events, listings, clubs };
  }
}
