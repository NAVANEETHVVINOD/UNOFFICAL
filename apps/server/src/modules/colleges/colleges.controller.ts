import { Controller, Get, Param } from '@nestjs/common';
import { CollegesService } from './colleges.service';

@Controller('colleges')
export class CollegesController {
  constructor(private readonly collegesService: CollegesService) {}

  @Get()
  async findAll() {
    return this.collegesService.findAll();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return this.collegesService.findOne({ slug });
  }

  @Get(':slug/stats')
  async getStats(@Param('slug') slug: string) {
    return this.collegesService.getStats(slug);
  }
}
