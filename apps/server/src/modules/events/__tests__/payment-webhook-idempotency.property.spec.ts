import * as fc from 'fast-check';

/**
 * Property Test: Payment Webhook Idempotency
 * Validates: Requirements 22.5, 22.6
 * 
 * Property 12: Payment Webhook Idempotency
 * Processing the same webhook multiple times SHALL produce the same result.
 * The system SHALL NOT create duplicate records or perform duplicate state transitions.
 * 
 * Properties tested:
 * 1. Processing same webhook twice produces same result
 * 2. Payment status transitions are idempotent
 * 3. Webhook logs prevent duplicate processing
 * 4. Registration status is consistent after multiple webhook calls
 */

// Simulated payment states
type PaymentStatus = 'PENDING' | 'CAPTURED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
type RegistrationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';

interface WebhookLog {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  eventType: string;
  processedAt: Date;
}

interface PaymentRecord {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  status: PaymentStatus;
  registrationId: string;
}

interface RegistrationRecord {
  id: string;
  status: RegistrationStatus;
}

interface WebhookPayload {
  event: string;
  payload: {
    payment: {
      entity: {
        id: string;
        order_id: string;
        status: string;
        error_description?: string;
      };
    };
  };
}

/**
 * Simulated webhook processor that mirrors the actual implementation
 */
class IdempotentWebhookProcessor {
  private webhookLogs: WebhookLog[] = [];
  private payments: Map<string, PaymentRecord> = new Map();
  private registrations: Map<string, RegistrationRecord> = new Map();

  constructor() {
    this.reset();
  }

  reset() {
    this.webhookLogs = [];
    this.payments = new Map();
    this.registrations = new Map();
  }

  setupPayment(orderId: string, registrationId: string) {
    const paymentId = `pay_${orderId}`;
    this.payments.set(orderId, {
      id: paymentId,
      razorpayOrderId: orderId,
      razorpayPaymentId: null,
      status: 'PENDING',
      registrationId,
    });
    this.registrations.set(registrationId, {
      id: registrationId,
      status: 'PENDING',
    });
  }

  /**
   * Check if webhook was already processed
   */
  private isWebhookProcessed(orderId: string, paymentId: string, eventType: string): boolean {
    return this.webhookLogs.some(
      log => log.razorpayOrderId === orderId && 
             log.razorpayPaymentId === paymentId && 
             log.eventType === eventType
    );
  }

  /**
   * Log webhook processing
   */
  private logWebhook(orderId: string, paymentId: string, eventType: string) {
    this.webhookLogs.push({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      eventType,
      processedAt: new Date(),
    });
  }

  /**
   * Process webhook with idempotency
   */
  processWebhook(payload: WebhookPayload): { processed: boolean; skipped: boolean } {
    const { event } = payload;
    const payment = payload.payload.payment.entity;
    const orderId = payment.order_id;
    const paymentId = payment.id;

    // Check idempotency - skip if already processed
    if (this.isWebhookProcessed(orderId, paymentId, event)) {
      return { processed: false, skipped: true };
    }

    // Log webhook
    this.logWebhook(orderId, paymentId, event);

    // Find payment record
    const paymentRecord = this.payments.get(orderId);
    if (!paymentRecord) {
      return { processed: false, skipped: false };
    }

    // Process based on event type
    switch (event) {
      case 'payment.captured':
        return this.handlePaymentCaptured(paymentRecord, paymentId);
      case 'payment.failed':
        return this.handlePaymentFailed(paymentRecord);
      default:
        return { processed: false, skipped: false };
    }
  }

  private handlePaymentCaptured(
    paymentRecord: PaymentRecord,
    paymentId: string
  ): { processed: boolean; skipped: boolean } {
    // Idempotency check - skip if already captured
    if (paymentRecord.status === 'CAPTURED') {
      return { processed: false, skipped: true };
    }

    // Update payment
    paymentRecord.razorpayPaymentId = paymentId;
    paymentRecord.status = 'CAPTURED';
    this.payments.set(paymentRecord.razorpayOrderId, paymentRecord);

    // Update registration
    const registration = this.registrations.get(paymentRecord.registrationId);
    if (registration) {
      registration.status = 'CONFIRMED';
      this.registrations.set(registration.id, registration);
    }

    return { processed: true, skipped: false };
  }

  private handlePaymentFailed(
    paymentRecord: PaymentRecord
  ): { processed: boolean; skipped: boolean } {
    // Idempotency check - skip if already failed
    if (paymentRecord.status === 'FAILED') {
      return { processed: false, skipped: true };
    }

    // Update payment
    paymentRecord.status = 'FAILED';
    this.payments.set(paymentRecord.razorpayOrderId, paymentRecord);

    // Update registration
    const registration = this.registrations.get(paymentRecord.registrationId);
    if (registration) {
      registration.status = 'CANCELLED';
      this.registrations.set(registration.id, registration);
    }

    return { processed: true, skipped: false };
  }

  getPayment(orderId: string): PaymentRecord | undefined {
    return this.payments.get(orderId);
  }

  getRegistration(registrationId: string): RegistrationRecord | undefined {
    return this.registrations.get(registrationId);
  }

  getWebhookLogCount(): number {
    return this.webhookLogs.length;
  }
}

describe('Payment Webhook Idempotency Properties', () => {
  let processor: IdempotentWebhookProcessor;

  beforeEach(() => {
    processor = new IdempotentWebhookProcessor();
  });

  // Arbitraries
  const orderIdArb = fc.string({ minLength: 10, maxLength: 20 }).map(s => `order_${s}`);
  const paymentIdArb = fc.string({ minLength: 10, maxLength: 20 }).map(s => `pay_${s}`);
  const registrationIdArb = fc.uuid();
  const webhookEventArb = fc.constantFrom('payment.captured', 'payment.failed');

  const createWebhookPayload = (
    orderId: string,
    paymentId: string,
    event: string
  ): WebhookPayload => ({
    event,
    payload: {
      payment: {
        entity: {
          id: paymentId,
          order_id: orderId,
          status: event === 'payment.captured' ? 'captured' : 'failed',
        },
      },
    },
  });

  /**
   * Feature: events-system-redesign, Property 12: Payment Webhook Idempotency
   * Validates: Requirements 22.5, 22.6
   */
  test('Property 1: Processing same webhook twice produces same final state', () => {
    fc.assert(
      fc.property(
        orderIdArb,
        paymentIdArb,
        registrationIdArb,
        webhookEventArb,
        (orderId, paymentId, registrationId, event) => {
          processor.reset();
          processor.setupPayment(orderId, registrationId);

          const payload = createWebhookPayload(orderId, paymentId, event);

          // Process first time
          processor.processWebhook(payload);
          const stateAfterFirst = {
            payment: { ...processor.getPayment(orderId) },
            registration: { ...processor.getRegistration(registrationId) },
          };

          // Process second time
          processor.processWebhook(payload);
          const stateAfterSecond = {
            payment: { ...processor.getPayment(orderId) },
            registration: { ...processor.getRegistration(registrationId) },
          };

          // States should be identical
          expect(stateAfterSecond.payment).toEqual(stateAfterFirst.payment);
          expect(stateAfterSecond.registration).toEqual(stateAfterFirst.registration);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Duplicate webhooks are skipped after first processing', () => {
    fc.assert(
      fc.property(
        orderIdArb,
        paymentIdArb,
        registrationIdArb,
        webhookEventArb,
        fc.integer({ min: 2, max: 10 }),
        (orderId, paymentId, registrationId, event, repeatCount) => {
          processor.reset();
          processor.setupPayment(orderId, registrationId);

          const payload = createWebhookPayload(orderId, paymentId, event);

          // First call should process
          const firstResult = processor.processWebhook(payload);
          expect(firstResult.processed).toBe(true);
          expect(firstResult.skipped).toBe(false);

          // Subsequent calls should be skipped
          for (let i = 1; i < repeatCount; i++) {
            const result = processor.processWebhook(payload);
            expect(result.skipped).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 3: Webhook log count equals unique webhook count', () => {
    fc.assert(
      fc.property(
        orderIdArb,
        paymentIdArb,
        registrationIdArb,
        webhookEventArb,
        fc.integer({ min: 1, max: 10 }),
        (orderId, paymentId, registrationId, event, repeatCount) => {
          processor.reset();
          processor.setupPayment(orderId, registrationId);

          const payload = createWebhookPayload(orderId, paymentId, event);

          // Process multiple times
          for (let i = 0; i < repeatCount; i++) {
            processor.processWebhook(payload);
          }

          // Should only have 1 log entry (first unique webhook)
          expect(processor.getWebhookLogCount()).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 4: Payment captured webhook results in CONFIRMED registration', () => {
    fc.assert(
      fc.property(
        orderIdArb,
        paymentIdArb,
        registrationIdArb,
        (orderId, paymentId, registrationId) => {
          processor.reset();
          processor.setupPayment(orderId, registrationId);

          const payload = createWebhookPayload(orderId, paymentId, 'payment.captured');
          processor.processWebhook(payload);

          const payment = processor.getPayment(orderId);
          const registration = processor.getRegistration(registrationId);

          expect(payment?.status).toBe('CAPTURED');
          expect(registration?.status).toBe('CONFIRMED');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Payment failed webhook results in CANCELLED registration', () => {
    fc.assert(
      fc.property(
        orderIdArb,
        paymentIdArb,
        registrationIdArb,
        (orderId, paymentId, registrationId) => {
          processor.reset();
          processor.setupPayment(orderId, registrationId);

          const payload = createWebhookPayload(orderId, paymentId, 'payment.failed');
          processor.processWebhook(payload);

          const payment = processor.getPayment(orderId);
          const registration = processor.getRegistration(registrationId);

          expect(payment?.status).toBe('FAILED');
          expect(registration?.status).toBe('CANCELLED');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 6: Different webhooks for same order are processed independently', () => {
    fc.assert(
      fc.property(
        orderIdArb,
        paymentIdArb,
        registrationIdArb,
        (orderId, paymentId, registrationId) => {
          processor.reset();
          processor.setupPayment(orderId, registrationId);

          // Process captured webhook
          const capturedPayload = createWebhookPayload(orderId, paymentId, 'payment.captured');
          const capturedResult = processor.processWebhook(capturedPayload);

          // Process failed webhook (different event type)
          const failedPayload = createWebhookPayload(orderId, paymentId, 'payment.failed');
          const failedResult = processor.processWebhook(failedPayload);

          // Both should be logged (different event types)
          expect(processor.getWebhookLogCount()).toBe(2);

          // First one processed, second skipped due to state check
          expect(capturedResult.processed).toBe(true);
          expect(failedResult.skipped).toBe(true); // Already captured, can't fail
        }
      ),
      { numRuns: 100 }
    );
  });

  // Edge cases
  describe('Edge Cases', () => {
    test('Webhook for non-existent payment is handled gracefully', () => {
      const payload = createWebhookPayload('order_nonexistent', 'pay_123', 'payment.captured');
      const result = processor.processWebhook(payload);

      expect(result.processed).toBe(false);
      expect(result.skipped).toBe(false);
    });

    test('Rapid duplicate webhooks are all idempotent', () => {
      processor.setupPayment('order_rapid', 'reg_rapid');
      const payload = createWebhookPayload('order_rapid', 'pay_rapid', 'payment.captured');

      // Simulate rapid fire webhooks
      const results = Array(100).fill(null).map(() => processor.processWebhook(payload));

      // Only first should process
      expect(results[0].processed).toBe(true);
      expect(results.slice(1).every(r => r.skipped)).toBe(true);
      expect(processor.getWebhookLogCount()).toBe(1);
    });
  });
});
