import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Profile, Prisma } from '@prisma/client';

@Injectable()
export class ProfilesService {
    constructor(private prisma: PrismaService) { }

    async findOne(
        profileWhereUniqueInput: Prisma.ProfileWhereUniqueInput,
    ): Promise<Profile | null> {
        return this.prisma.profile.findUnique({
            where: profileWhereUniqueInput,
            include: { user: true, college: true },
        });
    }

    async update(params: {
        where: Prisma.ProfileWhereUniqueInput;
        data: Prisma.ProfileUpdateInput;
    }): Promise<Profile> {
        const { where, data } = params;
        return this.prisma.profile.update({
            data,
            where,
        });
    }
}
