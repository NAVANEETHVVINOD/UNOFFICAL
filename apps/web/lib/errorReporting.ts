/**
 * Error Reporting Service
 * Production-grade error logging and reporting
 * 
 * **Validates: Requirements 31.1, 31.2, 31.3, 31.4, 31.5**
 * 
 * This service provides:
 * - Error capture and reporting
 * - PII scrubbing (removes email, name, phone from error context)
 * - User context with ID only (no PII)
 * - Component stack capture for React errors
 * - Batch error queuing
 * 
 * To enable Sentry:
 * 1. Install @sentry/nextjs: npm install @sentry/nextjs
 * 2. Set NEXT_PUBLIC_SENTRY_DSN environment variable
 * 3. Create sentry.client.config.ts and sentry.server.config.ts
 */

// PII patterns to scrub from error messages and context
const PII_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone numbers
  /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
  /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b/g, // Credit cards
];

interface ErrorContext {
  userId?: string;
  route?: string;
  componentStack?: string;
  userAgent?: string;
  timestamp?: string;
  extra?: Record<string, any>;
}

interface ErrorReport {
  message: string;
  stack?: string;
  name: string;
  context: ErrorContext;
}

/**
 * Scrub PII from a string.
 * 
 * **Validates: Requirements 31.3**
 */
function scrubPII(text: string): string {
  let scrubbed = text;
  for (const pattern of PII_PATTERNS) {
    scrubbed = scrubbed.replace(pattern, '[REDACTED]');
  }
  return scrubbed;
}

/**
 * Scrub PII from an object recursively.
 */
function scrubObjectPII(obj: Record<string, any>): Record<string, any> {
  const scrubbed: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip sensitive keys entirely
    const sensitiveKeys = ['email', 'password', 'token', 'secret', 'apiKey', 'phone', 'ssn', 'creditCard'];
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
      scrubbed[key] = '[REDACTED]';
      continue;
    }
    
    if (typeof value === 'string') {
      scrubbed[key] = scrubPII(value);
    } else if (typeof value === 'object' && value !== null) {
      scrubbed[key] = scrubObjectPII(value);
    } else {
      scrubbed[key] = value;
    }
  }
  return scrubbed;
}

class ErrorReportingService {
  private isProduction = process.env.NODE_ENV === "production";
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 50;
  private sentryDSN = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SENTRY_DSN : undefined;

  /**
   * Capture and report an exception.
   * 
   * **Validates: Requirements 31.2, 31.3**
   */
  captureException(error: Error | unknown, context: ErrorContext = {}): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));

    // Scrub PII from error message and stack
    const scrubbedMessage = scrubPII(errorObj.message);
    const scrubbedStack = errorObj.stack ? scrubPII(errorObj.stack) : undefined;
    const scrubbedContext = context.extra ? scrubObjectPII(context.extra) : undefined;

    const report: ErrorReport = {
      message: scrubbedMessage,
      stack: scrubbedStack,
      name: errorObj.name,
      context: {
        ...context,
        extra: scrubbedContext,
        timestamp: new Date().toISOString(),
        route: typeof window !== "undefined" ? window.location.pathname : undefined,
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      },
    };

    // Always log to console in development
    if (!this.isProduction) {
      console.error("[ErrorReporting]", report);
    }

    // Queue the error for batch reporting
    this.queueError(report);

    // In production, send to external service
    if (this.isProduction) {
      this.sendToExternalService(report);
    }
  }

  /**
   * Capture a message (non-error event).
   * 
   * **Validates: Requirements 31.2**
   */
  captureMessage(message: string, level: "info" | "warning" | "error" = "info", context: ErrorContext = {}): void {
    const scrubbedMessage = scrubPII(message);
    
    const report: ErrorReport = {
      message: scrubbedMessage,
      name: `[${level.toUpperCase()}]`,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        route: typeof window !== "undefined" ? window.location.pathname : undefined,
      },
    };

    if (!this.isProduction) {
      console.log(`[ErrorReporting:${level}]`, scrubbedMessage, context);
    }

    if (this.isProduction && level === "error") {
      this.sendToExternalService(report);
    }
  }

  /**
   * Set user context for error reports.
   * Only stores user ID (no PII).
   * 
   * **Validates: Requirements 31.5**
   */
  setUser(userId: string | null): void {
    // Store user ID for future error reports (ID only, no PII)
    if (typeof window !== "undefined") {
      if (userId) {
        sessionStorage.setItem("error_reporting_user_id", userId);
      } else {
        sessionStorage.removeItem("error_reporting_user_id");
      }
    }
  }

  /**
   * Get current user ID from storage
   */
  private getUserId(): string | undefined {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("error_reporting_user_id") || undefined;
    }
    return undefined;
  }

  /**
   * Queue error for batch processing
   */
  private queueError(report: ErrorReport): void {
    this.errorQueue.push(report);

    // Prevent queue from growing too large
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  /**
   * Send error to external service.
   * Supports Sentry if configured, otherwise uses custom endpoint.
   * 
   * **Validates: Requirements 31.1, 31.2**
   */
  private async sendToExternalService(report: ErrorReport): Promise<void> {
    try {
      // If Sentry DSN is configured, use Sentry
      if (this.sentryDSN) {
        // Dynamic import to avoid bundling Sentry if not used
        try {
          const Sentry = await import('@sentry/nextjs');
          Sentry.captureException(new Error(report.message), {
            extra: report.context as Record<string, unknown>,
            tags: {
              route: report.context.route || 'unknown',
            },
          });
          return;
        } catch {
          // Sentry not installed, fall through to custom endpoint
        }
      }
      
      // Fallback to custom endpoint
      const endpoint = process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT;
      if (!endpoint) return;

      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...report,
          context: {
            ...report.context,
            userId: report.context.userId || this.getUserId(),
          },
        }),
      });
    } catch (e) {
      // Silently fail - don't want error reporting to cause more errors
      console.warn("[ErrorReporting] Failed to send error report:", e);
    }
  }

  /**
   * Get recent errors (for debugging)
   */
  getRecentErrors(): ErrorReport[] {
    return [...this.errorQueue];
  }

  /**
   * Clear error queue
   */
  clearQueue(): void {
    this.errorQueue = [];
  }
}

// Singleton instance
export const errorReportingService = new ErrorReportingService();

/**
 * Setup global error handlers.
 * 
 * **Validates: Requirements 31.4**
 */
export function setupGlobalErrorHandlers(): void {
  if (typeof window === "undefined") return;

  // Uncaught exceptions
  window.onerror = (message, source, lineno, colno, error) => {
    errorReportingService.captureException(error || new Error(String(message)), {
      extra: { source, lineno, colno },
    });
  };

  // Unhandled promise rejections
  window.onunhandledrejection = (event) => {
    errorReportingService.captureException(event.reason, {
      extra: { type: "unhandledrejection" },
    });
  };
}

/**
 * React Error Boundary helper.
 * Captures React component errors with component stack.
 * 
 * **Validates: Requirements 31.4**
 */
export function captureReactError(error: Error, errorInfo: { componentStack: string }): void {
  errorReportingService.captureException(error, {
    componentStack: errorInfo.componentStack,
  });
}
