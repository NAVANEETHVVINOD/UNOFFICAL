import * as fc from 'fast-check';
import { CorsConfig, getWebSocketCorsConfig } from './cors.config';
import { ConfigService } from '@nestjs/config';

/**
 * **Feature: teacher-classroom-admin-views, Property 29: CORS Origin Validation**
 * **Validates: Requirements 24.1, 24.2**
 * 
 * For any HTTP request from an origin not in the whitelist, 
 * the server SHALL respond with a CORS rejection when CORS is enforced.
 */
describe('CorsConfig', () => {
  // Helper to create a mock ConfigService
  const createMockConfigService = (config: Record<string, string | undefined>) => {
    return {
      get: jest.fn((key: string) => config[key]),
    } as unknown as ConfigService;
  };

  // Arbitrary for generating valid URLs
  const validOriginArb = fc.tuple(
    fc.constantFrom('http', 'https'),
    fc.string({ minLength: 3, maxLength: 20 }).filter(s => /^[a-z0-9]+$/.test(s)),
    fc.constantFrom('.com', '.org', '.io', '.app', '.dev'),
    fc.option(fc.integer({ min: 1000, max: 9999 }), { nil: undefined })
  ).map(([protocol, domain, tld, port]) => {
    const base = `${protocol}://${domain}${tld}`;
    return port ? `${base}:${port}` : base;
  });

  describe('Property 29: CORS Origin Validation', () => {
    it('should allow origins that are in the whitelist', () => {
      fc.assert(
        fc.property(
          fc.array(validOriginArb, { minLength: 1, maxLength: 5 }),
          fc.integer({ min: 0, max: 4 }),
          (origins, indexToTest) => {
            // Setup: Configure CORS with the generated origins
            const configService = createMockConfigService({
              NODE_ENV: 'production',
              CORS_ORIGINS: origins.join(','),
              CORS_ORIGIN: '',
            });

            const corsConfig = new CorsConfig(configService);
            
            // Pick one of the allowed origins to test
            const safeIndex = indexToTest % origins.length;
            const testOrigin = origins[safeIndex];
            
            // Property: Origin in whitelist should be allowed
            return corsConfig.isOriginAllowed(testOrigin) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject origins that are NOT in the whitelist in production', () => {
      fc.assert(
        fc.property(
          fc.array(validOriginArb, { minLength: 1, maxLength: 3 }),
          validOriginArb,
          (allowedOrigins, testOrigin) => {
            // Pre-condition: testOrigin is not in allowedOrigins
            fc.pre(!allowedOrigins.includes(testOrigin));

            // Setup: Configure CORS with allowed origins
            const configService = createMockConfigService({
              NODE_ENV: 'production',
              CORS_ORIGINS: allowedOrigins.join(','),
              CORS_ORIGIN: '',
            });

            const corsConfig = new CorsConfig(configService);
            
            // Property: Origin NOT in whitelist should be rejected in production
            return corsConfig.isOriginAllowed(testOrigin) === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should allow all origins in development mode', () => {
      fc.assert(
        fc.property(
          validOriginArb,
          (testOrigin) => {
            // Setup: Configure CORS in development mode
            const configService = createMockConfigService({
              NODE_ENV: 'development',
              CORS_ORIGINS: 'http://localhost:3000',
              CORS_ORIGIN: '',
            });

            const corsConfig = new CorsConfig(configService);
            
            // Property: Any origin should be allowed in development
            return corsConfig.isOriginAllowed(testOrigin) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should allow requests with no origin (same-origin/server-to-server)', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('production', 'development'),
          fc.array(validOriginArb, { minLength: 0, maxLength: 3 }),
          (nodeEnv, allowedOrigins) => {
            // Setup: Configure CORS
            const configService = createMockConfigService({
              NODE_ENV: nodeEnv,
              CORS_ORIGINS: allowedOrigins.join(','),
              CORS_ORIGIN: '',
            });

            const corsConfig = new CorsConfig(configService);
            
            // Property: Undefined origin should always be allowed
            return corsConfig.isOriginAllowed(undefined) === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should remove wildcard (*) from allowed origins in production', () => {
      fc.assert(
        fc.property(
          fc.array(validOriginArb, { minLength: 0, maxLength: 3 }),
          (otherOrigins) => {
            // Setup: Configure CORS with wildcard in production
            const originsWithWildcard = ['*', ...otherOrigins];
            const configService = createMockConfigService({
              NODE_ENV: 'production',
              CORS_ORIGINS: originsWithWildcard.join(','),
              CORS_ORIGIN: '',
            });

            const corsConfig = new CorsConfig(configService);
            
            // Property: Wildcard should be removed from origins list
            const origins = corsConfig.getOrigins();
            return !origins.includes('*');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('getWebSocketCorsConfig', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should use the same validation logic as CorsConfig', () => {
      fc.assert(
        fc.property(
          fc.array(validOriginArb, { minLength: 1, maxLength: 3 }),
          validOriginArb,
          (allowedOrigins, testOrigin) => {
            // Setup environment
            process.env.NODE_ENV = 'production';
            process.env.CORS_ORIGINS = allowedOrigins.join(',');
            process.env.CORS_ORIGIN = '';

            const wsConfig = getWebSocketCorsConfig();
            
            // Test the origin callback
            let callbackResult: boolean | undefined;
            wsConfig.origin(testOrigin, (err, allow) => {
              callbackResult = err ? false : allow;
            });

            // Property: Should match expected behavior
            const expectedAllowed = allowedOrigins.includes(testOrigin);
            return callbackResult === expectedAllowed;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('getCorsOptions callback behavior', () => {
    it('should call callback with true for allowed origins', () => {
      fc.assert(
        fc.property(
          fc.array(validOriginArb, { minLength: 1, maxLength: 3 }),
          fc.integer({ min: 0, max: 2 }),
          (origins, indexToTest) => {
            const configService = createMockConfigService({
              NODE_ENV: 'production',
              CORS_ORIGINS: origins.join(','),
              CORS_ORIGIN: '',
            });

            const corsConfig = new CorsConfig(configService);
            const corsOptions = corsConfig.getCorsOptions();
            
            const safeIndex = indexToTest % origins.length;
            const testOrigin = origins[safeIndex];
            
            let callbackCalled = false;
            let callbackError: Error | null = null;
            let callbackAllow: boolean | undefined;

            // Type assertion for the origin callback
            const originFn = corsOptions.origin as (
              origin: string | undefined,
              callback: (err: Error | null, allow?: boolean) => void
            ) => void;

            originFn(testOrigin, (err, allow) => {
              callbackCalled = true;
              callbackError = err;
              callbackAllow = allow;
            });

            // Property: Callback should be called with no error and allow=true
            return callbackCalled && callbackError === null && callbackAllow === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should call callback with error for rejected origins in production', () => {
      fc.assert(
        fc.property(
          fc.array(validOriginArb, { minLength: 1, maxLength: 3 }),
          validOriginArb,
          (allowedOrigins, testOrigin) => {
            fc.pre(!allowedOrigins.includes(testOrigin));

            const configService = createMockConfigService({
              NODE_ENV: 'production',
              CORS_ORIGINS: allowedOrigins.join(','),
              CORS_ORIGIN: '',
            });

            const corsConfig = new CorsConfig(configService);
            const corsOptions = corsConfig.getCorsOptions();
            
            let callbackCalled = false;
            let callbackError: Error | null = null;

            const originFn = corsOptions.origin as (
              origin: string | undefined,
              callback: (err: Error | null, allow?: boolean) => void
            ) => void;

            originFn(testOrigin, (err) => {
              callbackCalled = true;
              callbackError = err;
            });

            // Property: Callback should be called with an error
            return callbackCalled && callbackError !== null;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
