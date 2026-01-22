import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PaymentStatus,
  RegistrationStatus,
  NotificationType,
} from '@prisma/client';
import { createHmac, randomUUID } from 'crypto';
import Razorpay from 'razorpay';
import { CircuitBreakerRegistry } from '../../common/circuit-breaker';

export interface FeeBreakdown {
  ticketPrice: number;
  platformFee: number; // 3%
  gatewayFee: number; // ~2%
  totalCharge: number; // What user pays
  organizerPayout: number; // What organizer receives
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerificationResult {
  success: boolean;
  registrationId?: string;
  error?: string;
}

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private razorpay: Razorpay | null = null;
  private readonly razorpayCircuitBreaker = CircuitBreakerRegistry.get('razorpay', {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 30000, // 30 seconds
  });

  // Fee percentages (in basis points for precision)
  private readonly PLATFORM_FEE_BPS = 300; // 3%
  private readonly GATEWAY_FEE_BPS = 200; // 2%

  constructor(private prisma: PrismaService) {
    // Only initialize Razorpay if credentials are provided
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (keyId && keySecret) {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
      this.logger.log('Razorpay initialized successfully');
    } else {
      this.logger.warn('Razorpay credentials not configured - payment features will be disabled');
    }
  }

  /**
   * Check if Razorpay is configured
   */
  isPaymentEnabled(): boolean {
    return this.razorpay !== null;
  }

  /**
   * Calculate fee breakdown for a ticket price
   * Property 9: Fee Calculation Consistency
   * platformFee + gatewayFee + organizerPayout = totalCharge
   */
  calculateFees(ticketPrice: number, passFeesToBuyer: boolean): FeeBreakdown {
    // All amounts in paise (INR cents)
    const platformFee = Math.ceil((ticketPrice * this.PLATFORM_FEE_BPS) / 10000);
    const gatewayFee = Math.ceil((ticketPrice * this.GATEWAY_FEE_BPS) / 10000);

    if (passFeesToBuyer) {
      // Buyer pays ticket price + all fees
      const totalCharge = ticketPrice + platformFee + gatewayFee;
      return {
        ticketPrice,
        platformFee,
        gatewayFee,
        totalCharge,
        organizerPayout: ticketPrice,
      };
    } else {
      // Organizer absorbs fees, buyer pays ticket price only
      const totalCharge = ticketPrice;
      const organizerPayout = ticketPrice - platformFee - gatewayFee;
      return {
        ticketPrice,
        platformFee,
        gatewayFee,
        totalCharge,
        organizerPayout: Math.max(0, organizerPayout),
      };
    }
  }


  /**
   * Create a Razorpay order for a registration
   * Uses idempotency key to prevent duplicate orders
   */
  async createOrder(
    registrationId: string,
    passFeesToBuyer: boolean,
  ): Promise<{ order: RazorpayOrder; feeBreakdown: FeeBreakdown }> {
    if (!this.razorpay) {
      throw new BadRequestException('Payment system is not configured');
    }

    // Get registration with ticket info
    const registration = await this.prisma.eventRegistration.findUnique({
      where: { id: registrationId },
      include: {
        TicketType: true,
        Event: { select: { title: true } },
        EventPayment: true,
      },
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    if (registration.status !== RegistrationStatus.PENDING) {
      throw new BadRequestException('Registration is not in pending status');
    }

    // Check if payment already exists (idempotency)
    if (registration.EventPayment) {
      const existingPayment = registration.EventPayment;
      const feeBreakdown = this.calculateFees(registration.TicketType.price, passFeesToBuyer);
      
      return {
        order: {
          id: existingPayment.razorpayOrderId,
          amount: existingPayment.amount,
          currency: 'INR',
          receipt: registrationId,
          status: existingPayment.status,
        },
        feeBreakdown,
      };
    }

    const ticketPrice = registration.TicketType.price;
    const feeBreakdown = this.calculateFees(ticketPrice, passFeesToBuyer);

    // Generate idempotency key
    const idempotencyKey = `order_${registrationId}_${randomUUID()}`;

    try {
      // Create Razorpay order
      const razorpayOrder = await this.razorpay.orders.create({
        amount: feeBreakdown.totalCharge,
        currency: 'INR',
        receipt: registrationId,
        notes: {
          registrationId,
          eventTitle: registration.Event.title,
          ticketName: registration.TicketType.name,
        },
      });

      // Store payment record
      await this.prisma.eventPayment.create({
        data: {
          id: randomUUID(),
          registrationId,
          razorpayOrderId: razorpayOrder.id,
          idempotencyKey,
          amount: feeBreakdown.totalCharge,
          platformFee: feeBreakdown.platformFee,
          gatewayFee: feeBreakdown.gatewayFee,
          status: PaymentStatus.PENDING,
        },
      });

      // Update registration with payment info
      await this.prisma.eventRegistration.update({
        where: { id: registrationId },
        data: {
          amountPaid: feeBreakdown.totalCharge,
          platformFee: feeBreakdown.platformFee,
          gatewayFee: feeBreakdown.gatewayFee,
        },
      });

      this.logger.log(`Created Razorpay order ${razorpayOrder.id} for registration ${registrationId}`);

      return {
        order: {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount as number,
          currency: razorpayOrder.currency,
          receipt: razorpayOrder.receipt || registrationId,
          status: razorpayOrder.status,
        },
        feeBreakdown,
      };
    } catch (error) {
      this.logger.error(`Failed to create Razorpay order: ${error}`);
      throw new BadRequestException('Failed to create payment order');
    }
  }


  /**
   * Verify payment signature from Razorpay
   * Called after successful payment on frontend
   */
  async verifyPayment(
    orderId: string,
    paymentId: string,
    signature: string,
  ): Promise<PaymentVerificationResult> {
    // Find payment by order ID
    const payment = await this.prisma.eventPayment.findUnique({
      where: { razorpayOrderId: orderId },
      include: {
        EventRegistration: {
          include: {
            Event: { select: { id: true, title: true } },
            TicketType: { select: { name: true } },
            User: { select: { id: true } },
          },
        },
      },
    });

    if (!payment) {
      this.logger.error(`Payment not found for order ${orderId}`);
      return { success: false, error: 'Payment record not found' };
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      this.logger.error(`Invalid signature for order ${orderId}`);
      
      // Log failed verification
      await this.logPaymentStateTransition(
        payment.id,
        PaymentStatus.PENDING,
        PaymentStatus.FAILED,
        'Signature verification failed',
      );

      return { success: false, error: 'Payment verification failed' };
    }

    // Update payment status
    await this.prisma.$transaction(async (tx) => {
      await tx.eventPayment.update({
        where: { id: payment.id },
        data: {
          razorpayPaymentId: paymentId,
          status: PaymentStatus.CAPTURED,
          capturedAt: new Date(),
        },
      });

      // Confirm registration
      await tx.eventRegistration.update({
        where: { id: payment.registrationId },
        data: {
          status: RegistrationStatus.CONFIRMED,
          paymentId: paymentId,
        },
      });
    });

    // Log successful payment
    await this.logPaymentStateTransition(
      payment.id,
      PaymentStatus.PENDING,
      PaymentStatus.CAPTURED,
      `Payment captured: ${paymentId}`,
    );

    // Send confirmation notification
    await this.createPaymentNotification(
      payment.EventRegistration.User.id,
      payment.EventRegistration.Event.id,
      payment.EventRegistration.Event.title,
      payment.EventRegistration.TicketType.name,
    );

    this.logger.log(`Payment verified for order ${orderId}, registration ${payment.registrationId}`);

    return {
      success: true,
      registrationId: payment.registrationId,
    };
  }


  /**
   * Process Razorpay webhook events
   * Property 12: Payment Webhook Idempotency
   * Processing the same webhook multiple times produces the same result
   */
  async processWebhook(
    payload: Record<string, unknown>,
    signature: string,
  ): Promise<void> {
    // Verify webhook signature
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
    const body = JSON.stringify(payload);
    const expectedSignature = createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      this.logger.error('Invalid webhook signature');
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = payload.event as string;
    const paymentEntity = (payload.payload as Record<string, unknown>)?.payment as Record<string, unknown>;
    const payment = paymentEntity?.entity as Record<string, unknown>;

    if (!payment) {
      this.logger.warn('No payment entity in webhook payload');
      return;
    }

    const orderId = payment.order_id as string;
    const paymentId = payment.id as string;

    // Check if webhook already processed (idempotency)
    const existingLog = await this.prisma.paymentWebhookLog.findFirst({
      where: {
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        eventType: event,
      },
    });

    if (existingLog) {
      this.logger.log(`Webhook already processed: ${event} for order ${orderId}`);
      return;
    }

    // Log webhook
    await this.prisma.paymentWebhookLog.create({
      data: {
        id: randomUUID(),
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        eventType: event,
        payload: payload as object,
      },
    });

    // Find payment record
    const paymentRecord = await this.prisma.eventPayment.findUnique({
      where: { razorpayOrderId: orderId },
      include: {
        EventRegistration: {
          include: {
            Event: { select: { id: true, title: true } },
            TicketType: { select: { name: true } },
            User: { select: { id: true } },
          },
        },
      },
    });

    if (!paymentRecord) {
      this.logger.error(`Payment not found for webhook order ${orderId}`);
      // Create alert for missing registration
      await this.createMissingRegistrationAlert(orderId, paymentId, event);
      return;
    }

    // Process based on event type
    switch (event) {
      case 'payment.captured':
        await this.handlePaymentCaptured(paymentRecord, paymentId);
        break;
      case 'payment.failed':
        await this.handlePaymentFailed(paymentRecord, payment.error_description as string);
        break;
      case 'refund.created':
      case 'refund.processed':
        await this.handleRefundProcessed(paymentRecord, payload);
        break;
      default:
        this.logger.log(`Unhandled webhook event: ${event}`);
    }
  }

  private async handlePaymentCaptured(
    paymentRecord: Awaited<ReturnType<typeof this.prisma.eventPayment.findUnique>> & {
      EventRegistration: { Event: { id: string; title: string }; TicketType: { name: string }; User: { id: string } };
    },
    paymentId: string,
  ): Promise<void> {
    if (!paymentRecord) return;

    // Skip if already captured (idempotency)
    if (paymentRecord.status === PaymentStatus.CAPTURED) {
      this.logger.log(`Payment already captured: ${paymentRecord.id}`);
      return;
    }

    const previousStatus = paymentRecord.status;

    await this.prisma.$transaction(async (tx) => {
      await tx.eventPayment.update({
        where: { id: paymentRecord.id },
        data: {
          razorpayPaymentId: paymentId,
          status: PaymentStatus.CAPTURED,
          capturedAt: new Date(),
          webhookProcessedAt: new Date(),
        },
      });

      await tx.eventRegistration.update({
        where: { id: paymentRecord.registrationId },
        data: {
          status: RegistrationStatus.CONFIRMED,
          paymentId: paymentId,
        },
      });
    });

    await this.logPaymentStateTransition(
      paymentRecord.id,
      previousStatus,
      PaymentStatus.CAPTURED,
      `Webhook: payment.captured - ${paymentId}`,
    );

    // Send notification
    await this.createPaymentNotification(
      paymentRecord.EventRegistration.User.id,
      paymentRecord.EventRegistration.Event.id,
      paymentRecord.EventRegistration.Event.title,
      paymentRecord.EventRegistration.TicketType.name,
    );
  }


  private async handlePaymentFailed(
    paymentRecord: NonNullable<Awaited<ReturnType<typeof this.prisma.eventPayment.findUnique>>>,
    errorDescription?: string,
  ): Promise<void> {
    // Skip if already failed (idempotency)
    if (paymentRecord.status === PaymentStatus.FAILED) {
      return;
    }

    const previousStatus = paymentRecord.status;

    await this.prisma.$transaction(async (tx) => {
      await tx.eventPayment.update({
        where: { id: paymentRecord.id },
        data: {
          status: PaymentStatus.FAILED,
          webhookProcessedAt: new Date(),
        },
      });

      // Release the ticket reservation
      await tx.eventRegistration.update({
        where: { id: paymentRecord.registrationId },
        data: { status: RegistrationStatus.CANCELLED },
      });

      // Decrement sold count
      const registration = await tx.eventRegistration.findUnique({
        where: { id: paymentRecord.registrationId },
      });

      if (registration) {
        await tx.ticketType.update({
          where: { id: registration.ticketId },
          data: { quantitySold: { decrement: 1 } },
        });
      }
    });

    await this.logPaymentStateTransition(
      paymentRecord.id,
      previousStatus,
      PaymentStatus.FAILED,
      `Webhook: payment.failed - ${errorDescription || 'Unknown error'}`,
    );
  }

  private async handleRefundProcessed(
    paymentRecord: NonNullable<Awaited<ReturnType<typeof this.prisma.eventPayment.findUnique>>>,
    payload: Record<string, unknown>,
  ): Promise<void> {
    const refundEntity = (payload.payload as Record<string, unknown>)?.refund as Record<string, unknown>;
    const refund = refundEntity?.entity as Record<string, unknown>;
    const refundAmount = refund?.amount as number;
    const isFullRefund = refundAmount >= paymentRecord.amount;

    const previousStatus = paymentRecord.status;
    const newStatus = isFullRefund ? PaymentStatus.REFUNDED : PaymentStatus.PARTIALLY_REFUNDED;

    // Skip if already in target state (idempotency)
    if (paymentRecord.status === newStatus) {
      return;
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.eventPayment.update({
        where: { id: paymentRecord.id },
        data: {
          status: newStatus,
          webhookProcessedAt: new Date(),
        },
      });

      if (isFullRefund) {
        await tx.eventRegistration.update({
          where: { id: paymentRecord.registrationId },
          data: { status: RegistrationStatus.REFUNDED },
        });

        // Return ticket to pool
        const registration = await tx.eventRegistration.findUnique({
          where: { id: paymentRecord.registrationId },
        });

        if (registration) {
          await tx.ticketType.update({
            where: { id: registration.ticketId },
            data: { quantitySold: { decrement: 1 } },
          });
        }
      }
    });

    await this.logPaymentStateTransition(
      paymentRecord.id,
      previousStatus,
      newStatus,
      `Webhook: refund.processed - Amount: ${refundAmount}`,
    );
  }

  /**
   * Initiate a refund (for organizers)
   * Note: v1 does not support refunds, this is for future use
   */
  async initiateRefund(
    registrationId: string,
    amount?: number,
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    if (!this.razorpay) {
      return { success: false, error: 'Payment system is not configured' };
    }

    const payment = await this.prisma.eventPayment.findUnique({
      where: { registrationId },
    });

    if (!payment) {
      return { success: false, error: 'Payment not found' };
    }

    if (payment.status !== PaymentStatus.CAPTURED) {
      return { success: false, error: 'Payment not captured, cannot refund' };
    }

    if (!payment.razorpayPaymentId) {
      return { success: false, error: 'No payment ID found' };
    }

    const refundAmount = amount || payment.amount;

    try {
      const refund = await this.razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: refundAmount,
        notes: {
          registrationId,
          reason: 'Organizer initiated refund',
        },
      });

      this.logger.log(`Refund initiated: ${refund.id} for payment ${payment.razorpayPaymentId}`);

      return { success: true, refundId: refund.id };
    } catch (error) {
      this.logger.error(`Failed to initiate refund: ${error}`);
      return { success: false, error: 'Failed to initiate refund' };
    }
  }


  /**
   * Get payment details for a registration
   */
  async getPaymentDetails(registrationId: string) {
    return this.prisma.eventPayment.findUnique({
      where: { registrationId },
    });
  }

  /**
   * Manual payment verification (for cases where frontend fails after payment)
   * Requirement 25.2
   */
  async manualVerifyPayment(orderId: string): Promise<PaymentVerificationResult> {
    if (!this.razorpay) {
      return { success: false, error: 'Payment system is not configured' };
    }

    const payment = await this.prisma.eventPayment.findUnique({
      where: { razorpayOrderId: orderId },
      include: {
        EventRegistration: {
          include: {
            Event: { select: { id: true, title: true } },
            TicketType: { select: { name: true } },
            User: { select: { id: true } },
          },
        },
      },
    });

    if (!payment) {
      return { success: false, error: 'Payment record not found' };
    }

    // Already captured
    if (payment.status === PaymentStatus.CAPTURED) {
      return { success: true, registrationId: payment.registrationId };
    }

    try {
      // Fetch order from Razorpay
      const razorpayOrder = await this.razorpay.orders.fetch(orderId);

      if (razorpayOrder.status === 'paid') {
        // Fetch payments for this order
        const payments = await this.razorpay.orders.fetchPayments(orderId);
        const capturedPayment = (payments.items as Array<{ id: string; status: string }>)?.find(
          (p) => p.status === 'captured',
        );

        if (capturedPayment) {
          // Update payment status
          await this.prisma.$transaction(async (tx) => {
            await tx.eventPayment.update({
              where: { id: payment.id },
              data: {
                razorpayPaymentId: capturedPayment.id,
                status: PaymentStatus.CAPTURED,
                capturedAt: new Date(),
              },
            });

            await tx.eventRegistration.update({
              where: { id: payment.registrationId },
              data: {
                status: RegistrationStatus.CONFIRMED,
                paymentId: capturedPayment.id,
              },
            });
          });

          await this.logPaymentStateTransition(
            payment.id,
            payment.status,
            PaymentStatus.CAPTURED,
            `Manual verification: ${capturedPayment.id}`,
          );

          // Send notification
          await this.createPaymentNotification(
            payment.EventRegistration.User.id,
            payment.EventRegistration.Event.id,
            payment.EventRegistration.Event.title,
            payment.EventRegistration.TicketType.name,
          );

          return { success: true, registrationId: payment.registrationId };
        }
      }

      return { success: false, error: 'Payment not found or not captured in Razorpay' };
    } catch (error) {
      this.logger.error(`Manual verification failed: ${error}`);
      return { success: false, error: 'Failed to verify payment with Razorpay' };
    }
  }

  /**
   * Log payment state transitions for audit
   * Requirement 25.5
   */
  private async logPaymentStateTransition(
    paymentId: string,
    fromStatus: PaymentStatus,
    toStatus: PaymentStatus,
    reason: string,
  ): Promise<void> {
    this.logger.log(
      `Payment ${paymentId} state transition: ${fromStatus} -> ${toStatus}. Reason: ${reason}`,
    );
    // In production, this would write to a dedicated audit log table
  }

  /**
   * Create alert for missing registration
   * Requirement 25.1
   */
  private async createMissingRegistrationAlert(
    orderId: string,
    paymentId: string,
    eventType: string,
  ): Promise<void> {
    this.logger.error(
      `ALERT: Webhook received for missing registration. Order: ${orderId}, Payment: ${paymentId}, Event: ${eventType}`,
    );
    // In production, this would create an admin alert
  }

  /**
   * Create payment confirmation notification
   */
  private async createPaymentNotification(
    userId: string,
    eventId: string,
    eventTitle: string,
    ticketName: string,
  ): Promise<void> {
    await this.prisma.notification.create({
      data: {
        id: randomUUID(),
        userId,
        type: NotificationType.EVENT,
        title: 'Payment Confirmed',
        message: `Your payment for "${eventTitle}" (${ticketName}) has been confirmed. Check your email for the ticket.`,
        actionUrl: `/events/${eventId}`,
      },
    });
  }
}
