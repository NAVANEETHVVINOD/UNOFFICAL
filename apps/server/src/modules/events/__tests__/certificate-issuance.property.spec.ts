import * as fc from 'fast-check';
import { RegistrationStatus } from '@prisma/client';

/**
 * Property Test: Certificate Issuance Rules
 * Property 10: Certificate Issuance Rules
 * Validates: Requirements 8.3, 8.4
 * 
 * For any event with auto-issue enabled, certificates SHALL only be
 * issued to registrations where checkInTime is not null (user attended).
 */

// Simulated registration for testing
interface Registration {
  id: string;
  userId: string;
  eventId: string;
  status: RegistrationStatus;
  checkInTime: Date | null;
  certificateId: string | null;
}

// Simulated event for testing
interface Event {
  id: string;
  certificateEnabled: boolean;
  autoIssueCertificate: boolean;
}

// Certificate issuance simulator
class CertificateIssuanceSimulator {
  private certificates: Map<string, { userId: string; eventId: string }> = new Map();
  private nextCertId = 1;

  /**
   * Check if a registration is eligible for certificate
   * Property 10: Certificate Issuance Rules
   */
  isEligible(event: Event, registration: Registration): {
    eligible: boolean;
    reason?: string;
  } {
    if (!event.certificateEnabled) {
      return { eligible: false, reason: 'Certificates not enabled' };
    }

    if (registration.eventId !== event.id) {
      return { eligible: false, reason: 'Registration is for different event' };
    }

    // Property 10: Only ATTENDED status (which requires checkInTime)
    if (registration.status !== RegistrationStatus.ATTENDED) {
      return { eligible: false, reason: 'User has not attended the event' };
    }

    // Double-check: ATTENDED status should always have checkInTime
    if (!registration.checkInTime) {
      return { eligible: false, reason: 'No check-in time recorded' };
    }

    if (registration.certificateId) {
      return { eligible: false, reason: 'Certificate already issued' };
    }

    return { eligible: true };
  }

  /**
   * Issue certificate if eligible
   */
  issueCertificate(
    event: Event,
    registration: Registration,
  ): { success: boolean; certificateId?: string; error?: string } {
    const eligibility = this.isEligible(event, registration);

    if (!eligibility.eligible) {
      return { success: false, error: eligibility.reason };
    }

    const certId = `cert_${this.nextCertId++}`;
    this.certificates.set(certId, {
      userId: registration.userId,
      eventId: registration.eventId,
    });

    return { success: true, certificateId: certId };
  }

  /**
   * Auto-issue certificates to all eligible registrations
   */
  autoIssueCertificates(
    event: Event,
    registrations: Registration[],
  ): { issued: string[]; skipped: string[] } {
    const issued: string[] = [];
    const skipped: string[] = [];

    for (const reg of registrations) {
      const result = this.issueCertificate(event, reg);
      if (result.success && result.certificateId) {
        issued.push(reg.userId);
      } else {
        skipped.push(reg.userId);
      }
    }

    return { issued, skipped };
  }

  reset(): void {
    this.certificates.clear();
    this.nextCertId = 1;
  }
}

// Arbitrary generators
const registrationStatusArbitrary = fc.constantFrom(
  RegistrationStatus.PENDING,
  RegistrationStatus.CONFIRMED,
  RegistrationStatus.CANCELLED,
  RegistrationStatus.REFUNDED,
  RegistrationStatus.ATTENDED,
);

const registrationArbitrary = (eventId: string) =>
  fc.record({
    id: fc.uuid(),
    userId: fc.uuid(),
    eventId: fc.constant(eventId),
    status: registrationStatusArbitrary,
    checkInTime: fc.option(fc.date(), { nil: null }),
    certificateId: fc.constant(null as string | null),
  }).map((reg) => {
    // Ensure ATTENDED status always has checkInTime (business rule)
    if (reg.status === RegistrationStatus.ATTENDED && !reg.checkInTime) {
      reg.checkInTime = new Date();
    }
    return reg;
  });

const eventArbitrary = fc.record({
  id: fc.uuid(),
  certificateEnabled: fc.boolean(),
  autoIssueCertificate: fc.boolean(),
});

describe('Certificate Issuance Rules - Property Tests', () => {
  const numRuns = 100;
  let simulator: CertificateIssuanceSimulator;

  beforeEach(() => {
    simulator = new CertificateIssuanceSimulator();
  });

  describe('Property 10: Certificate Issuance Rules', () => {
    it('certificates should only be issued to ATTENDED registrations', () => {
      fc.assert(
        fc.property(
          eventArbitrary,
          fc.array(fc.uuid(), { minLength: 1, maxLength: 10 }),
          (event, userIds) => {
            simulator.reset();
            event.certificateEnabled = true; // Ensure certificates are enabled

            const registrations = userIds.map((userId, i) =>
              fc.sample(registrationArbitrary(event.id), 1)[0],
            );

            for (const reg of registrations) {
              const result = simulator.issueCertificate(event, reg);

              if (result.success) {
                // If certificate was issued, registration MUST be ATTENDED
                expect(reg.status).toBe(RegistrationStatus.ATTENDED);
                expect(reg.checkInTime).not.toBeNull();
              }
            }
          },
        ),
        { numRuns },
      );
    });

    it('non-ATTENDED registrations should never receive certificates', () => {
      fc.assert(
        fc.property(
          eventArbitrary,
          registrationStatusArbitrary,
          fc.uuid(),
          (event, status, userId) => {
            simulator.reset();
            event.certificateEnabled = true;

            // Skip ATTENDED status for this test
            if (status === RegistrationStatus.ATTENDED) return;

            const registration: Registration = {
              id: `reg_${userId}`,
              userId,
              eventId: event.id,
              status,
              checkInTime: null,
              certificateId: null,
            };

            const result = simulator.issueCertificate(event, registration);

            // Should NOT be successful for non-ATTENDED
            expect(result.success).toBe(false);
            expect(result.error).toBeDefined();
          },
        ),
        { numRuns },
      );
    });

    it('ATTENDED registrations with checkInTime should be eligible', () => {
      fc.assert(
        fc.property(eventArbitrary, fc.uuid(), fc.date(), (event, userId, checkInTime) => {
          simulator.reset();
          event.certificateEnabled = true;

          const registration: Registration = {
            id: `reg_${userId}`,
            userId,
            eventId: event.id,
            status: RegistrationStatus.ATTENDED,
            checkInTime,
            certificateId: null,
          };

          const eligibility = simulator.isEligible(event, registration);
          expect(eligibility.eligible).toBe(true);
        }),
        { numRuns },
      );
    });

    it('certificates should not be issued when certificateEnabled is false', () => {
      fc.assert(
        fc.property(fc.uuid(), fc.uuid(), fc.date(), (eventId, userId, checkInTime) => {
          simulator.reset();

          const event: Event = {
            id: eventId,
            certificateEnabled: false,
            autoIssueCertificate: false,
          };

          const registration: Registration = {
            id: `reg_${userId}`,
            userId,
            eventId,
            status: RegistrationStatus.ATTENDED,
            checkInTime,
            certificateId: null,
          };

          const result = simulator.issueCertificate(event, registration);
          expect(result.success).toBe(false);
          expect(result.error).toBe('Certificates not enabled');
        }),
        { numRuns },
      );
    });

    it('duplicate certificates should not be issued', () => {
      fc.assert(
        fc.property(fc.uuid(), fc.uuid(), fc.date(), (eventId, userId, checkInTime) => {
          simulator.reset();

          const event: Event = {
            id: eventId,
            certificateEnabled: true,
            autoIssueCertificate: true,
          };

          const registration: Registration = {
            id: `reg_${userId}`,
            userId,
            eventId,
            status: RegistrationStatus.ATTENDED,
            checkInTime,
            certificateId: null,
          };

          // First issuance should succeed
          const result1 = simulator.issueCertificate(event, registration);
          expect(result1.success).toBe(true);

          // Mark registration as having certificate
          registration.certificateId = result1.certificateId!;

          // Second issuance should fail
          const result2 = simulator.issueCertificate(event, registration);
          expect(result2.success).toBe(false);
          expect(result2.error).toBe('Certificate already issued');
        }),
        { numRuns },
      );
    });
  });

  describe('Property 10: Auto-Issue Behavior', () => {
    it('auto-issue should only issue to ATTENDED registrations', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.array(registrationStatusArbitrary, { minLength: 1, maxLength: 20 }),
          (eventId, statuses) => {
            simulator.reset();

            const event: Event = {
              id: eventId,
              certificateEnabled: true,
              autoIssueCertificate: true,
            };

            const registrations: Registration[] = statuses.map((status, i) => ({
              id: `reg_${i}`,
              userId: `user_${i}`,
              eventId,
              status,
              checkInTime: status === RegistrationStatus.ATTENDED ? new Date() : null,
              certificateId: null,
            }));

            const { issued, skipped } = simulator.autoIssueCertificates(
              event,
              registrations,
            );

            // Count expected
            const expectedIssued = registrations.filter(
              (r) => r.status === RegistrationStatus.ATTENDED,
            ).length;

            expect(issued.length).toBe(expectedIssued);
            expect(skipped.length).toBe(registrations.length - expectedIssued);

            // Verify all issued are ATTENDED
            for (const userId of issued) {
              const reg = registrations.find((r) => r.userId === userId);
              expect(reg?.status).toBe(RegistrationStatus.ATTENDED);
            }
          },
        ),
        { numRuns },
      );
    });

    it('auto-issue should skip registrations with existing certificates', () => {
      fc.assert(
        fc.property(
          fc.uuid(),
          fc.integer({ min: 1, max: 10 }),
          fc.integer({ min: 0, max: 9 }),
          (eventId, count, alreadyIssuedIndex) => {
            simulator.reset();

            const event: Event = {
              id: eventId,
              certificateEnabled: true,
              autoIssueCertificate: true,
            };

            const registrations: Registration[] = Array.from({ length: count }, (_, i) => ({
              id: `reg_${i}`,
              userId: `user_${i}`,
              eventId,
              status: RegistrationStatus.ATTENDED,
              checkInTime: new Date(),
              certificateId: null,
            }));

            // Mark one as already having certificate
            const safeIndex = alreadyIssuedIndex % count;
            registrations[safeIndex].certificateId = 'existing_cert';

            const { issued, skipped } = simulator.autoIssueCertificates(
              event,
              registrations,
            );

            // Should issue to all except the one with existing certificate
            expect(issued.length).toBe(count - 1);
            expect(skipped.length).toBe(1);
            expect(skipped).toContain(registrations[safeIndex].userId);
          },
        ),
        { numRuns },
      );
    });
  });

  describe('Property 10: Edge Cases', () => {
    it('registration for different event should not receive certificate', () => {
      fc.assert(
        fc.property(fc.uuid(), fc.uuid(), fc.uuid(), (eventId1, eventId2, userId) => {
          simulator.reset();

          // Ensure different event IDs
          if (eventId1 === eventId2) return;

          const event: Event = {
            id: eventId1,
            certificateEnabled: true,
            autoIssueCertificate: true,
          };

          const registration: Registration = {
            id: `reg_${userId}`,
            userId,
            eventId: eventId2, // Different event!
            status: RegistrationStatus.ATTENDED,
            checkInTime: new Date(),
            certificateId: null,
          };

          const result = simulator.issueCertificate(event, registration);
          expect(result.success).toBe(false);
          expect(result.error).toBe('Registration is for different event');
        }),
        { numRuns },
      );
    });

    it('empty registration list should return empty results', () => {
      fc.assert(
        fc.property(fc.uuid(), (eventId) => {
          simulator.reset();

          const event: Event = {
            id: eventId,
            certificateEnabled: true,
            autoIssueCertificate: true,
          };

          const { issued, skipped } = simulator.autoIssueCertificates(event, []);

          expect(issued.length).toBe(0);
          expect(skipped.length).toBe(0);
        }),
        { numRuns },
      );
    });
  });
});
