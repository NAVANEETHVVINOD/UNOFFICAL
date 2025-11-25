import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('scope') scope?: 'COLLEGE' | 'STATE',
    @Query('college') collegeSlug?: string,
  ) {
    const where: Prisma.MarketplaceListingWhereInput = {};
    const andConditions: Prisma.MarketplaceListingWhereInput[] = [];

    if (search) {
      andConditions.push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (scope) {
      // @ts-ignore: Scope is valid in DB but types might be lagging
      andConditions.push({ scope: scope });
    }

    if (collegeSlug) {
      andConditions.push({ college: { slug: collegeSlug } });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }
    return this.marketplaceService.findAll({ where });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.marketplaceService.findOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body() createListingDto: Prisma.MarketplaceListingCreateInput,
  ) {
    return this.marketplaceService.create({
      ...createListingDto,
      owner: { connect: { id: req.user.userId } },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateListingDto: Prisma.MarketplaceListingUpdateInput,
  ) {
    // Ensure user owns the listing (logic can be added here or in service)
    return this.marketplaceService.update({
      where: { id },
      data: updateListingDto,
    });
  }
}
