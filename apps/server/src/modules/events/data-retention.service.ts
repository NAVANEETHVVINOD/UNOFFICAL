import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { JobType, JobStatus, RegistrationStatus, Prisma } from '@prisma/client';

/**
 * DataRetentionService handles data cleanup and retention policies
 * Validates: Requirements 23.1-23.4, 24.1-24.6
 */
@Injectable()
export class DataRetentionService {
  private readonly logger = new Logger(DataRetentionService.name);

  // Retention period: 14 days after event end
  private readonly RETENTION_DAYS = 14;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Daily cleanup job - soft deletes old registrations
   * Validates: Requirements 23.1, 24.6
   * Runs daily at 3 AM
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async runDailyCleanup(): Promise<void> {
    this.logger.log('Starting daily data cleanup job');

    // Create a background job record
    const job = await this.prisma.backgroundJob.create({
      data: {
        type: JobType.DATA_CLEANUP,
        payload: { startedAt: new Date().toISOString() },
        status: JobStatus.PROCESSING,
      },
    });

    try {
      const result = await this.cleanupOldRegistrations();
      
      // Update job as completed
      await this.prisma.backgroundJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.COMPLETED,
          processedAt: new Date(),
          payload: {
            startedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            ...result,
          },
        },
      });

      this.logger.log(`Daily cleanup completed: ${result.softDeletedCount} registrations soft-deleted`);
    } catch (error) {
      // Update job as failed
      await this.prisma.backgroundJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.FAILED,
          lastError: error instanceof Error ? error.message : 'Unknown error',
          attempts: { increment: 1 },
        },
      });

      this.logger.error('Daily cleanup failed', error);
    }
  }

  /**
   * Soft delete registrations older than retention period
   * Preserves certificates and anonymized analytics
   * Validates: Requirements 23.1, 23.4
   */
  async cleanupOldRegistrations(): Promise<{ softDeletedCount: number; eventsProcessed: number }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.RETENTION_DAYS);

    // Find events that ended more than RETENTION_DAYS ago
    const oldEvents = await this.prisma.event.findMany({
      where: {
        endsAt: { lt: cutoffDate },
        deletedAt: null,
      },
      select: { id: true },
    });

    let softDeletedCount = 0;

    for (const event of oldEvents) {
      // Soft delete registrations (not certificates)
      const result = await this.prisma.eventRegistration.updateMany({
        where: {
          eventId: event.id,
          deletedAt: null,
          // Don't delete registrations that have certificates
          certificateId: null,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      softDeletedCount += result.count;
    }

    return {
      softDeletedCount,
      eventsProcessed: oldEvents.length,
    };
  }

  /**
   * Process user data deletion request
   * Validates: Requirement 23.2
   */
  async processUserDataDeletionRequest(userId: string): Promise<{
    success: boolean;
    deletedRegistrations: number;
    preservedCertificates: number;
  }> {
    // Find all user's registrations for completed events
    const registrations = await this.prisma.eventRegistration.findMany({
      where: {
        userId,
        deletedAt: null,
        event: {
          endsAt: { lt: new Date() }, // Only completed events
        },
      },
      select: {
        id: true,
        certificateId: true,
      },
    });

    let deletedRegistrations = 0;
    let preservedCertificates = 0;

    for (const registration of registrations) {
      if (registration.certificateId) {
        // Preserve certificate but anonymize registration
        await this.prisma.eventRegistration.update({
          where: { id: registration.id },
          data: {
            // Anonymize PII but keep for certificate reference
            formResponses: Prisma.JsonNull,
          },
        });
        preservedCertificates++;
      } else {
        // Soft delete registration
        await this.prisma.eventRegistration.update({
          where: { id: registration.id },
          data: { deletedAt: new Date() },
        });
        deletedRegistrations++;
      }
    }

    this.logger.log(
      `User ${userId} data deletion: ${deletedRegistrations} deleted, ${preservedCertificates} certificates preserved`,
    );

    return {
      success: true,
      deletedRegistrations,
      preservedCertificates,
    };
  }

  /**
   * Get retention status for an event
   */
  async getEventRetentionStatus(eventId: string): Promise<{
    eventEnded: boolean;
    daysUntilCleanup: number | null;
    registrationCount: number;
    certificateCount: number;
  }> {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { endsAt: true },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const now = new Date();
    const eventEnded = event.endsAt < now;
    
    let daysUntilCleanup: number | null = null;
    if (eventEnded) {
      const cleanupDate = new Date(event.endsAt);
      cleanupDate.setDate(cleanupDate.getDate() + this.RETENTION_DAYS);
      daysUntilCleanup = Math.max(0, Math.ceil((cleanupDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    }

    const registrationCount = await this.prisma.eventRegistration.count({
      where: { eventId, deletedAt: null },
    });

    const certificateCount = await this.prisma.eventCertificate.count({
      where: { eventId },
    });

    return {
      eventEnded,
      daysUntilCleanup,
      registrationCount,
      certificateCount,
    };
  }

  /**
   * Retry failed jobs with exponential backoff
   * Validates: Requirements 24.2, 24.3
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async retryFailedJobs(): Promise<void> {
    const failedJobs = await this.prisma.backgroundJob.findMany({
      where: {
        status: JobStatus.FAILED,
        attempts: { lt: 3 }, // Max 3 attempts
      },
      orderBy: { createdAt: 'asc' },
      take: 10,
    });

    for (const job of failedJobs) {
      // Exponential backoff: 1min, 4min, 16min
      const backoffMinutes = Math.pow(4, job.attempts);
      const nextAttemptTime = new Date(job.processedAt || job.createdAt);
      nextAttemptTime.setMinutes(nextAttemptTime.getMinutes() + backoffMinutes);

      if (new Date() < nextAttemptTime) {
        continue; // Not time to retry yet
      }

      this.logger.log(`Retrying job ${job.id} (attempt ${job.attempts + 1})`);

      try {
        await this.prisma.backgroundJob.update({
          where: { id: job.id },
          data: { status: JobStatus.PROCESSING },
        });

        // Process based on job type
        switch (job.type) {
          case JobType.DATA_CLEANUP:
            await this.cleanupOldRegistrations();
            break;
          // Add other job types as needed
        }

        await this.prisma.backgroundJob.update({
          where: { id: job.id },
          data: {
            status: JobStatus.COMPLETED,
            processedAt: new Date(),
          },
        });
      } catch (error) {
        const newAttempts = job.attempts + 1;
        const newStatus = newAttempts >= 3 ? JobStatus.DEAD_LETTER : JobStatus.FAILED;

        await this.prisma.backgroundJob.update({
          where: { id: job.id },
          data: {
            status: newStatus,
            attempts: newAttempts,
            lastError: error instanceof Error ? error.message : 'Unknown error',
            processedAt: new Date(),
          },
        });

        if (newStatus === JobStatus.DEAD_LETTER) {
          this.logger.error(`Job ${job.id} moved to dead letter queue after ${newAttempts} attempts`);
        }
      }
    }
  }

  /**
   * Get dead letter queue jobs for admin review
   * Validates: Requirement 24.4
   */
  async getDeadLetterJobs(): Promise<any[]> {
    return this.prisma.backgroundJob.findMany({
      where: { status: JobStatus.DEAD_LETTER },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
