import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Note, Prisma } from '@prisma/client';

@Injectable()
export class NotesService {
    constructor(private prisma: PrismaService) { }

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
            include: { author: { include: { profile: true } }, _count: { select: { likes: true } } },
        });
    }

    async findOne(
        noteWhereUniqueInput: Prisma.NoteWhereUniqueInput,
    ): Promise<Note | null> {
        return this.prisma.note.findUnique({
            where: noteWhereUniqueInput,
            include: { author: { include: { profile: true } }, _count: { select: { likes: true } } },
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
