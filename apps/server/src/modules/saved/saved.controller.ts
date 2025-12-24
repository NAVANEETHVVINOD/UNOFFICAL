import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SavedService } from './saved.service';
import { CreateSavedDto } from './dto/create-saved.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('saved')
@UseGuards(JwtAuthGuard)
export class SavedController {
  constructor(private readonly savedService: SavedService) {}

  @Post()
  create(@Request() req, @Body() createSavedDto: CreateSavedDto) {
    return this.savedService.create(req.user.id, createSavedDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.savedService.findAll(req.user.id);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.savedService.remove(req.user.id, id);
  }
}
