import * as fc from 'fast-check';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';

/**
 * **Feature: teacher-classroom-admin-views, Property 30: Error Response Sanitization**
 * **Validates: Requirements 25.1, 25.2, 25.3, 25.4**
 * 
 * For any error response in production mode, the response body SHALL NOT contain
 * authorization headers, JWT tokens, or internal stack traces.
 */
describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let originalNodeEnv: string | undefined;

  // Mock response object
  const createMockResponse = () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    return { status, json };
  };

  // Mock request object
  const createMockRequest = (overrides: Partial<any> = {}) => ({
    url: '/test',
    method: 'GET',
    headers: {
      'user-agent': 'test-agent',
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U',
    },
    ip: '127.0.0.1',
    body: { password: 'secret123', username: 'testuser' },
    ...overrides,
  });

  // Mock ArgumentsHost
  const createMockHost = (request: any, response: any): ArgumentsHost => ({
    switchToHttp: () => ({
      getRequest: () => request,
      getResponse: () => response,
      getNext: () => jest.fn(),
    }),
    getArgs: () => [],
    getArgByIndex: () => null,
    switchToRpc: () => ({ getData: () => null, getContext: () => null }),
    switchToWs: () => ({ getData: () => null, getClient: () => null, getPattern: () => '' }),
    getType: () => 'http',
  } as ArgumentsHost);

  // JWT token arbitrary
  const jwtTokenArb = fc.tuple(
    fc.base64String({ minLength: 10, maxLength: 50 }),
    fc.base64String({ minLength: 10, maxLength: 50 }),
    fc.base64String({ minLength: 10, maxLength: 50 })
  ).map(([header, payload, signature]) => 
    `eyJ${header}.${payload}.${signature}`.replace(/=/g, '')
  );

  // Error message with potential sensitive data
  const errorMessageWithTokenArb = fc.tuple(
    fc.constantFrom('Error: ', 'Failed: ', 'Invalid: ', ''),
    jwtTokenArb,
    fc.constantFrom(' occurred', ' found', ' detected', '')
  ).map(([prefix, token, suffix]) => `${prefix}Bearer ${token}${suffix}`);

  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV;
    filter = new AllExceptionsFilter();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe('Property 30: Error Response Sanitization', () => {
    it('should NOT include JWT tokens in error responses (production)', () => {
      process.env.NODE_ENV = 'production';
      filter = new AllExceptionsFilter();

      fc.assert(
        fc.property(
          errorMessageWithTokenArb,
          fc.integer({ min: 400, max: 599 }),
          (errorMessage, statusCode) => {
            const mockResponse = createMockResponse();
            const mockRequest = createMockRequest();
            const mockHost = createMockHost(mockRequest, mockResponse);

            const exception = new HttpException(errorMessage, statusCode);
            filter.catch(exception, mockHost);

            // Get the response body
            const responseBody = mockResponse.json.mock.calls[0][0];
            const responseString = JSON.stringify(responseBody);

            // Property: Response should NOT contain JWT patterns
            const jwtPattern = /eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+/;
            const bearerPattern = /Bearer\s+[A-Za-z0-9\-_]+/;

            return !jwtPattern.test(responseString) && !bearerPattern.test(responseString);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return generic message for 5xx errors in production', () => {
      process.env.NODE_ENV = 'production';
      filter = new AllExceptionsFilter();

      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 200 }),
          fc.integer({ min: 500, max: 599 }),
          (errorMessage, statusCode) => {
            const mockResponse = createMockResponse();
            const mockRequest = createMockRequest();
            const mockHost = createMockHost(mockRequest, mockResponse);

            const exception = new HttpException(errorMessage, statusCode);
            filter.catch(exception, mockHost);

            const responseBody = mockResponse.json.mock.calls[0][0];

            // Property: 5xx errors in production should have generic message
            return responseBody.message === 'An unexpected error occurred. Please try again later.';
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should NOT include stack traces in production responses', () => {
      process.env.NODE_ENV = 'production';
      filter = new AllExceptionsFilter();

      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.integer({ min: 400, max: 599 }),
          (errorMessage, statusCode) => {
            const mockResponse = createMockResponse();
            const mockRequest = createMockRequest();
            const mockHost = createMockHost(mockRequest, mockResponse);

            const error = new Error(errorMessage);
            error.stack = `Error: ${errorMessage}\n    at Object.<anonymous> (/app/src/test.ts:10:5)`;
            
            filter.catch(error, mockHost);

            const responseBody = mockResponse.json.mock.calls[0][0];
            const responseString = JSON.stringify(responseBody);

            // Property: Response should NOT contain stack trace patterns
            const stackPattern = /at\s+\w+.*\(.*:\d+:\d+\)/;
            return !stackPattern.test(responseString) && !responseString.includes('.ts:');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should NOT include authorization headers in responses', () => {
      process.env.NODE_ENV = 'production';
      filter = new AllExceptionsFilter();

      fc.assert(
        fc.property(
          jwtTokenArb,
          fc.integer({ min: 400, max: 599 }),
          (token, statusCode) => {
            const mockResponse = createMockResponse();
            const mockRequest = createMockRequest({
              headers: {
                authorization: `Bearer ${token}`,
                'x-auth-token': token,
              },
            });
            const mockHost = createMockHost(mockRequest, mockResponse);

            const exception = new HttpException('Test error', statusCode);
            filter.catch(exception, mockHost);

            const responseBody = mockResponse.json.mock.calls[0][0];
            const responseString = JSON.stringify(responseBody);

            // Property: Response should NOT contain the auth token
            return !responseString.includes(token);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should mask sensitive data in error messages', () => {
      process.env.NODE_ENV = 'development'; // Even in dev, tokens should be masked
      filter = new AllExceptionsFilter();

      fc.assert(
        fc.property(
          jwtTokenArb,
          (token) => {
            const mockResponse = createMockResponse();
            const mockRequest = createMockRequest();
            const mockHost = createMockHost(mockRequest, mockResponse);

            // Create error with token in message
            const errorMessage = `Authentication failed for token: Bearer ${token}`;
            const exception = new HttpException(errorMessage, HttpStatus.UNAUTHORIZED);
            filter.catch(exception, mockHost);

            const responseBody = mockResponse.json.mock.calls[0][0];

            // Property: Token should be redacted in response
            return !responseBody.message.includes(token) || responseBody.message.includes('[REDACTED]');
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should include required fields in all responses', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('production', 'development'),
          fc.string({ minLength: 1, maxLength: 100 }),
          fc.integer({ min: 400, max: 599 }),
          (nodeEnv, errorMessage, statusCode) => {
            process.env.NODE_ENV = nodeEnv;
            filter = new AllExceptionsFilter();

            const mockResponse = createMockResponse();
            const mockRequest = createMockRequest();
            const mockHost = createMockHost(mockRequest, mockResponse);

            const exception = new HttpException(errorMessage, statusCode);
            filter.catch(exception, mockHost);

            const responseBody = mockResponse.json.mock.calls[0][0];

            // Property: Response should have required fields
            return (
              typeof responseBody.statusCode === 'number' &&
              typeof responseBody.message === 'string' &&
              typeof responseBody.timestamp === 'string' &&
              typeof responseBody.path === 'string'
            );
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should set correct HTTP status code', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 400, max: 599 }),
          (statusCode) => {
            process.env.NODE_ENV = 'production';
            filter = new AllExceptionsFilter();

            const mockResponse = createMockResponse();
            const mockRequest = createMockRequest();
            const mockHost = createMockHost(mockRequest, mockResponse);

            const exception = new HttpException('Test error', statusCode);
            filter.catch(exception, mockHost);

            // Property: Response status should match exception status
            return mockResponse.status.mock.calls[0][0] === statusCode;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Sensitive data masking', () => {
    it('should mask password fields in logged request body', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 8, maxLength: 50 }),
          (password) => {
            process.env.NODE_ENV = 'development';
            filter = new AllExceptionsFilter();

            const mockResponse = createMockResponse();
            const mockRequest = createMockRequest({
              body: { password, username: 'testuser' },
            });
            const mockHost = createMockHost(mockRequest, mockResponse);

            // The filter should sanitize the body before logging
            // We can't directly test the log output, but we verify the response doesn't leak it
            const exception = new HttpException('Validation failed', HttpStatus.BAD_REQUEST);
            filter.catch(exception, mockHost);

            const responseBody = mockResponse.json.mock.calls[0][0];
            const responseString = JSON.stringify(responseBody);

            // Property: Password should not appear in response
            return !responseString.includes(password);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
