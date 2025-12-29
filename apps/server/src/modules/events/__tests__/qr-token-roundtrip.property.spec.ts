import * as fc from 'fast-check';
import { CheckInService } from '../checkin.service';

/**
 * Property Test: QR Token Round-Trip
 * Property 3: For any valid registration, generating a QR token and then
 * parsing/verifying it SHALL return the original registration ID and event ID.
 * 
 * Validates: Requirements 6.1
 */
describe('Property 3: QR Token Round-Trip', () => {
  let checkInService: CheckInService;

  beforeEach(() => {
    // Create service with null prisma (we only test pure functions)
    checkInService = new CheckInService(null as any);
  });

  // Arbitraries for generating test data - use uuid for CUID-like IDs
  const cuidArb = fc.uuid().map(uuid => uuid.replace(/-/g, '').substring(0, 25));

  describe('Token Generation and Verification', () => {
    it('should generate valid tokens that can be verified', () => {
      fc.assert(
        fc.property(cuidArb, cuidArb, cuidArb, (eventId, userId, registrationId) => {
          const token = checkInService.generateQrToken(eventId, userId, registrationId);
          const result = checkInService.verifyQrToken(token);
          
          expect(result.valid).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve eventId through round-trip', () => {
      fc.assert(
        fc.property(cuidArb, cuidArb, cuidArb, (eventId, userId, registrationId) => {
          const token = checkInService.generateQrToken(eventId, userId, registrationId);
          const result = checkInService.verifyQrToken(token);
          
          expect(result.valid).toBe(true);
          expect(result.payload?.eventId).toBe(eventId);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve userId through round-trip', () => {
      fc.assert(
        fc.property(cuidArb, cuidArb, cuidArb, (eventId, userId, registrationId) => {
          const token = checkInService.generateQrToken(eventId, userId, registrationId);
          const result = checkInService.verifyQrToken(token);
          
          expect(result.valid).toBe(true);
          expect(result.payload?.userId).toBe(userId);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve registrationId through round-trip', () => {
      fc.assert(
        fc.property(cuidArb, cuidArb, cuidArb, (eventId, userId, registrationId) => {
          const token = checkInService.generateQrToken(eventId, userId, registrationId);
          const result = checkInService.verifyQrToken(token);
          
          expect(result.valid).toBe(true);
          expect(result.payload?.registrationId).toBe(registrationId);
        }),
        { numRuns: 100 }
      );
    });

    it('should include valid timestamp in payload', () => {
      fc.assert(
        fc.property(cuidArb, cuidArb, cuidArb, (eventId, userId, registrationId) => {
          const beforeGen = Date.now();
          const token = checkInService.generateQrToken(eventId, userId, registrationId);
          const afterGen = Date.now();
          
          const result = checkInService.verifyQrToken(token);
          
          expect(result.valid).toBe(true);
          expect(result.payload?.timestamp).toBeGreaterThanOrEqual(beforeGen);
          expect(result.payload?.timestamp).toBeLessThanOrEqual(afterGen);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Token Uniqueness', () => {
    it('should generate unique tokens for same inputs', () => {
      fc.assert(
        fc.property(cuidArb, cuidArb, cuidArb, (eventId, userId, registrationId) => {
          const token1 = checkInService.generateQrToken(eventId, userId, registrationId);
          const token2 = checkInService.generateQrToken(eventId, userId, registrationId);
          
          // Tokens should be different due to random component and timestamp
          expect(token1).not.toBe(token2);
          
          // But both should be valid
          expect(checkInService.verifyQrToken(token1).valid).toBe(true);
          expect(checkInService.verifyQrToken(token2).valid).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Token Tampering Detection', () => {
    it('should reject tokens with modified eventId', () => {
      fc.assert(
        fc.property(cuidArb, cuidArb, cuidArb, cuidArb, (eventId, userId, registrationId, fakeEventId) => {
          fc.pre(eventId !== fakeEventId);
          
          const token = checkInService.generateQrToken(eventId, userId, registrationId);
          const parts = token.split(':');
          parts[0] = fakeEventId; // Tamper with eventId
          const tamperedToken = parts.join(':');
          
          const result = checkInService.verifyQrToken(tamperedToken);
          expect(result.valid).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject tokens with modified userId', () => {
      fc.assert(
        fc.property(cuidArb, cuidArb, cuidArb, cuidArb, (eventId, userId, registrationId, fakeUserId) => {
          fc.pre(userId !== fakeUserId);
          
          const token = checkInService.generateQrToken(eventId, userId, registrationId);
          const parts = token.split(':');
          parts[1] = fakeUserId; // Tamper with userId
          const tamperedToken = parts.join(':');
          
          const result = checkInService.verifyQrToken(tamperedToken);
          expect(result.valid).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject tokens with modified registrationId', () => {
      fc.assert(
        fc.property(cuidArb, cuidArb, cuidArb, cuidArb, (eventId, userId, registrationId, fakeRegId) => {
          fc.pre(registrationId !== fakeRegId);
          
          const token = checkInService.generateQrToken(eventId, userId, registrationId);
          const parts = token.split(':');
          parts[2] = fakeRegId; // Tamper with registrationId
          const tamperedToken = parts.join(':');
          
          const result = checkInService.verifyQrToken(tamperedToken);
          expect(result.valid).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should reject tokens with modified signature', () => {
      fc.assert(
        fc.property(cuidArb, cuidArb, cuidArb, (eventId, userId, registrationId) => {
          const token = checkInService.generateQrToken(eventId, userId, registrationId);
          const parts = token.split(':');
          // Modify signature by flipping a character
          const sig = parts[5];
          const modifiedSig = sig[0] === 'a' ? 'b' + sig.slice(1) : 'a' + sig.slice(1);
          parts[5] = modifiedSig;
          const tamperedToken = parts.join(':');
          
          const result = checkInService.verifyQrToken(tamperedToken);
          expect(result.valid).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Invalid Token Formats', () => {
    it('should reject empty tokens', () => {
      const result = checkInService.verifyQrToken('');
      expect(result.valid).toBe(false);
    });

    it('should reject tokens with wrong number of parts', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
          (parts) => {
            fc.pre(parts.length !== 6);
            const token = parts.join(':');
            const result = checkInService.verifyQrToken(token);
            expect(result.valid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject tokens with too many parts', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string(), { minLength: 7, maxLength: 10 }),
          (parts) => {
            const token = parts.join(':');
            const result = checkInService.verifyQrToken(token);
            expect(result.valid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject completely random strings', () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 100 }), (randomStr) => {
          // Skip if it happens to have exactly 6 colon-separated parts
          fc.pre(randomStr.split(':').length !== 6);
          
          const result = checkInService.verifyQrToken(randomStr);
          expect(result.valid).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });
});
