import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSavedDto, SavedType } from './dto/create-saved.dto';

@Injectable()
export class SavedService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createSavedDto: CreateSavedDto) {
    const { type, postId, eventId, listingId, noteId } = createSavedDto;

    // Validation: Ensure the correct ID is provided for the type
    if (type === SavedType.POST && !postId)
      throw new BadRequestException('postId is required for POST type');
    if (type === SavedType.EVENT && !eventId)
      throw new BadRequestException('eventId is required for EVENT type');
    if (type === SavedType.LISTING && !listingId)
      throw new BadRequestException('listingId is required for LISTING type');
    if (type === SavedType.NOTE && !noteId)
      throw new BadRequestException('noteId is required for NOTE type');

    // Prevent duplicates handled by Prisma unique constraints, but nice to catch
    try {
      return await this.prisma.savedItem.create({
        data: {
          userId,
          type: type as any, // Cast to Prisma enum if needed or ensure match
          postId,
          eventId,
          listingId,
          noteId,
        },
        include: {
          post: true,
          event: true,
          listing: true,
          note: true,
        },
      });
    } catch (error) {
      // P2002 is Unique constraint failed
      if (error.code === 'P2002') {
        throw new BadRequestException('Item already saved');
      }
      throw error;
    }
  }

  async findAll(userId: string) {
    return this.prisma.savedItem.findMany({
      where: { userId },
      include: {
        post: { include: { author: true } },
        event: true,
        listing: true,
        note: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(userId: string, id: string) {
    // Ensure the user owns the saved item
    const type = 'dud'; // dummy
    // Actually we remove by ID.
    // Verify ownership
    const item = await this.prisma.savedItem.findUnique({ where: { id } });
    if (!item || item.userId !== userId) {
      throw new BadRequestException('Item not found or access denied');
    }

    return this.prisma.savedItem.delete({
      where: { id },
    });
  }
}
