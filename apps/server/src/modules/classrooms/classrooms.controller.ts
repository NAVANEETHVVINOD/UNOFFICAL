import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

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
    @Body() body: { fileUrl: string },
  ) {
    return this.classroomsService.submitAssignment(
      req.user.userId,
      assignmentId,
      body.fileUrl,
    );
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
    @Body() body: { grade: number; feedback?: string },
  ) {
    return this.classroomsService.gradeSubmission(
      submissionId,
      body.grade,
      body.feedback,
    );
  }

  // ==================== ATTENDANCE ENDPOINTS ====================

  /**
   * Mark attendance for a classroom.
   * 
   * **Validates: Requirements 2.1, 2.2**
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/attendance')
  markAttendance(
    @Request() req,
    @Param('id') classroomId: string,
    @Body() body: { date: string; records: Record<string, string> },
  ) {
    return this.classroomsService.markAttendance(
      classroomId,
      req.user.userId,
      new Date(body.date),
      body.records as any,
    );
  }

  /**
   * Get attendance records for a classroom with optional date range.
   * 
   * **Validates: Requirements 2.4**
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/attendance')
  getAttendance(
    @Param('id') classroomId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.classroomsService.getAttendance(
      classroomId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  /**
   * Get attendance for a specific date.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/attendance/:date')
  getAttendanceByDate(
    @Param('id') classroomId: string,
    @Param('date') date: string,
  ) {
    return this.classroomsService.getAttendanceByDate(classroomId, new Date(date));
  }

  /**
   * Get attendance summary for all students in a classroom.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/attendance-summary')
  getAttendanceSummary(@Param('id') classroomId: string) {
    return this.classroomsService.getClassroomAttendanceSummary(classroomId);
  }

  /**
   * Get attendance percentage for a specific student.
   * 
   * **Validates: Requirements 2.3**
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/attendance/student/:studentId')
  getStudentAttendance(
    @Param('id') classroomId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.classroomsService.getStudentAttendancePercentage(
      classroomId,
      studentId,
    );
  }

  /**
   * Verify assignment completion and award karma.
   * 
   * **Validates: Requirements 1.6, 1.7**
   */
  @UseGuards(JwtAuthGuard)
  @Post('submissions/:submissionId/verify')
  verifySubmission(
    @Request() req,
    @Param('submissionId') submissionId: string,
    @Body() body: { verified: boolean; karmaPoints?: number },
  ) {
    return this.classroomsService.verifyAssignmentCompletion(
      submissionId,
      req.user.userId,
      body.verified,
      body.karmaPoints,
    );
  }

  /**
   * Get classroom analytics for teacher dashboard.
   * 
   * **Validates: Requirements 1.1**
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/analytics')
  getAnalytics(@Param('id') classroomId: string) {
    return this.classroomsService.getClassroomAnalytics(classroomId);
  }
}
