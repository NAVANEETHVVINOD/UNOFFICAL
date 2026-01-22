import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { randomUUID } from 'crypto';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

interface AttendanceRecords {
  [userId: string]: AttendanceStatus;
}

@Injectable()
export class ClassroomsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    // Basic validation
    if (!data.name || !data.collegeId) {
      throw new BadRequestException('Name and College ID are required');
    }

    // Generate a simple 6-char code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    return this.prisma.classroom.create({
      data: {
        id: randomUUID(),
        updatedAt: new Date(),
        name: data.name,
        description: data.description,
        subject: data.subject,
        code,
        collegeId: data.collegeId,
        teacherId: userId,
        ClassroomMember: {
          create: {
            id: randomUUID(),
            userId,
            role: 'TEACHER', // Creator is automatically the teacher
          },
        },
      },
      include: {
        User: { select: { id: true, email: true } }, // Minimal teacher info
      },
    });
  }

  async findAll(userId: string) {
    // Find all classrooms where user is a member (either student or teacher)
    return this.prisma.classroom.findMany({
      where: {
        ClassroomMember: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        User: {
          include: { Profile: true },
        },
        _count: {
          select: { ClassroomMember: true, Assignment: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id },
      include: {
        User: { include: { Profile: true } },
        ClassroomMember: {
          include: { User: { include: { Profile: true } } },
        },
        Assignment: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!classroom) throw new NotFoundException('Classroom not found');
    return classroom;
  }

  async joinClassroom(userId: string, code: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { code },
    });

    if (!classroom) throw new NotFoundException('Invalid class code');

    // Check if already a member
    const existingMember = await this.prisma.classroomMember.findUnique({
      where: {
        classroomId_userId: {
          classroomId: classroom.id,
          userId,
        },
      },
    });

    if (existingMember) {
      throw new BadRequestException(
        'You are already a member of this classroom',
      );
    }

    return this.prisma.classroomMember.create({
      data: {
        id: randomUUID(),
        classroomId: classroom.id,
        userId,
        role: 'STUDENT',
      },
    });
  }

  async createAssignment(classroomId: string, data: any) {
    return this.prisma.assignment.create({
      data: {
        id: randomUUID(),
        updatedAt: new Date(),
        title: data.title,
        description: data.description,
        points: data.points ? Number(data.points) : 100,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        classroomId,
      },
    });
  }

  async getAssignments(classroomId: string) {
    return this.prisma.assignment.findMany({
      where: { classroomId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { Submission: true },
        },
      },
    });
  }

  async submitAssignment(
    userId: string,
    assignmentId: string,
    fileUrl: string,
  ) {
    // Check if already submitted
    const existing = await this.prisma.submission.findUnique({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: userId,
        },
      },
    });

    if (existing) {
      return this.prisma.submission.update({
        where: { id: existing.id },
        data: {
          fileUrl,
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
      });
    }

    return this.prisma.submission.create({
      data: {
        id: randomUUID(),
        updatedAt: new Date(),
        assignmentId,
        studentId: userId,
        fileUrl,
        status: 'SUBMITTED',
      },
    });
  }

  async getSubmissions(assignmentId: string) {
    return this.prisma.submission.findMany({
      where: { assignmentId },
      include: {
        User: {
          include: { Profile: true },
        },
      },
      orderBy: { submittedAt: 'asc' },
    });
  }

  async gradeSubmission(
    submissionId: string,
    grade: number,
    feedback?: string,
  ) {
    return this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        grade,
        feedback,
        status: 'GRADED',
      },
    });
  }

  // ==================== ATTENDANCE METHODS ====================

  /**
   * Mark attendance for a classroom on a specific date.
   * Records are stored as JSON: { "userId": "PRESENT" | "ABSENT" | "LATE" | "EXCUSED" }
   * 
   * **Validates: Requirements 2.1, 2.2**
   */
  async markAttendance(
    classroomId: string,
    teacherId: string,
    date: Date,
    records: AttendanceRecords,
  ) {
    // Verify teacher owns this classroom
    const classroom = await this.prisma.classroom.findUnique({
      where: { id: classroomId },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    if (classroom.teacherId !== teacherId) {
      throw new ForbiddenException('Only the teacher can mark attendance');
    }

    // Normalize date to start of day
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    // Upsert attendance record
    return this.prisma.attendanceRecord.upsert({
      where: {
        classroomId_date: {
          classroomId,
          date: normalizedDate,
        },
      },
      update: {
        records: records as any,
      },
      create: {
        id: randomUUID(),
        classroomId,
        date: normalizedDate,
        records: records as any,
      },
    });
  }

  /**
   * Get attendance records for a classroom with optional date range filter.
   * 
   * **Validates: Requirements 2.4**
   */
  async getAttendance(
    classroomId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const where: any = { classroomId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    return this.prisma.attendanceRecord.findMany({
      where,
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Get attendance record for a specific date.
   */
  async getAttendanceByDate(classroomId: string, date: Date) {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    return this.prisma.attendanceRecord.findUnique({
      where: {
        classroomId_date: {
          classroomId,
          date: normalizedDate,
        },
      },
    });
  }

  /**
   * Calculate attendance percentage for a student in a classroom.
   * 
   * **Validates: Requirements 2.3, 2.5**
   */
  async getStudentAttendancePercentage(
    classroomId: string,
    studentId: string,
  ): Promise<{ percentage: number; present: number; total: number }> {
    const records = await this.prisma.attendanceRecord.findMany({
      where: { classroomId },
    });

    let present = 0;
    let total = 0;

    for (const record of records) {
      const attendanceData = record.records as AttendanceRecords;
      if (studentId in attendanceData) {
        total++;
        if (
          attendanceData[studentId] === 'PRESENT' ||
          attendanceData[studentId] === 'LATE'
        ) {
          present++;
        }
      }
    }

    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { percentage, present, total };
  }

  /**
   * Get attendance summary for all students in a classroom.
   */
  async getClassroomAttendanceSummary(classroomId: string) {
    const members = await this.prisma.classroomMember.findMany({
      where: { classroomId, role: 'STUDENT' },
      include: { User: { include: { Profile: true } } },
    });

    const summaries = await Promise.all(
      members.map(async (member) => {
        const stats = await this.getStudentAttendancePercentage(
          classroomId,
          member.userId,
        );
        return {
          userId: member.userId,
          fullName: member.User.Profile?.fullName || 'Unknown',
          avatarUrl: member.User.Profile?.avatarUrl,
          ...stats,
        };
      }),
    );

    return summaries;
  }

  /**
   * Verify assignment completion and award karma points.
   * 
   * **Validates: Requirements 1.6, 1.7**
   */
  async verifyAssignmentCompletion(
    submissionId: string,
    teacherId: string,
    verified: boolean,
    karmaPoints: number = 10,
  ) {
    const submission = await this.prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        Assignment: {
          include: { Classroom: true },
        },
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.Assignment.Classroom.teacherId !== teacherId) {
      throw new ForbiddenException('Only the teacher can verify submissions');
    }

    // Update submission status
    const updatedSubmission = await this.prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: verified ? 'GRADED' : 'PENDING',
      },
    });

    // Award karma points if verified
    if (verified && karmaPoints > 0) {
      await this.prisma.profile.updateMany({
        where: { userId: submission.studentId },
        data: {
          points: { increment: karmaPoints },
        },
      });
    }

    return updatedSubmission;
  }

  /**
   * Get classroom analytics for teacher dashboard.
   * 
   * **Validates: Requirements 1.1**
   */
  async getClassroomAnalytics(classroomId: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id: classroomId },
      include: {
        _count: {
          select: {
            ClassroomMember: true,
            Assignment: true,
            AttendanceRecord: true,
          },
        },
      },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    // Get submission stats
    const assignments = await this.prisma.assignment.findMany({
      where: { classroomId },
      include: {
        _count: {
          select: { Submission: true },
        },
        Submission: {
          where: { status: 'GRADED' },
        },
      },
    });

    const totalSubmissions = assignments.reduce(
      (acc, a) => acc + a._count.Submission,
      0,
    );
    const gradedSubmissions = assignments.reduce(
      (acc, a) => acc + a.Submission.length,
      0,
    );

    // Get average attendance
    const attendanceSummary = await this.getClassroomAttendanceSummary(classroomId);
    const avgAttendance =
      attendanceSummary.length > 0
        ? Math.round(
            attendanceSummary.reduce((acc, s) => acc + s.percentage, 0) /
              attendanceSummary.length,
          )
        : 0;

    return {
      studentCount: classroom._count.ClassroomMember - 1, // Exclude teacher
      assignmentCount: classroom._count.Assignment,
      totalSubmissions,
      gradedSubmissions,
      pendingSubmissions: totalSubmissions - gradedSubmissions,
      averageAttendance: avgAttendance,
      attendanceDays: classroom._count.AttendanceRecord,
    };
  }
}
