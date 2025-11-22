import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMyProfile(@Request() req) {
        return this.profilesService.findOne({ userId: req.user.userId });
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.profilesService.update({
            where: { userId: req.user.userId },
            data: updateProfileDto,
        });
    }
}
