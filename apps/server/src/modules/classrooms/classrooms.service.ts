import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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
        name: data.name,
        description: data.description,
        subject: data.subject,
        code,
        collegeId: data.collegeId,
        teacherId: userId,
        members: {
          create: {
            userId,
            role: 'TEACHER', // Creator is automatically the teacher
          },
        },
      },
      include: {
        teacher: { select: { id: true, email: true } }, // Minimal teacher info
      },
    });
  }

  async findAll(userId: string) {
    // Find all classrooms where user is a member (either student or teacher)
    return this.prisma.classroom.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        teacher: {
          include: { profile: true },
        },
        _count: {
          select: { members: true, assignments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id },
      include: {
        teacher: { include: { profile: true } },
        members: {
          include: { user: { include: { profile: true } } },
        },
        assignments: {
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
        classroomId: classroom.id,
        userId,
        role: 'STUDENT',
      },
    });
  }

  async createAssignment(classroomId: string, data: any) {
    return this.prisma.assignment.create({
      data: {
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
          select: { submissions: true },
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
        student: {
          include: { profile: true },
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
}
