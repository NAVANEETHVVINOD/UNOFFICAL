import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  Post,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  UpdateProfileDto,
  CreateEducationDto,
  CreateExperienceDto,
  CreateProjectDto,
  CreateVolunteeringDto,
} from './dto/update-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req) {
    return this.profilesService.findOne({ userId: req.user.userId });
  }

  @Get('leaderboard')
  async getLeaderboard() {
    return this.profilesService.getLeaderboard();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.update({
      where: { userId: req.user.userId },
      data: updateProfileDto,
    });
  }
  @UseGuards(JwtAuthGuard)
  @Post('me/education')
  addEducation(@Request() req, @Body() dto: CreateEducationDto) {
    return this.profilesService.addEducation(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/education/:id')
  removeEducation(@Request() req, @Param('id') id: string) {
    return this.profilesService.removeEducation(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/experience')
  addExperience(@Request() req, @Body() dto: CreateExperienceDto) {
    return this.profilesService.addExperience(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/experience/:id')
  removeExperience(@Request() req, @Param('id') id: string) {
    return this.profilesService.removeExperience(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/projects')
  addProject(@Request() req, @Body() dto: CreateProjectDto) {
    return this.profilesService.addProject(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/projects/:id')
  removeProject(@Request() req, @Param('id') id: string) {
    return this.profilesService.removeProject(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/volunteering')
  addVolunteering(@Request() req, @Body() dto: CreateVolunteeringDto) {
    return this.profilesService.addVolunteering(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/volunteering/:id')
  removeVolunteering(@Request() req, @Param('id') id: string) {
    return this.profilesService.removeVolunteering(req.user.userId, id);
  }
}
