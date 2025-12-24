import { Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ClassroomsController],
  providers: [ClassroomsService, PrismaService],
  exports: [ClassroomsService],
})
export class ClassroomsModule {}
