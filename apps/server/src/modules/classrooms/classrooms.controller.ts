import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('classrooms')
export class ClassroomsController {
    constructor(private readonly classroomsService: ClassroomsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Request() req, @Body() createClassroomDto: any) {
        return this.classroomsService.create(req.user.userId, createClassroomDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Request() req) {
        return this.classroomsService.findAll(req.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.classroomsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post('join')
    join(@Request() req, @Body() body: { code: string }) {
        return this.classroomsService.joinClassroom(req.user.userId, body.code);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/assignments')
    createAssignment(@Param('id') classroomId: string, @Body() body: any) {
        return this.classroomsService.createAssignment(classroomId, body);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id/assignments')
    getAssignments(@Param('id') classroomId: string) {
        return this.classroomsService.getAssignments(classroomId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('assignments/:assignmentId/submit')
    submitAssignment(
        @Request() req,
        @Param('assignmentId') assignmentId: string,
        @Body() body: { fileUrl: string }
    ) {
        return this.classroomsService.submitAssignment(req.user.userId, assignmentId, body.fileUrl);
    }

    @UseGuards(JwtAuthGuard)
    @Get('assignments/:assignmentId/submissions')
    getSubmissions(@Param('assignmentId') assignmentId: string) {
        return this.classroomsService.getSubmissions(assignmentId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('submissions/:submissionId/grade')
    gradeSubmission(
        @Param('submissionId') submissionId: string,
        @Body() body: { grade: number; feedback?: string }
    ) {
        return this.classroomsService.gradeSubmission(submissionId, body.grade, body.feedback);
    }
}
