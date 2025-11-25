import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MarketplaceListing, Prisma } from '@prisma/client';

@Injectable()
export class MarketplaceService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MarketplaceListingWhereUniqueInput;
    where?: Prisma.MarketplaceListingWhereInput;
    orderBy?: Prisma.MarketplaceListingOrderByWithRelationInput;
  }): Promise<MarketplaceListing[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.marketplaceListing.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { owner: { include: { profile: true } } },
    });
  }

  async findOne(
    marketplaceListingWhereUniqueInput: Prisma.MarketplaceListingWhereUniqueInput,
  ): Promise<MarketplaceListing | null> {
    return this.prisma.marketplaceListing.findUnique({
      where: marketplaceListingWhereUniqueInput,
      include: { owner: { include: { profile: true } } },
    });
  }

  async create(
    data: Prisma.MarketplaceListingCreateInput,
  ): Promise<MarketplaceListing> {
    return this.prisma.marketplaceListing.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.MarketplaceListingWhereUniqueInput;
    data: Prisma.MarketplaceListingUpdateInput;
  }): Promise<MarketplaceListing> {
    const { where, data } = params;
    return this.prisma.marketplaceListing.update({
      data,
      where,
    });
  }
}
