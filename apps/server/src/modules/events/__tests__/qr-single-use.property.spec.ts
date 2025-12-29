import * as fc from 'fast-check';
import { CheckInService, CheckInErrorCode } from '../checkin.service';
import { RegistrationStatus } from '@prisma/client';

/**
 * Property Test: QR Single-Use Enforcement
 * Property 4: For any valid QR token, the first check-in attempt SHALL succeed,
 * and all subsequent check-in attempts with the same token SHALL fail with
 * "QR_ALREADY_USED" error.
 * 
 * Validates: Requirements 6.5
 */
describe('Property 4: QR Single-Use Enforcement', () => {
  // Mock registration data
  const createMockRegistration = (overrides: Partial<{
    id: string;
    eventId: string;
    userId: string;
    qrToken: string;
    qrUsed: boolean;
    status: RegistrationStatus;
    checkInTime: Date | null;
  }> = {}) => ({
    id: overrides.id || 'reg123',
    eventId: overrides.eventId || 'event123',
    userId: overrides.userId || 'user123',
    ticketId: 'ticket123',
    qrToken: overrides.qrToken || 'token123',
    qrUsed: overrides.qrUsed ?? false,
    status: overrides.status || RegistrationStatus.CONFIRMED,
    checkInTime: overrides.checkInTime || null,
    checkOutTime: null,
    checkInBy: null,
    checkInMethod: null,
    user: {
      id: overrides.userId || 'user123',
      fullName: 'Test User',
      email: 'test@example.com',
    },
    ticket: {
      name: 'General Admission',
    },
    event: {
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 86400000),
      title: 'Test Event',
    },
  });

  // Arbitraries
  const cuidArb = fc.uuid().map(uuid => uuid.replace(/-/g, '').substring(0, 25));
  const scannerIdArb = fc.uuid().map(uuid => uuid.replace(/-/g, '').substring(0, 25));

  describe('Single-Use Enforcement Logic', () => {
    it('first check-in should succeed for unused QR', async () => {
      await fc.assert(
        fc.asyncProperty(cuidArb, cuidArb, cuidArb, scannerIdArb, async (eventId, userId, regId, scannerId) => {
          // Create service with mock prisma
          const mockPrisma = {
            eventRegistration: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          };

          const checkInService = new CheckInService(mockPrisma as any);
          
          // Generate a valid token
          const token = checkInService.generateQrToken(eventId, userId, regId);
          
          // Mock registration lookup - not yet used
          const mockReg = createMockRegistration({
            id: regId,
            eventId,
            userId,
            qrToken: token,
            qrUsed: false,
            status: RegistrationStatus.CONFIRMED,
          });
          
          mockPrisma.eventRegistration.findUnique.mockResolvedValue(mockReg);
          mockPrisma.eventRegistration.update.mockResolvedValue({ ...mockReg, qrUsed: true });

          const result = await checkInService.checkIn(eventId, token, scannerId);
          
          expect(result.success).toBe(true);
          expect(result.isFirstScan).toBe(true);
          expect(result.errorCode).toBeUndefined();
        }),
        { numRuns: 50 }
      );
    });

    it('second check-in should fail with QR_ALREADY_USED', async () => {
      await fc.assert(
        fc.asyncProperty(cuidArb, cuidArb, cuidArb, scannerIdArb, async (eventId, userId, regId, scannerId) => {
          const mockPrisma = {
            eventRegistration: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          };

          const checkInService = new CheckInService(mockPrisma as any);
          
          // Generate a valid token
          const token = checkInService.generateQrToken(eventId, userId, regId);
          
          // Mock registration lookup - already used
          const mockReg = createMockRegistration({
            id: regId,
            eventId,
            userId,
            qrToken: token,
            qrUsed: true, // Already used!
            status: RegistrationStatus.ATTENDED,
            checkInTime: new Date(),
          });
          
          mockPrisma.eventRegistration.findUnique.mockResolvedValue(mockReg);

          const result = await checkInService.checkIn(eventId, token, scannerId);
          
          expect(result.success).toBe(false);
          expect(result.isFirstScan).toBe(false);
          expect(result.errorCode).toBe(CheckInErrorCode.TOKEN_ALREADY_USED);
        }),
        { numRuns: 50 }
      );
    });

    it('multiple check-in attempts should all fail after first success', async () => {
      await fc.assert(
        fc.asyncProperty(
          cuidArb,
          cuidArb,
          cuidArb,
          scannerIdArb,
          fc.integer({ min: 2, max: 10 }),
          async (eventId, userId, regId, scannerId, attemptCount) => {
            const mockPrisma = {
              eventRegistration: {
                findUnique: jest.fn(),
                update: jest.fn(),
              },
            };

            const checkInService = new CheckInService(mockPrisma as any);
            const token = checkInService.generateQrToken(eventId, userId, regId);
            
            // Track state
            let qrUsed = false;
            let checkInTime: Date | null = null;

            mockPrisma.eventRegistration.findUnique.mockImplementation(() => {
              return Promise.resolve(createMockRegistration({
                id: regId,
                eventId,
                userId,
                qrToken: token,
                qrUsed,
                status: qrUsed ? RegistrationStatus.ATTENDED : RegistrationStatus.CONFIRMED,
                checkInTime,
              }));
            });

            mockPrisma.eventRegistration.update.mockImplementation(() => {
              qrUsed = true;
              checkInTime = new Date();
              return Promise.resolve({});
            });

            // First attempt should succeed
            const firstResult = await checkInService.checkIn(eventId, token, scannerId);
            expect(firstResult.success).toBe(true);
            expect(firstResult.isFirstScan).toBe(true);

            // All subsequent attempts should fail
            for (let i = 1; i < attemptCount; i++) {
              const result = await checkInService.checkIn(eventId, token, scannerId);
              expect(result.success).toBe(false);
              expect(result.errorCode).toBe(CheckInErrorCode.TOKEN_ALREADY_USED);
            }
          }
        ),
        { numRuns: 30 }
      );
    });
  });

  describe('Error Cases', () => {
    it('should fail for unconfirmed registrations', async () => {
      await fc.assert(
        fc.asyncProperty(
          cuidArb,
          cuidArb,
          cuidArb,
          scannerIdArb,
          fc.constantFrom(RegistrationStatus.PENDING, RegistrationStatus.CANCELLED, RegistrationStatus.REFUNDED),
          async (eventId, userId, regId, scannerId, status) => {
            const mockPrisma = {
              eventRegistration: {
                findUnique: jest.fn(),
                update: jest.fn(),
              },
            };

            const checkInService = new CheckInService(mockPrisma as any);
            const token = checkInService.generateQrToken(eventId, userId, regId);
            
            mockPrisma.eventRegistration.findUnique.mockResolvedValue(
              createMockRegistration({
                id: regId,
                eventId,
                userId,
                qrToken: token,
                qrUsed: false,
                status,
              })
            );

            const result = await checkInService.checkIn(eventId, token, scannerId);
            
            expect(result.success).toBe(false);
            expect(result.errorCode).toBe(CheckInErrorCode.NOT_CONFIRMED);
          }
        ),
        { numRuns: 30 }
      );
    });

    it('should fail for wrong event', async () => {
      await fc.assert(
        fc.asyncProperty(cuidArb, cuidArb, cuidArb, cuidArb, scannerIdArb, async (eventId1, eventId2, userId, regId, scannerId) => {
          fc.pre(eventId1 !== eventId2);
          
          const mockPrisma = {
            eventRegistration: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          };

          const checkInService = new CheckInService(mockPrisma as any);
          
          // Generate token for event1
          const token = checkInService.generateQrToken(eventId1, userId, regId);
          
          // Try to check in at event2
          const result = await checkInService.checkIn(eventId2, token, scannerId);
          
          expect(result.success).toBe(false);
          expect(result.errorCode).toBe(CheckInErrorCode.INVALID_TOKEN);
        }),
        { numRuns: 50 }
      );
    });

    it('should fail for non-existent registration', async () => {
      await fc.assert(
        fc.asyncProperty(cuidArb, cuidArb, cuidArb, scannerIdArb, async (eventId, userId, regId, scannerId) => {
          const mockPrisma = {
            eventRegistration: {
              findUnique: jest.fn().mockResolvedValue(null),
              update: jest.fn(),
            },
          };

          const checkInService = new CheckInService(mockPrisma as any);
          const token = checkInService.generateQrToken(eventId, userId, regId);

          const result = await checkInService.checkIn(eventId, token, scannerId);
          
          expect(result.success).toBe(false);
          expect(result.errorCode).toBe(CheckInErrorCode.REGISTRATION_NOT_FOUND);
        }),
        { numRuns: 50 }
      );
    });
  });

  describe('Idempotency', () => {
    it('check-in result should be consistent for same state', async () => {
      await fc.assert(
        fc.asyncProperty(cuidArb, cuidArb, cuidArb, scannerIdArb, async (eventId, userId, regId, scannerId) => {
          const mockPrisma = {
            eventRegistration: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          };

          const checkInService = new CheckInService(mockPrisma as any);
          const token = checkInService.generateQrToken(eventId, userId, regId);
          
          // Always return already-used registration
          const checkInTime = new Date();
          mockPrisma.eventRegistration.findUnique.mockResolvedValue(
            createMockRegistration({
              id: regId,
              eventId,
              userId,
              qrToken: token,
              qrUsed: true,
              status: RegistrationStatus.ATTENDED,
              checkInTime,
            })
          );

          // Multiple calls should return same result
          const result1 = await checkInService.checkIn(eventId, token, scannerId);
          const result2 = await checkInService.checkIn(eventId, token, scannerId);
          const result3 = await checkInService.checkIn(eventId, token, scannerId);
          
          expect(result1.success).toBe(result2.success);
          expect(result2.success).toBe(result3.success);
          expect(result1.errorCode).toBe(result2.errorCode);
          expect(result2.errorCode).toBe(result3.errorCode);
        }),
        { numRuns: 30 }
      );
    });
  });
});
