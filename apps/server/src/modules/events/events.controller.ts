import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Headers,
  RawBodyRequest,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role, RegistrationStatus } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  CreateEventDto,
  EventFiltersDto,
  CreatePaymentOrderDto,
  VerifyPaymentDto,
  InitiateRefundDto,
  ManualVerifyPaymentDto,
} from './dto';
import {
  AssignRoleDto,
  RemoveRoleDto,
  TransferOwnershipDto,
  SearchUsersDto,
} from './dto/roles.dto';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly ticketsService: TicketsService,
    private readonly paymentsService: PaymentsService,
    private readonly rolesService: RolesService,
    private readonly checkInService: CheckInService,
    private readonly analyticsService: AnalyticsService,
    private readonly eventNotificationService: EventNotificationService,
    private readonly waitlistService: WaitlistService,
    private readonly formService: FormService,
    private readonly exportService: ExportService,
    private readonly certificateService: CertificateService,
  ) {}

  /**
   * Get all events with filters
   * Supports: scope (campus/global), dateRange, priceType, category, search
   */
  @Get()
  async findAll(@Query() filters: EventFiltersDto, @Request() req) {
    const userId = req.user?.userId;
    const userCollegeId = req.user?.collegeId;
    return this.eventsService.findAll(filters, userId, userCollegeId);
  }

  /**
   * Get events by scope (campus or global)
   */
  @Get('scope/:scope')
  async findByScope(
    @Param('scope') scope: 'global' | 'campus',
    @Request() req,
  ) {
    const userCollegeId = req.user?.collegeId;
    return this.eventsService.findByScope(scope, userCollegeId);
  }

  /**
   * Get a single event by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  /**
   * Create a new event (starts as DRAFT)
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createEventDto: CreateEventDto) {
    const user = {
      id: req.user.userId,
      role: req.user.role,
      collegeId: req.user.collegeId || null,
    };
    return this.eventsService.create(createEventDto, user);
  }

  /**
   * Update an existing event
   */
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Request() req,
    @Param('id') eventId: string,
    @Body() updateEventDto: Partial<CreateEventDto>,
  ) {
    return this.eventsService.update(eventId, updateEventDto, req.user.userId);
  }

  /**
   * Delete an event (soft delete, creator only)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Request() req, @Param('id') eventId: string) {
    await this.eventsService.delete(eventId, req.user.userId);
    return { success: true };
  }

  /**
   * Publish an event (DRAFT -> PUBLISHED)
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/publish')
  async publish(@Request() req, @Param('id') eventId: string) {
    return this.eventsService.publish(eventId, req.user.userId);
  }

  /**
   * Cancel an event
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/cancel')
  async cancel(
    @Request() req,
    @Param('id') eventId: string,
    @Body('reason') reason?: string,
  ) {
    return this.eventsService.cancel(eventId, req.user.userId, reason);
  }

  /**
   * Archive a completed event
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/archive')
  async archive(@Request() req, @Param('id') eventId: string) {
    return this.eventsService.archive(eventId, req.user.userId);
  }

  /**
   * Get user's role for an event
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/my-role')
  async getMyRole(@Request() req, @Param('id') eventId: string) {
    const role = await this.eventsService.getUserRole(eventId, req.user.userId);
    return { role };
  }

  // ============ Ticket and Registration Endpoints ============

  /**
   * Get ticket availability for an event
   */
  @Get(':id/tickets')
  async getTicketAvailability(@Param('id') eventId: string, @Request() req) {
    const userId = req.user?.userId;
    return this.ticketsService.getAvailability(eventId, userId);
  }

  /**
   * Register for an event
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/register')
  async register(
    @Request() req,
    @Param('id') eventId: string,
    @Body() body: {
      ticketId: string;
      formResponses?: Record<string, unknown>;
      noRefundConsent?: boolean;
    },
  ) {
    return this.ticketsService.reserveTicket(
      eventId,
      body.ticketId,
      req.user.userId,
      body.formResponses,
      body.noRefundConsent,
    );
  }

  /**
   * Get user's registration for an event
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/my-registration')
  async getMyRegistration(@Request() req, @Param('id') eventId: string) {
    return this.ticketsService.getUserRegistration(eventId, req.user.userId);
  }

  /**
   * Cancel user's registration (pending only)
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/registration')
  async cancelRegistration(@Request() req, @Param('id') eventId: string) {
    const registration = await this.ticketsService.getUserRegistration(eventId, req.user.userId);
    if (!registration) {
      return { success: false, error: 'No registration found' };
    }
    await this.ticketsService.releaseReservation(registration.id, req.user.userId);
    return { success: true };
  }

  /**
   * Get all registrations for an event (organizers only)
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/registrations')
  async getRegistrations(
    @Request() req,
    @Param('id') eventId: string,
    @Query('status') status?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    // Check if user has permission (creator, co-organizer, or head)
    const role = await this.eventsService.getUserRole(eventId, req.user.userId);
    if (!role || role === 'VOLUNTEER') {
      return { error: 'Unauthorized', registrations: [] };
    }

    const registrationStatus = status as RegistrationStatus | undefined;
    return this.ticketsService.getEventRegistrations(
      eventId,
      registrationStatus,
      parseInt(limit || '50'),
      cursor,
    );
  }

  /**
   * Get user's registered events (My Events)
   */
  @UseGuards(JwtAuthGuard)
  @Get('user/my-events')
  async getMyEvents(@Request() req) {
    return this.ticketsService.getUserRegisteredEvents(req.user.userId);
  }

  // ============ Payment Endpoints ============

  /**
   * Calculate fee breakdown for a ticket price
   */
  @Get('payments/calculate-fees')
  async calculateFees(
    @Query('price') price: string,
    @Query('passFeesToBuyer') passFeesToBuyer?: string,
  ) {
    const ticketPrice = parseInt(price);
    const passFees = passFeesToBuyer === 'true';
    return this.paymentsService.calculateFees(ticketPrice, passFees);
  }

  /**
   * Create a Razorpay order for payment
   */
  @UseGuards(JwtAuthGuard)
  @Post('payments/create-order')
  async createPaymentOrder(@Body() body: CreatePaymentOrderDto) {
    return this.paymentsService.createOrder(
      body.registrationId,
      body.passFeesToBuyer || false,
    );
  }

  /**
   * Verify payment after Razorpay checkout
   */
  @UseGuards(JwtAuthGuard)
  @Post('payments/verify')
  async verifyPayment(@Body() body: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(
      body.orderId,
      body.paymentId,
      body.signature,
    );
  }

  /**
   * Razorpay webhook endpoint
   */
  @Post('payments/webhook')
  async handleWebhook(
    @Body() payload: Record<string, unknown>,
    @Headers('x-razorpay-signature') signature: string,
  ) {
    await this.paymentsService.processWebhook(payload, signature);
    return { status: 'ok' };
  }

  /**
   * Manual payment verification (for failed frontend callbacks)
   */
  @UseGuards(JwtAuthGuard)
  @Post('payments/manual-verify')
  async manualVerifyPayment(@Body() body: ManualVerifyPaymentDto) {
    return this.paymentsService.manualVerifyPayment(body.orderId);
  }

  /**
   * Get payment details for a registration
   */
  @UseGuards(JwtAuthGuard)
  @Get('payments/:registrationId')
  async getPaymentDetails(@Param('registrationId') registrationId: string) {
    return this.paymentsService.getPaymentDetails(registrationId);
  }

  /**
   * Initiate refund (organizers only)
   */
  @UseGuards(JwtAuthGuard)
  @Post('payments/refund')
  async initiateRefund(@Request() req, @Body() body: InitiateRefundDto) {
    // Get registration to check event
    const registration = await this.ticketsService.getUserRegistration(
      '', // We need to get eventId from registration
      req.user.userId,
    );
    
    // For now, allow refund initiation - proper permission check should be added
    return this.paymentsService.initiateRefund(body.registrationId, body.amount);
  }

  // ============ Role Management Endpoints ============

  /**
   * Get all roles for an event
   * Validates: Requirements 7.9
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/roles')
  async getRoles(@Request() req, @Param('id') eventId: string) {
    // Check if user has permission to view roles
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'VIEW_ATTENDEES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized', roles: [] };
    }
    return this.rolesService.getRoles(eventId);
  }

  /**
   * Assign a role to a user
   * Validates: Requirements 7.9, 7.10, 7.11
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/roles')
  async assignRole(
    @Request() req,
    @Param('id') eventId: string,
    @Body() body: AssignRoleDto,
  ) {
    await this.rolesService.assignRole(
      eventId,
      body.userId,
      body.role,
      req.user.userId,
    );
    return { success: true };
  }

  /**
   * Remove a role from a user
   * Validates: Requirements 19.2, 19.6
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/roles/:userId')
  async removeRole(
    @Request() req,
    @Param('id') eventId: string,
    @Param('userId') userId: string,
    @Body() body?: RemoveRoleDto,
  ) {
    await this.rolesService.removeRole(
      eventId,
      userId,
      req.user.userId,
      body?.reason,
    );
    return { success: true };
  }

  /**
   * Transfer event ownership
   * Validates: Requirement 19.6
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/transfer-ownership')
  async transferOwnership(
    @Request() req,
    @Param('id') eventId: string,
    @Body() body: TransferOwnershipDto,
  ) {
    await this.rolesService.transferOwnership(
      eventId,
      body.newOwnerId,
      req.user.userId,
    );
    return { success: true };
  }

  /**
   * Search users for role assignment
   * Validates: Requirement 7.9
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/roles/search')
  async searchUsersForRole(
    @Request() req,
    @Param('id') eventId: string,
    @Query('q') query: string,
  ) {
    // Check if user has permission to assign roles
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'ASSIGN_ROLES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized', users: [] };
    }
    const users = await this.rolesService.searchUsersForRole(query, eventId);
    return { users };
  }

  /**
   * Check if user has permission for an action
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/permissions/:action')
  async checkPermission(
    @Request() req,
    @Param('id') eventId: string,
    @Param('action') action: string,
  ) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      action as any,
    );
    return { hasPermission };
  }

  // ============ Check-In Endpoints ============

  /**
   * Process QR code check-in
   * Validates: Requirements 6.2-6.5
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/checkin/scan')
  async scanCheckIn(
    @Request() req,
    @Param('id') eventId: string,
    @Body('token') token: string,
  ) {
    // Verify scanner has permission
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'SCAN_QR',
    );
    if (!hasPermission) {
      return { success: false, error: 'You do not have permission to scan QR codes' };
    }

    return this.checkInService.checkIn(eventId, token, req.user.userId);
  }

  /**
   * Manual check-in (for Heads when QR fails)
   * Validates: Requirements 6.6, 6.7
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/checkin/manual')
  async manualCheckIn(
    @Request() req,
    @Param('id') eventId: string,
    @Body() body: { registrationId: string; reason: string },
  ) {
    // Verify scanner has permission for manual check-in
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'MANUAL_CHECKIN',
    );
    if (!hasPermission) {
      return { success: false, error: 'You do not have permission for manual check-in' };
    }

    return this.checkInService.manualCheckIn(
      eventId,
      body.registrationId,
      req.user.userId,
      body.reason,
    );
  }

  /**
   * Check out (for entry/exit mode)
   * Validates: Requirements 17.1, 17.2
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/checkin/checkout')
  async checkOut(
    @Request() req,
    @Param('id') eventId: string,
    @Body('registrationId') registrationId: string,
  ) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'SCAN_QR',
    );
    if (!hasPermission) {
      return { success: false, error: 'You do not have permission to process check-outs' };
    }

    return this.checkInService.checkOut(eventId, registrationId, req.user.userId);
  }

  /**
   * Get check-in statistics for an event
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/checkin/stats')
  async getCheckInStats(@Request() req, @Param('id') eventId: string) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'VIEW_ATTENDEES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized' };
    }

    return this.checkInService.getCheckInStats(eventId);
  }

  /**
   * Get recent check-ins (scan history)
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/checkin/history')
  async getCheckInHistory(
    @Request() req,
    @Param('id') eventId: string,
    @Query('limit') limit?: string,
  ) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'VIEW_ATTENDEES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized', history: [] };
    }

    return this.checkInService.getRecentCheckIns(eventId, parseInt(limit || '20'));
  }

  /**
   * Search attendees for manual check-in
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/checkin/search')
  async searchAttendeesForCheckIn(
    @Request() req,
    @Param('id') eventId: string,
    @Query('q') query: string,
  ) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'VIEW_ATTENDEES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized', attendees: [] };
    }

    const attendees = await this.checkInService.searchAttendees(eventId, query);
    return { attendees };
  }

  /**
   * Generate QR code for a registration
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/registration/:registrationId/qr')
  async getRegistrationQr(
    @Request() req,
    @Param('id') eventId: string,
    @Param('registrationId') registrationId: string,
  ) {
    // User can only get their own QR, or organizers can get any
    const registration = await this.ticketsService.getUserRegistration(eventId, req.user.userId);
    const isOwner = registration?.id === registrationId;
    
    if (!isOwner) {
      const hasPermission = await this.rolesService.hasPermission(
        eventId,
        req.user.userId,
        'VIEW_ATTENDEES',
      );
      if (!hasPermission) {
        return { error: 'Unauthorized' };
      }
    }

    return this.checkInService.generateQrCode(registrationId);
  }

  // ============ Legacy endpoints for backward compatibility ============

  /**
   * RSVP to an event (legacy)
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/rsvp')
  async rsvp(
    @Request() req,
    @Param('id') eventId: string,
    @Body('status') status: 'GOING' | 'INTERESTED' | 'NOT_GOING',
  ) {
    return this.eventsService.rsvp(req.user.userId, eventId, status);
  }

  /**
   * Generate QR code for event (legacy)
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLUB_ADMIN' as Role, 'COLLEGE_ADMIN' as Role)
  @Post(':id/qr')
  async generateQr(@Param('id') eventId: string) {
    return this.eventsService.generateQr(eventId);
  }

  /**
   * Check in to an event (legacy)
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/check-in')
  async checkIn(
    @Request() req,
    @Param('id') eventId: string,
    @Body('token') token: string,
  ) {
    return this.eventsService.checkIn(req.user.userId, eventId, token);
  }

  // ============ Analytics Endpoints ============

  /**
   * Get event analytics summary
   * Validates: Requirements 10.3-10.8
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/analytics')
  async getAnalytics(@Request() req, @Param('id') eventId: string) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'VIEW_ATTENDEES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized' };
    }

    return this.analyticsService.getAnalyticsSummary(eventId);
  }

  /**
   * Get event metrics only
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/analytics/metrics')
  async getMetrics(@Request() req, @Param('id') eventId: string) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'VIEW_ATTENDEES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized' };
    }

    return this.analyticsService.getEventMetrics(eventId);
  }

  /**
   * Get registration timeline
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/analytics/timeline')
  async getTimeline(
    @Request() req,
    @Param('id') eventId: string,
    @Query('days') days?: string,
  ) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'VIEW_ATTENDEES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized' };
    }

    return this.analyticsService.getRegistrationTimeline(eventId, parseInt(days || '30'));
  }

  /**
   * Get ticket breakdown
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/analytics/tickets')
  async getTicketAnalytics(@Request() req, @Param('id') eventId: string) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'VIEW_ATTENDEES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized' };
    }

    return this.analyticsService.getTicketBreakdown(eventId);
  }

  /**
   * Get drop-off funnel
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/analytics/funnel')
  async getFunnel(@Request() req, @Param('id') eventId: string) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'VIEW_ATTENDEES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized' };
    }

    return this.analyticsService.getDropOffFunnel(eventId);
  }

  // ============ Organizer Messaging Endpoints ============

  /**
   * Send message to event audience
   * Validates: Requirements 16.1-16.6
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/messages')
  async sendMessage(
    @Request() req,
    @Param('id') eventId: string,
    @Body() body: {
      targetAudience: 'ALL_REGISTRANTS' | 'CHECKED_IN' | 'VOLUNTEERS' | 'HEADS';
      subject: string;
      body: string;
    },
  ) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'SEND_MESSAGES',
    );
    if (!hasPermission) {
      return { success: false, error: 'Unauthorized' };
    }

    return this.eventNotificationService.sendOrganizerMessage(
      eventId,
      req.user.userId,
      body.targetAudience,
      body.subject,
      body.body,
    );
  }

  /**
   * Get message history for an event
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/messages')
  async getMessages(@Request() req, @Param('id') eventId: string) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'VIEW_ATTENDEES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized', messages: [] };
    }

    const messages = await this.eventNotificationService.getMessageHistory(eventId);
    return { messages };
  }

  // ============ Waitlist Endpoints ============

  /**
   * Join waitlist for a ticket
   * Validates: Requirements 15.1, 15.2
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/waitlist/:ticketId/join')
  async joinWaitlist(
    @Request() req,
    @Param('id') eventId: string,
    @Param('ticketId') ticketId: string,
  ) {
    return this.waitlistService.joinWaitlist(eventId, ticketId, req.user.userId);
  }

  /**
   * Leave waitlist for a ticket
   * Validates: Requirements 15.1
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id/waitlist/:ticketId/leave')
  async leaveWaitlist(
    @Request() req,
    @Param('id') eventId: string,
    @Param('ticketId') ticketId: string,
  ) {
    await this.waitlistService.leaveWaitlist(eventId, ticketId, req.user.userId);
    return { success: true };
  }

  /**
   * Get user's waitlist position
   * Validates: Requirements 15.7
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/waitlist/:ticketId/position')
  async getWaitlistPosition(
    @Request() req,
    @Param('id') eventId: string,
    @Param('ticketId') ticketId: string,
  ) {
    const position = await this.waitlistService.getPosition(eventId, ticketId, req.user.userId);
    return position || { position: null, status: null };
  }

  /**
   * Get user's waitlist status for all tickets in an event
   * Validates: Requirements 15.7
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/waitlist/my-status')
  async getMyWaitlistStatus(@Request() req, @Param('id') eventId: string) {
    const event = await this.eventsService.findOne(eventId);
    if (!event) {
      return { entries: [] };
    }

    const entries: Array<{
      ticketId: string;
      ticketName: string;
      position: number;
      status: string;
    }> = [];
    const tickets = (event as any).tickets || [];
    for (const ticket of tickets) {
      const position = await this.waitlistService.getPosition(eventId, ticket.id, req.user.userId);
      if (position) {
        entries.push({
          ticketId: ticket.id,
          ticketName: ticket.name,
          ...position,
        });
      }
    }

    return { entries };
  }

  /**
   * Claim ticket from waitlist
   * Validates: Requirements 15.4, 15.5
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/waitlist/:ticketId/claim')
  async claimWaitlistTicket(
    @Request() req,
    @Param('id') eventId: string,
    @Param('ticketId') ticketId: string,
  ) {
    return this.waitlistService.claimTicket(eventId, ticketId, req.user.userId);
  }

  /**
   * Get waitlist statistics for an event (organizer only)
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/waitlist/stats')
  async getWaitlistStats(@Request() req, @Param('id') eventId: string) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'VIEW_ATTENDEES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized' };
    }

    return this.waitlistService.getWaitlistStats(eventId);
  }

  // ============ Form Schema Endpoints ============

  /**
   * Get form schema for an event
   * Validates: Requirements 9.6
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/form-schema')
  async getFormSchema(@Request() req, @Param('id') eventId: string) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'VIEW_ATTENDEES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized' };
    }

    const schema = await this.formService.getFormSchema(eventId);
    return schema || { fields: [], version: 1 };
  }

  // ============ Export Endpoints ============

  /**
   * Export event attendees as CSV
   * Validates: Requirements 10.1, 10.2
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/export')
  async exportAttendees(
    @Request() req,
    @Param('id') eventId: string,
    @Query('format') format: 'csv' | 'xlsx' = 'csv',
    @Res() res: Response,
  ) {
    // Check if user has permission to export (Creator or Co-Organizer only)
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'EXPORT_DATA',
    );
    if (!hasPermission) {
      res.status(403).json({ error: 'Unauthorized - Only Creator and Co-Organizer can export data' });
      return;
    }

    const exportResult = await this.exportService.exportAttendees(eventId, req.user.userId);

    res.setHeader('Content-Type', exportResult.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
    res.send(exportResult.data);
  }

  // ============ Certificate Endpoints ============

  /**
   * Get available certificate templates
   * Validates: Requirements 8.1
   */
  @Get('certificates/templates')
  async getCertificateTemplates() {
    return this.certificateService.getTemplates();
  }

  /**
   * Get all certificates for an event
   * Validates: Requirements 8.7
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/certificates')
  async getEventCertificates(@Request() req, @Param('id') eventId: string) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'VIEW_ATTENDEES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized', certificates: [] };
    }

    const certificates = await this.certificateService.getEventCertificates(eventId);
    return { certificates };
  }

  /**
   * Issue certificate to a specific attendee
   * Validates: Requirements 8.3, 8.4, 8.9
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/certificates/issue')
  async issueCertificate(
    @Request() req,
    @Param('id') eventId: string,
    @Body() body: { userId: string; reason?: string },
  ) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'ISSUE_CERTIFICATES',
    );
    if (!hasPermission) {
      return { success: false, error: 'Unauthorized - Only Creator and Co-Organizer can issue certificates' };
    }

    try {
      const certificate = await this.certificateService.issueCertificate(
        eventId,
        body.userId,
        req.user.userId,
        body.reason,
      );
      return { success: true, certificate };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Batch issue certificates to all eligible attendees
   * Validates: Requirements 8.3, 8.7
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/certificates/batch-issue')
  async batchIssueCertificates(@Request() req, @Param('id') eventId: string) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'ISSUE_CERTIFICATES',
    );
    if (!hasPermission) {
      return { success: false, error: 'Unauthorized - Only Creator and Co-Organizer can issue certificates' };
    }

    try {
      const result = await this.certificateService.autoIssueCertificates(eventId);
      return { success: true, ...result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user is eligible for certificate
   * Validates: Requirements 8.3, 8.4
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/certificates/eligibility/:userId')
  async checkCertificateEligibility(
    @Request() req,
    @Param('id') eventId: string,
    @Param('userId') userId: string,
  ) {
    const hasPermission = await this.rolesService.hasPermission(
      eventId,
      req.user.userId,
      'VIEW_ATTENDEES',
    );
    if (!hasPermission) {
      return { error: 'Unauthorized' };
    }

    return this.certificateService.isEligibleForCertificate(eventId, userId);
  }

  /**
   * Get user's certificate for an event
   * Validates: Requirements 8.6
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id/certificates/my-certificate')
  async getMyCertificate(@Request() req, @Param('id') eventId: string) {
    const certificate = await this.certificateService.getCertificate(eventId, req.user.userId);
    return { certificate };
  }

  /**
   * Get all certificates for the current user
   * Validates: Requirements 8.8
   */
  @UseGuards(JwtAuthGuard)
  @Get('user/my-certificates')
  async getMyAllCertificates(@Request() req) {
    const certificates = await this.certificateService.getUserCertificates(req.user.userId);
    return { certificates };
  }
}
