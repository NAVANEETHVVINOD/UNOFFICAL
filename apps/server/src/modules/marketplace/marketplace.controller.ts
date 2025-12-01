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
    @Body()
    createListingDto: Prisma.MarketplaceListingCreateInput & {
      collegeSlug?: string;
    },
  ) {
    const { collegeSlug, ...rest } = createListingDto;

    // If collegeSlug is provided, we need to connect it
    const collegeConnect = {};
    if (collegeSlug) {
      // We can't use Prisma.MarketplaceListingCreateInput directly if we want to look up by slug
      // So we'll assume the service or a helper handles the lookup, OR we do it here.
      // Ideally, we should inject PrismaService to look up the college ID.
      // However, to keep it simple and since we don't have PrismaService injected here directly (it's in Service),
      // we will modify the service to handle this or just pass the slug if we change the service signature.
      // BUT, the easiest fix without changing Service signature too much is to do the lookup here if we had access to Prisma.
      // Since we don't, let's modify the service to accept collegeSlug.
    }

    // Actually, let's look at the service. It takes Prisma.MarketplaceListingCreateInput.
    // We should probably change the controller to NOT use the DTO directly for the body type,
    // or cast it.

    // Better approach: Update the Service to handle the lookup.
    // But wait, the controller has the service.
    // Let's change the Controller to call a new method or modified method in Service.
    // OR, even better, just use the Prisma Client which is available in the Service.

    // Let's modify the Controller to pass the slug to the service, and update the service.
    // But to minimize changes, let's see if we can do it in the controller if we inject PrismaService?
    // No, let's stick to the plan: Modify Controller to extract slug, and maybe Service needs update.

    // Actually, the error is "Unknown argument `collegeSlug`".
    // This is because we are spreading `...createListingDto` which HAS `collegeSlug` into the prisma create call.
    // We MUST remove `collegeSlug` from the object passed to prisma.

    return this.marketplaceService.create({
      ...rest,
      owner: { connect: { id: req.user.userId } },
      ...(collegeSlug ? { college: { connect: { slug: collegeSlug } } } : {}),
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
