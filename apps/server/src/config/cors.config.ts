import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/**
 * Static CORS helper for WebSocket gateways
 * Used in decorators where DI is not available
 */
export function getWebSocketCorsConfig() {
  const isProduction = process.env.NODE_ENV === 'production';
  const corsOrigins = process.env.CORS_ORIGINS || '';
  const legacyCorsOrigin = process.env.CORS_ORIGIN || '';
  
  const combined = [corsOrigins, legacyCorsOrigin].filter(Boolean).join(',');
  const defaultOrigins = isProduction ? [] : ['http://localhost:3000', 'http://localhost:4000'];
  
  const allowedOrigins = [...new Set([
    ...defaultOrigins,
    ...combined.split(',').map(o => o.trim()).filter(Boolean)
  ])];

  // Remove wildcard in production
  if (isProduction) {
    const wildcardIndex = allowedOrigins.indexOf('*');
    if (wildcardIndex > -1) {
      allowedOrigins.splice(wildcardIndex, 1);
      console.warn('[CorsConfig] Wildcard (*) removed from CORS origins in production');
    }
  }

  return {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (same-origin, server-to-server)
      if (!origin) {
        callback(null, true);
        return;
      }

      // In development, allow all origins
      if (!isProduction) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CorsConfig] WebSocket CORS blocked: ${origin}`);
        callback(new Error('CORS not allowed'), false);
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  };
}

/**
 * CORS Configuration Service
 * 
 * Provides centralized CORS configuration for HTTP and WebSocket endpoints.
 * Reads allowed origins from CORS_ORIGINS environment variable.
 * Rejects wildcard (*) in production mode for security.
 */
@Injectable()
export class CorsConfig {
  private readonly logger = new Logger(CorsConfig.name);
  private readonly allowedOrigins: string[];
  private readonly isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
    this.allowedOrigins = this.parseAllowedOrigins();
    this.validateConfiguration();
    this.logConfiguration();
  }

  /**
   * Parse allowed origins from environment variable
   * Supports comma-separated list: "http://localhost:3000,https://example.com"
   */
  private parseAllowedOrigins(): string[] {
    const corsOrigins = this.configService.get<string>('CORS_ORIGINS') || '';
    const legacyCorsOrigin = this.configService.get<string>('CORS_ORIGIN') || '';
    
    // Combine both env vars for backwards compatibility
    const combined = [corsOrigins, legacyCorsOrigin]
      .filter(Boolean)
      .join(',');

    // Default origins for development
    const defaultOrigins = this.isProduction 
      ? [] 
      : ['http://localhost:3000', 'http://localhost:4000'];

    const origins = combined
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean);

    // Merge with defaults, removing duplicates
    return [...new Set([...defaultOrigins, ...origins])];
  }

  /**
   * Validate CORS configuration for security
   */
  private validateConfiguration(): void {
    // Check for wildcard in production
    if (this.isProduction && this.allowedOrigins.includes('*')) {
      this.logger.error(
        'SECURITY WARNING: Wildcard (*) CORS origin detected in production mode. ' +
        'This is a security risk. Please configure specific origins in CORS_ORIGINS.'
      );
      // Remove wildcard from allowed origins in production
      const index = this.allowedOrigins.indexOf('*');
      if (index > -1) {
        this.allowedOrigins.splice(index, 1);
      }
    }

    // Warn if no origins configured in production
    if (this.isProduction && this.allowedOrigins.length === 0) {
      this.logger.warn(
        'No CORS origins configured in production. ' +
        'Set CORS_ORIGINS environment variable with comma-separated origins.'
      );
    }
  }

  /**
   * Log CORS configuration on startup
   */
  private logConfiguration(): void {
    this.logger.log(`CORS Mode: ${this.isProduction ? 'Production' : 'Development'}`);
    this.logger.log(`Allowed Origins: ${this.allowedOrigins.join(', ') || '(none)'}`);
  }

  /**
   * Get list of allowed origins
   */
  getOrigins(): string[] {
    return [...this.allowedOrigins];
  }

  /**
   * Check if an origin is allowed
   */
  isOriginAllowed(origin: string | undefined): boolean {
    // Allow requests with no origin (same-origin, server-to-server)
    if (!origin) {
      return true;
    }

    // In development, allow all origins
    if (!this.isProduction) {
      return true;
    }

    return this.allowedOrigins.includes(origin);
  }

  /**
   * Get CORS options for NestJS HTTP endpoints
   */
  getCorsOptions(): CorsOptions {
    return {
      origin: (origin, callback) => {
        if (this.isOriginAllowed(origin)) {
          callback(null, true);
        } else {
          this.logger.warn(`CORS blocked request from origin: ${origin}`);
          callback(new Error('CORS not allowed'), false);
        }
      },
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
      exposedHeaders: ['Authorization'],
    };
  }

  /**
   * Get CORS options for WebSocket gateways
   */
  getWebSocketCorsOptions(): {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
    methods: string[];
    credentials: boolean;
  } {
    return {
      origin: (origin, callback) => {
        if (this.isOriginAllowed(origin)) {
          callback(null, true);
        } else {
          this.logger.warn(`WebSocket CORS blocked request from origin: ${origin}`);
          callback(new Error('CORS not allowed'), false);
        }
      },
      methods: ['GET', 'POST'],
      credentials: true,
    };
  }
}
