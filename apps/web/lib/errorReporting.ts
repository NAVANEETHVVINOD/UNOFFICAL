/**
 * Error Reporting Service
 * Production-grade error logging and reporting
 */

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

class ErrorReportingService {
  private isProduction = process.env.NODE_ENV === "production";
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 50;

  /**
   * Capture and report an exception
   */
  captureException(error: Error | unknown, context: ErrorContext = {}): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));

    const report: ErrorReport = {
      message: errorObj.message,
      stack: errorObj.stack,
      name: errorObj.name,
      context: {
        ...context,
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
   * Capture a message (non-error event)
   */
  captureMessage(message: string, level: "info" | "warning" | "error" = "info", context: ErrorContext = {}): void {
    const report: ErrorReport = {
      message,
      name: `[${level.toUpperCase()}]`,
      context: {
        ...context,
        timestamp: new Date().toISOString(),
        route: typeof window !== "undefined" ? window.location.pathname : undefined,
      },
    };

    if (!this.isProduction) {
      console.log(`[ErrorReporting:${level}]`, message, context);
    }

    if (this.isProduction && level === "error") {
      this.sendToExternalService(report);
    }
  }

  /**
   * Set user context for error reports
   */
  setUser(userId: string | null): void {
    // Store user ID for future error reports
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
   * Send error to external service (placeholder for Sentry, LogRocket, etc.)
   */
  private async sendToExternalService(report: ErrorReport): Promise<void> {
    try {
      // TODO: Replace with actual error reporting service
      // Example: Sentry, LogRocket, Bugsnag, etc.
      
      // For now, we'll use a simple fetch to a hypothetical endpoint
      // In production, replace this with your actual error reporting service
      
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

// Global error handlers setup
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

// React Error Boundary helper
export function captureReactError(error: Error, errorInfo: { componentStack: string }): void {
  errorReportingService.captureException(error, {
    componentStack: errorInfo.componentStack,
  });
}
