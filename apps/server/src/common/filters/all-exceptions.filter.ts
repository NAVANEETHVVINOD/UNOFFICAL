import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/nestjs';

/**
 * Global exception filter that sanitizes error responses for security.
 * 
 * Security features:
 * - NEVER logs authorization headers or JWT tokens
 * - Returns generic error messages in production for 5xx errors
 * - Logs detailed errors server-side only with sensitive data masked
 * - Reports 5xx errors to Sentry (excludes 4xx client errors)
 * 
 * **Validates: Requirements 25.1, 25.2, 25.3, 25.4**
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('AllExceptionsFilter');
  private readonly isProduction = process.env.NODE_ENV === 'production';

  // Patterns to detect and mask sensitive data
  // Note: Base64 uses A-Za-z0-9+/= and URL-safe base64 uses A-Za-z0-9-_
  private readonly sensitivePatterns = [
    /Bearer\s+[A-Za-z0-9\-_+/=]+\.[A-Za-z0-9\-_+/=]+\.[A-Za-z0-9\-_+/=]+/gi, // JWT tokens
    /eyJ[A-Za-z0-9\-_+/=]+\.[A-Za-z0-9\-_+/=]+\.[A-Za-z0-9\-_+/=]+/gi, // JWT without Bearer
    /password["\s:=]+["']?[^"'\s,}]+/gi, // Password fields
    /secret["\s:=]+["']?[^"'\s,}]+/gi, // Secret fields
    /api[_-]?key["\s:=]+["']?[^"'\s,}]+/gi, // API keys
  ];

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Build sanitized log entry (NEVER include auth headers or tokens)
    const sanitizedLogEntry = this.buildSanitizedLogEntry(request, exception, status);
    
    // Log detailed error server-side only
    if (status >= 500) {
      this.logger.error(sanitizedLogEntry);
      
      // Report 5xx errors to Sentry (not 4xx client errors)
      this.reportToSentry(exception, request, status);
    } else {
      this.logger.warn(sanitizedLogEntry);
    }

    // Build sanitized response (NEVER include tokens or internal details in production)
    const sanitizedResponse = this.buildSanitizedResponse(exception, request, status);
    
    response.status(status).json(sanitizedResponse);
  }

  /**
   * Build a sanitized log entry for server-side logging.
   * Masks sensitive data and excludes authorization headers.
   */
  private buildSanitizedLogEntry(request: Request, exception: any, status: number): object {
    const logEntry: Record<string, any> = {
      path: request.url,
      method: request.method,
      status,
      message: this.maskSensitiveData(exception?.message || 'Unknown error'),
      userAgent: request.headers['user-agent'],
      ip: request.ip || request.headers['x-forwarded-for'],
    };

    // Add stack trace only in development (masked)
    if (!this.isProduction && exception?.stack) {
      logEntry.stack = this.maskSensitiveData(exception.stack);
    }

    // Add request body in development only (masked, excluding sensitive fields)
    if (!this.isProduction && request.body) {
      logEntry.body = this.sanitizeRequestBody(request.body);
    }

    // NEVER log these headers - security requirement 25.1
    // Authorization, Cookie, X-Auth-Token, etc. are explicitly excluded

    return logEntry;
  }

  /**
   * Build a sanitized error response for the client.
   * Returns generic messages in production for 5xx errors.
   */
  private buildSanitizedResponse(exception: any, request: Request, status: number): object {
    // Generic messages for production 5xx errors - requirement 25.4
    if (this.isProduction && status >= 500) {
      return {
        statusCode: status,
        message: 'An unexpected error occurred. Please try again later.',
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    // For 4xx errors or development, provide more detail (but still sanitized)
    const message = this.getSanitizedMessage(exception, status);
    
    return {
      statusCode: status,
      message,
      error: this.getErrorName(status),
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }

  /**
   * Get a sanitized error message, ensuring no tokens or sensitive data leak.
   */
  private getSanitizedMessage(exception: any, status: number): string {
    let message = exception?.message || 'An error occurred';
    
    // Always mask any potential sensitive data in messages
    message = this.maskSensitiveData(message);
    
    // For validation errors, try to extract useful info
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      if (typeof response === 'object' && 'message' in response) {
        const responseMessage = (response as any).message;
        if (Array.isArray(responseMessage)) {
          message = responseMessage.map(m => this.maskSensitiveData(String(m))).join(', ');
        } else if (typeof responseMessage === 'string') {
          message = this.maskSensitiveData(responseMessage);
        }
      }
    }
    
    return message;
  }

  /**
   * Mask sensitive data in strings (JWT tokens, passwords, etc.)
   */
  private maskSensitiveData(text: string): string {
    if (!text || typeof text !== 'string') return text;
    
    let masked = text;
    for (const pattern of this.sensitivePatterns) {
      masked = masked.replace(pattern, '[REDACTED]');
    }
    return masked;
  }

  /**
   * Sanitize request body by removing sensitive fields.
   */
  private sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') return body;
    
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'api_key', 'authorization'];
    const sanitized = { ...body };
    
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  /**
   * Get HTTP error name from status code.
   */
  private getErrorName(status: number): string {
    const errorNames: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      429: 'Too Many Requests',
      500: 'Internal Server Error',
      502: 'Bad Gateway',
      503: 'Service Unavailable',
    };
    return errorNames[status] || 'Error';
  }

  /**
   * Report error to Sentry with sanitized context.
   * Only reports 5xx errors, excludes PII.
   */
  private reportToSentry(exception: any, request: Request, status: number): void {
    try {
      // Only report 5xx server errors to Sentry
      if (status < 500) return;

      Sentry.withScope((scope) => {
        // Add sanitized context (no PII)
        scope.setTag('status_code', status.toString());
        scope.setTag('path', request.url);
        scope.setTag('method', request.method);
        
        // Add user ID only (anonymized, no email/name) - requirement 31.3, 31.5
        const userId = (request as any).user?.id || (request as any).user?.sub;
        if (userId) {
          scope.setUser({ id: userId });
        }

        // Capture the exception
        Sentry.captureException(exception);
      });
    } catch (sentryError) {
      // Don't let Sentry errors affect the response
      this.logger.warn('Failed to report error to Sentry', sentryError);
    }
  }
}
