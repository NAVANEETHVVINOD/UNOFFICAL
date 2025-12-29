import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

/**
 * Structured Logger for payments and check-ins
 * Validates: Requirement 26.7
 * 
 * Includes correlation IDs for request tracing
 */

export interface LogContext {
  correlationId?: string;
  userId?: string;
  eventId?: string;
  registrationId?: string;
  paymentId?: string;
  action?: string;
  [key: string]: unknown;
}

export class StructuredLogger {
  private readonly logger: Logger;
  private readonly serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
    this.logger = new Logger(serviceName);
  }

  /**
   * Generate a new correlation ID
   */
  static generateCorrelationId(): string {
    return randomUUID();
  }

  /**
   * Log a structured info message
   */
  info(message: string, context: LogContext = {}): void {
    const logEntry = this.formatLogEntry('INFO', message, context);
    this.logger.log(JSON.stringify(logEntry));
  }

  /**
   * Log a structured warning message
   */
  warn(message: string, context: LogContext = {}): void {
    const logEntry = this.formatLogEntry('WARN', message, context);
    this.logger.warn(JSON.stringify(logEntry));
  }

  /**
   * Log a structured error message
   */
  error(message: string, context: LogContext = {}, error?: Error): void {
    const logEntry = this.formatLogEntry('ERROR', message, {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    });
    this.logger.error(JSON.stringify(logEntry));
  }

  /**
   * Log a payment event
   */
  logPaymentEvent(
    action: 'ORDER_CREATED' | 'PAYMENT_INITIATED' | 'PAYMENT_CAPTURED' | 'PAYMENT_FAILED' | 'REFUND_INITIATED' | 'REFUND_PROCESSED',
    context: LogContext
  ): void {
    this.info(`Payment: ${action}`, {
      ...context,
      action,
      category: 'PAYMENT',
    });
  }

  /**
   * Log a check-in event
   */
  logCheckInEvent(
    action: 'QR_SCANNED' | 'CHECK_IN_SUCCESS' | 'CHECK_IN_FAILED' | 'MANUAL_CHECK_IN' | 'CHECK_OUT',
    context: LogContext
  ): void {
    this.info(`CheckIn: ${action}`, {
      ...context,
      action,
      category: 'CHECK_IN',
    });
  }

  /**
   * Log a security event
   */
  logSecurityEvent(
    action: 'AUTH_SUCCESS' | 'AUTH_FAILED' | 'PERMISSION_DENIED' | 'RATE_LIMITED' | 'INVALID_SIGNATURE',
    context: LogContext
  ): void {
    this.warn(`Security: ${action}`, {
      ...context,
      action,
      category: 'SECURITY',
    });
  }

  private formatLogEntry(
    level: string,
    message: string,
    context: LogContext
  ): Record<string, unknown> {
    return {
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      message,
      correlationId: context.correlationId || StructuredLogger.generateCorrelationId(),
      ...context,
    };
  }
}

/**
 * Create a logger instance for a service
 */
export function createStructuredLogger(serviceName: string): StructuredLogger {
  return new StructuredLogger(serviceName);
}

/**
 * Payment failure alert
 * Validates: Requirement 26.8
 */
export function createPaymentFailureAlert(
  logger: StructuredLogger,
  context: LogContext,
  reason: string
): void {
  logger.error(`PAYMENT_FAILURE_ALERT: ${reason}`, {
    ...context,
    alertType: 'PAYMENT_FAILURE',
    severity: 'HIGH',
  });
  
  // In production, this would also:
  // 1. Send to monitoring system (e.g., CloudWatch, Datadog)
  // 2. Trigger PagerDuty/OpsGenie alert if threshold exceeded
  // 3. Send Slack notification to payments channel
}
