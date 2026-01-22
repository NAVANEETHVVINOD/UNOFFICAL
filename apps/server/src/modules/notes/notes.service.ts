import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Note, Prisma } from '@prisma/client';
import { formatResourceFilename } from '../../common/utils/resource-filename';
import { randomUUID } from 'crypto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Format the filename for a resource upload according to naming convention.
   * Format: SubjectName_Username.extension
   * 
   * **Validates: Requirements 3.1, 3.2, 3.4**
   */
  formatFilename(subject: string, username: string, originalFilename: string): string {
    return formatResourceFilename(subject, username, originalFilename);
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.NoteWhereUniqueInput;
    where?: Prisma.NoteWhereInput;
    orderBy?: Prisma.NoteOrderByWithRelationInput;
  }): Promise<Note[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.note.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        User: { include: { Profile: true } },
        _count: { select: { NoteLike: true } },
      },
    });
  }

  async findOne(
    noteWhereUniqueInput: Prisma.NoteWhereUniqueInput,
  ): Promise<Note | null> {
    return this.prisma.note.findUnique({
      where: noteWhereUniqueInput,
      include: {
        User: { include: { Profile: true } },
        _count: { select: { NoteLike: true } },
      },
    });
  }

  async create(data: Prisma.NoteCreateInput): Promise<Note> {
    return this.prisma.note.create({
      data,
    });
  }

  async likeNote(userId: string, noteId: string) {
    return this.prisma.noteLike.create({
      data: {
        id: randomUUID(),
        userId,
        noteId,
      },
    });
  }

  async unlikeNote(userId: string, noteId: string) {
    return this.prisma.noteLike.delete({
      where: {
        noteId_userId: {
          userId,
          noteId,
        },
      },
    });
  }
}
