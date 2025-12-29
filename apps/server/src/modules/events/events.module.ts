import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TicketsService } from './tickets.service';
import { PaymentsService } from './payments.service';
import { QrService } from './qr.service';
import { RolesService } from './roles.service';
import { CheckInService } from './checkin.service';
import { LifecycleService } from './lifecycle.service';
import { WaitlistService } from './waitlist.service';
import { FormService } from './forms.service';
import { ExportService } from './export.service';
import { CertificateService } from './certificate.service';
import { EventNotificationService } from './event-notifications.service';
import { AnalyticsService } from './analytics.service';
import { DataRetentionService } from './data-retention.service';
import { AdminService } from './admin.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [EventsController],
  providers: [
    EventsService,
    TicketsService,
    PaymentsService,
    QrService,
    RolesService,
    CheckInService,
    LifecycleService,
    WaitlistService,
    FormService,
    ExportService,
    CertificateService,
    EventNotificationService,
    AnalyticsService,
    DataRetentionService,
    AdminService,
  ],
  exports: [
    TicketsService,
    PaymentsService,
    RolesService,
    CheckInService,
    LifecycleService,
    WaitlistService,
    FormService,
    ExportService,
    CertificateService,
    EventNotificationService,
    AnalyticsService,
    DataRetentionService,
    AdminService,
  ],
})
export class EventsModule {}
