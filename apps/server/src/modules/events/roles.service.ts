import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventRoleType, NotificationType } from '@prisma/client';

/**
 * Event actions that can be performed by users with roles
 * Validates: Requirements 7.1-7.11, 19.1-19.7
 */
export type EventAction =
  | 'EDIT_EVENT'
  | 'DELETE_EVENT'
  | 'MANAGE_TICKETS'
  | 'PROCESS_REFUNDS'
  | 'ASSIGN_ROLES'
  | 'EXPORT_DATA'
  | 'SCAN_QR'
  | 'VIEW_ATTENDEES'
  | 'VIEW_CONTACT_INFO'
  | 'SEND_MESSAGES'
  | 'ISSUE_CERTIFICATES'
  | 'MANUAL_CHECKIN';

/**
 * Permission matrix defining which roles can perform which actions
 * Property 5: Role Permission Matrix
 */
export const ROLE_PERMISSIONS: Record<EventRoleType, EventAction[]> = {
  // Creator: Full permissions (Requirement 7.2)
  CREATOR: [
    'EDIT_EVENT',
    'DELETE_EVENT',
    'MANAGE_TICKETS',
    'PROCESS_REFUNDS',
    'ASSIGN_ROLES',
    'EXPORT_DATA',
    'SCAN_QR',
    'VIEW_ATTENDEES',
    'VIEW_CONTACT_INFO',
    'SEND_MESSAGES',
    'ISSUE_CERTIFICATES',
    'MANUAL_CHECKIN',
  ],
  // Co-Organizer: Management without role assignment or deletion (Requirements 7.3, 7.4)
  CO_ORGANIZER: [
    'EDIT_EVENT',
    'MANAGE_TICKETS',
    'PROCESS_REFUNDS',
    'VIEW_ATTENDEES',
    'VIEW_CONTACT_INFO',
    'SEND_MESSAGES',
    'SCAN_QR',
    'MANUAL_CHECKIN',
    'ISSUE_CERTIFICATES',
  ],
  // Head: QR scanning and limited attendee view (Requirements 7.5, 7.6)
  HEAD: [
    'SCAN_QR',
    'VIEW_ATTENDEES',
    'MANUAL_CHECKIN',
  ],
  // Volunteer: QR scanning only (Requirements 7.7, 7.8)
  VOLUNTEER: [
    'SCAN_QR',
  ],
};

export interface RoleAssignment {
  id: string;
  userId: string;
  role: EventRoleType;
  assignedBy: string;
  createdAt: Date;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface RoleAuditLog {
  action: 'ASSIGN' | 'REMOVE';
  eventId: string;
  userId: string;
  role: EventRoleType;
  performedBy: string;
  timestamp: Date;
  reason?: string;
}

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Assign a role to a user for an event
   * Validates: Requirements 7.9, 7.10, 7.11, 19.2, 19.7
   */
  async assignRole(
    eventId: string,
    userId: string,
    role: EventRoleType,
    assignerId: string,
  ): Promise<void> {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, createdById: true, title: true, endsAt: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Verify assigner has permission to assign roles
    const assignerRole = await this.getUserRole(eventId, assignerId);
    if (!assignerRole || !this.canPerformAction(assignerRole, 'ASSIGN_ROLES')) {
      throw new ForbiddenException('You do not have permission to assign roles');
    }

    // Verify target user exists
    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, profile: { select: { fullName: true } } },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    // Cannot assign CREATOR role (only one creator per event)
    if (role === EventRoleType.CREATOR) {
      throw new BadRequestException('Cannot assign CREATOR role');
    }

    // Check if user already has a role
    const existingRole = await this.prisma.eventMemberRole.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });

    if (existingRole) {
      // Update existing role
      await this.prisma.eventMemberRole.update({
        where: { id: existingRole.id },
        data: { role, assignedBy: assignerId },
      });
    } else {
      // Create new role assignment
      await this.prisma.eventMemberRole.create({
        data: {
          eventId,
          userId,
          role,
          assignedBy: assignerId,
        },
      });
    }

    // Log the assignment (Requirement 7.11, 19.7)
    this.logRoleChange('ASSIGN', eventId, userId, role, assignerId);

    // Send notification to user (Requirement 7.10)
    await this.prisma.notification.create({
      data: {
        userId,
        type: NotificationType.EVENT,
        title: 'Role Assigned',
        message: `You have been assigned as ${this.formatRoleName(role)} for "${event.title}"`,
        actionUrl: `/events/${eventId}`,
      },
    });

    this.logger.log(`Role ${role} assigned to user ${userId} for event ${eventId} by ${assignerId}`);
  }


  /**
   * Remove a role from a user for an event
   * Validates: Requirements 19.6
   */
  async removeRole(
    eventId: string,
    userId: string,
    removerId: string,
    reason?: string,
  ): Promise<void> {
    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, createdById: true, title: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Verify remover has permission to assign/remove roles
    const removerRole = await this.getUserRole(eventId, removerId);
    if (!removerRole || !this.canPerformAction(removerRole, 'ASSIGN_ROLES')) {
      throw new ForbiddenException('You do not have permission to remove roles');
    }

    // Get the role being removed
    const roleToRemove = await this.prisma.eventMemberRole.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });

    if (!roleToRemove) {
      throw new NotFoundException('Role assignment not found');
    }

    // Cannot remove CREATOR role (Requirement 19.6)
    if (roleToRemove.role === EventRoleType.CREATOR) {
      throw new BadRequestException('Cannot remove CREATOR role. Transfer ownership instead.');
    }

    // Cannot remove yourself if you're the creator
    if (userId === removerId && removerRole === EventRoleType.CREATOR) {
      throw new BadRequestException('Creator cannot remove themselves. Transfer ownership first.');
    }

    // Delete the role assignment
    await this.prisma.eventMemberRole.delete({
      where: { id: roleToRemove.id },
    });

    // Log the removal (Requirement 7.11, 19.7)
    this.logRoleChange('REMOVE', eventId, userId, roleToRemove.role, removerId, reason);

    // Send notification to user
    await this.prisma.notification.create({
      data: {
        userId,
        type: NotificationType.EVENT,
        title: 'Role Removed',
        message: `Your role as ${this.formatRoleName(roleToRemove.role)} for "${event.title}" has been removed`,
        actionUrl: `/events/${eventId}`,
      },
    });

    this.logger.log(`Role ${roleToRemove.role} removed from user ${userId} for event ${eventId} by ${removerId}`);
  }

  /**
   * Get all role assignments for an event
   */
  async getRoles(eventId: string): Promise<RoleAssignment[]> {
    const roles = await this.prisma.eventMemberRole.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            profile: {
              select: { fullName: true },
            },
          },
        },
      },
      orderBy: [
        { role: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    return roles.map((r) => ({
      id: r.id,
      userId: r.userId,
      role: r.role,
      assignedBy: r.assignedBy,
      createdAt: r.createdAt,
      user: {
        id: r.user.id,
        fullName: r.user.profile?.fullName || 'Unknown',
        email: r.user.email || '',
      },
    }));
  }

  /**
   * Get a user's role for an event
   * Returns null if user has no role
   */
  async getUserRole(eventId: string, userId: string): Promise<EventRoleType | null> {
    // First check if user is the event creator
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { createdById: true },
    });

    if (event?.createdById === userId) {
      return EventRoleType.CREATOR;
    }

    // Check for assigned role
    const roleAssignment = await this.prisma.eventMemberRole.findUnique({
      where: { eventId_userId: { eventId, userId } },
    });

    return roleAssignment?.role || null;
  }

  /**
   * Check if a user has permission to perform an action
   * Property 5: Role Permission Matrix
   * Validates: Requirements 7.1-7.11, 19.1-19.7
   */
  async hasPermission(
    eventId: string,
    userId: string,
    action: EventAction,
  ): Promise<boolean> {
    const role = await this.getUserRole(eventId, userId);
    
    if (!role) {
      return false;
    }

    // Special check for volunteer scanning after event end (Requirement 19.5)
    if (role === EventRoleType.VOLUNTEER && action === 'SCAN_QR') {
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
        select: { endsAt: true },
      });

      if (event && new Date() > event.endsAt) {
        return false;
      }
    }

    return this.canPerformAction(role, action);
  }

  /**
   * Check if a role can perform an action (pure function for testing)
   * Property 5: Role Permission Matrix
   */
  canPerformAction(role: EventRoleType, action: EventAction): boolean {
    const allowedActions = ROLE_PERMISSIONS[role];
    return allowedActions.includes(action);
  }


  /**
   * Get all actions a role is allowed to perform
   */
  getAllowedActions(role: EventRoleType): EventAction[] {
    return [...ROLE_PERMISSIONS[role]];
  }

  /**
   * Get all actions a role is denied from performing
   */
  getDeniedActions(role: EventRoleType): EventAction[] {
    const allActions: EventAction[] = [
      'EDIT_EVENT',
      'DELETE_EVENT',
      'MANAGE_TICKETS',
      'PROCESS_REFUNDS',
      'ASSIGN_ROLES',
      'EXPORT_DATA',
      'SCAN_QR',
      'VIEW_ATTENDEES',
      'VIEW_CONTACT_INFO',
      'SEND_MESSAGES',
      'ISSUE_CERTIFICATES',
      'MANUAL_CHECKIN',
    ];
    const allowedActions = ROLE_PERMISSIONS[role];
    return allActions.filter((action) => !allowedActions.includes(action));
  }

  /**
   * Search users by username or email for role assignment
   * Validates: Requirement 7.9
   */
  async searchUsersForRole(
    query: string,
    eventId: string,
    limit: number = 10,
  ): Promise<Array<{ id: string; fullName: string; email: string; hasRole: boolean }>> {
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { profile: { fullName: { contains: query, mode: 'insensitive' } } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        email: true,
        profile: {
          select: { fullName: true },
        },
        eventRoles: {
          where: { eventId },
          select: { id: true },
        },
      },
      take: limit,
    });

    return users.map((u) => ({
      id: u.id,
      fullName: u.profile?.fullName || 'Unknown',
      email: u.email || '',
      hasRole: u.eventRoles.length > 0,
    }));
  }

  /**
   * Get role audit log for an event
   * Validates: Requirements 7.11, 19.7
   */
  async getRoleAuditLog(eventId: string): Promise<RoleAuditLog[]> {
    // In a production system, this would query a dedicated audit log table
    // For now, we return an empty array as audit logs are stored via logger
    this.logger.log(`Fetching role audit log for event ${eventId}`);
    return [];
  }

  /**
   * Log role changes for audit
   * Validates: Requirements 7.11, 19.7
   */
  private logRoleChange(
    action: 'ASSIGN' | 'REMOVE',
    eventId: string,
    userId: string,
    role: EventRoleType,
    performedBy: string,
    reason?: string,
  ): void {
    const logEntry: RoleAuditLog = {
      action,
      eventId,
      userId,
      role,
      performedBy,
      timestamp: new Date(),
      reason,
    };

    this.logger.log(
      `ROLE_AUDIT: ${JSON.stringify(logEntry)}`,
    );
  }

  /**
   * Format role name for display
   */
  private formatRoleName(role: EventRoleType): string {
    const names: Record<EventRoleType, string> = {
      CREATOR: 'Creator',
      CO_ORGANIZER: 'Co-Organizer',
      HEAD: 'Head',
      VOLUNTEER: 'Volunteer',
    };
    return names[role];
  }

  /**
   * Transfer event ownership to another user
   * Validates: Requirement 19.6
   */
  async transferOwnership(
    eventId: string,
    newOwnerId: string,
    currentOwnerId: string,
  ): Promise<void> {
    // Verify event exists and current user is the creator
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, createdById: true, title: true },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.createdById !== currentOwnerId) {
      throw new ForbiddenException('Only the creator can transfer ownership');
    }

    // Verify new owner exists
    const newOwner = await this.prisma.user.findUnique({
      where: { id: newOwnerId },
      select: { id: true, profile: { select: { fullName: true } } },
    });

    if (!newOwner) {
      throw new NotFoundException('New owner not found');
    }

    // Cannot transfer to yourself
    if (newOwnerId === currentOwnerId) {
      throw new BadRequestException('Cannot transfer ownership to yourself');
    }

    await this.prisma.$transaction(async (tx) => {
      // Update event creator
      await tx.event.update({
        where: { id: eventId },
        data: { createdById: newOwnerId },
      });

      // Remove any existing role for new owner (they're now creator)
      await tx.eventMemberRole.deleteMany({
        where: { eventId, userId: newOwnerId },
      });

      // Optionally assign old owner as co-organizer
      await tx.eventMemberRole.create({
        data: {
          eventId,
          userId: currentOwnerId,
          role: EventRoleType.CO_ORGANIZER,
          assignedBy: newOwnerId,
        },
      });
    });

    // Log the transfer
    this.logger.log(
      `OWNERSHIP_TRANSFER: Event ${eventId} transferred from ${currentOwnerId} to ${newOwnerId}`,
    );

    // Notify both users
    await this.prisma.notification.createMany({
      data: [
        {
          userId: newOwnerId,
          type: NotificationType.EVENT,
          title: 'Ownership Transferred',
          message: `You are now the owner of "${event.title}"`,
          actionUrl: `/events/${eventId}`,
        },
        {
          userId: currentOwnerId,
          type: NotificationType.EVENT,
          title: 'Ownership Transferred',
          message: `You have transferred ownership of "${event.title}" and are now a Co-Organizer`,
          actionUrl: `/events/${eventId}`,
        },
      ],
    });
  }
}
