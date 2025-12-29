import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TicketsService } from './tickets.service';
import { PaymentsService } from './payments.service';
import { RolesService } from './roles.service';
import { CheckInService } from './checkin.service';
import { AnalyticsService } from './analytics.service';
import { EventNotificationService } from './event-notifications.service';
import { WaitlistService } from './waitlist.service';
import { FormService } from './forms.service';
import { ExportService } from './export.service';
import { CertificateService } from './certificate.service';

describe('EventsController', () => {
  let controller: EventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByScope: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            publish: jest.fn(),
            cancel: jest.fn(),
            archive: jest.fn(),
            getUserRole: jest.fn(),
            rsvp: jest.fn(),
            generateQr: jest.fn(),
            checkIn: jest.fn(),
          },
        },
        {
          provide: TicketsService,
          useValue: {
            getAvailability: jest.fn(),
            reserveTicket: jest.fn(),
            getUserRegistration: jest.fn(),
            releaseReservation: jest.fn(),
            getEventRegistrations: jest.fn(),
            getUserRegisteredEvents: jest.fn(),
          },
        },
        {
          provide: PaymentsService,
          useValue: {
            calculateFees: jest.fn(),
            createOrder: jest.fn(),
            verifyPayment: jest.fn(),
            processWebhook: jest.fn(),
            manualVerifyPayment: jest.fn(),
            getPaymentDetails: jest.fn(),
            initiateRefund: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {
            getRoles: jest.fn(),
            assignRole: jest.fn(),
            removeRole: jest.fn(),
            transferOwnership: jest.fn(),
            searchUsersForRole: jest.fn(),
            hasPermission: jest.fn(),
          },
        },
        {
          provide: CheckInService,
          useValue: {
            checkIn: jest.fn(),
            manualCheckIn: jest.fn(),
            checkOut: jest.fn(),
            getCheckInStats: jest.fn(),
            getRecentCheckIns: jest.fn(),
            searchAttendees: jest.fn(),
            generateQrCode: jest.fn(),
          },
        },
        {
          provide: AnalyticsService,
          useValue: {
            getAnalyticsSummary: jest.fn(),
            getEventMetrics: jest.fn(),
            getRegistrationTimeline: jest.fn(),
            getTicketBreakdown: jest.fn(),
            getDropOffFunnel: jest.fn(),
            getDailyAttendance: jest.fn(),
          },
        },
        {
          provide: EventNotificationService,
          useValue: {
            sendRegistrationConfirmation: jest.fn(),
            sendEventUpdate: jest.fn(),
            sendCancellationNotification: jest.fn(),
            sendCertificateNotification: jest.fn(),
            sendWaitlistNotification: jest.fn(),
            sendOrganizerMessage: jest.fn(),
            getMessageHistory: jest.fn(),
          },
        },
        {
          provide: WaitlistService,
          useValue: {
            joinWaitlist: jest.fn(),
            leaveWaitlist: jest.fn(),
            getPosition: jest.fn(),
            claimTicket: jest.fn(),
            getWaitlistStats: jest.fn(),
            processExpiredNotifications: jest.fn(),
            notifyNextInLine: jest.fn(),
          },
        },
        {
          provide: FormService,
          useValue: {
            saveFormSchema: jest.fn(),
            getFormSchema: jest.fn(),
            deleteFormSchema: jest.fn(),
            validateResponses: jest.fn(),
            storeResponses: jest.fn(),
            getResponses: jest.fn(),
            getAllResponses: jest.fn(),
            createDefaultSchema: jest.fn(),
          },
        },
        {
          provide: ExportService,
          useValue: {
            exportAttendeesToCsv: jest.fn(),
            exportAttendeesToXlsx: jest.fn(),
          },
        },
        {
          provide: CertificateService,
          useValue: {
            getTemplates: jest.fn(),
            getTemplate: jest.fn(),
            issueCertificate: jest.fn(),
            autoIssueCertificates: jest.fn(),
            getCertificate: jest.fn(),
            getUserCertificates: jest.fn(),
            getEventCertificates: jest.fn(),
            isEligibleForCertificate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
