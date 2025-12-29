import * as fc from 'fast-check';

/**
 * Property Test: Data Retention Compliance
 * Validates: Requirements 23.1, 23.4
 * 
 * Property 15: Data Retention Compliance
 * Registrations SHALL be soft-deleted 14 days after event end.
 * Certificates SHALL be preserved indefinitely.
 * Anonymized analytics SHALL be preserved.
 * 
 * Properties tested:
 * 1. Registrations older than 14 days are soft-deleted
 * 2. Certificates are never deleted
 * 3. Registrations with certificates are preserved
 * 4. Soft-deleted registrations are excluded from queries
 * 5. Analytics data is preserved after cleanup
 */

interface Event {
  id: string;
  endsAt: Date;
  deletedAt: Date | null;
}

interface Registration {
  id: string;
  eventId: string;
  userId: string;
  deletedAt: Date | null;
  hasCertificate: boolean;
}

interface Certificate {
  id: string;
  registrationId: string;
  eventId: string;
}

interface AnalyticsData {
  eventId: string;
  totalRegistrations: number;
  totalCheckIns: number;
  revenue: number;
}

/**
 * Simulated data retention service
 */
class DataRetentionSimulator {
  private events: Map<string, Event> = new Map();
  private registrations: Map<string, Registration> = new Map();
  private certificates: Map<string, Certificate> = new Map();
  private analytics: Map<string, AnalyticsData> = new Map();

  private readonly RETENTION_DAYS = 14;

  reset() {
    this.events = new Map();
    this.registrations = new Map();
    this.certificates = new Map();
    this.analytics = new Map();
  }

  setupEvent(event: Event) {
    this.events.set(event.id, event);
    // Initialize analytics
    this.analytics.set(event.id, {
      eventId: event.id,
      totalRegistrations: 0,
      totalCheckIns: 0,
      revenue: 0,
    });
  }

  addRegistration(registration: Registration) {
    this.registrations.set(registration.id, registration);
    // Update analytics
    const analytics = this.analytics.get(registration.eventId);
    if (analytics) {
      analytics.totalRegistrations++;
    }
  }

  addCertificate(certificate: Certificate) {
    this.certificates.set(certificate.id, certificate);
    // Mark registration as having certificate
    const registration = this.registrations.get(certificate.registrationId);
    if (registration) {
      registration.hasCertificate = true;
    }
  }

  /**
   * Run cleanup for a given "current" date
   */
  runCleanup(currentDate: Date): { softDeletedCount: number; preservedCount: number } {
    const cutoffDate = new Date(currentDate);
    cutoffDate.setDate(cutoffDate.getDate() - this.RETENTION_DAYS);

    let softDeletedCount = 0;
    let preservedCount = 0;

    // Find events that ended before cutoff
    for (const event of this.events.values()) {
      if (event.endsAt < cutoffDate && !event.deletedAt) {
        // Process registrations for this event
        for (const registration of this.registrations.values()) {
          if (registration.eventId === event.id && !registration.deletedAt) {
            if (registration.hasCertificate) {
              // Preserve registration with certificate
              preservedCount++;
            } else {
              // Soft delete registration
              registration.deletedAt = currentDate;
              softDeletedCount++;
            }
          }
        }
      }
    }

    return { softDeletedCount, preservedCount };
  }

  /**
   * Get active registrations (excluding soft-deleted)
   */
  getActiveRegistrations(eventId: string): Registration[] {
    return Array.from(this.registrations.values()).filter(
      r => r.eventId === eventId && !r.deletedAt
    );
  }

  /**
   * Get all certificates (never deleted)
   */
  getCertificates(eventId: string): Certificate[] {
    return Array.from(this.certificates.values()).filter(
      c => c.eventId === eventId
    );
  }

  /**
   * Get analytics (preserved after cleanup)
   */
  getAnalytics(eventId: string): AnalyticsData | undefined {
    return this.analytics.get(eventId);
  }

  getRegistration(id: string): Registration | undefined {
    return this.registrations.get(id);
  }
}

describe('Data Retention Compliance Properties', () => {
  let simulator: DataRetentionSimulator;

  beforeEach(() => {
    simulator = new DataRetentionSimulator();
  });

  // Arbitraries
  const eventIdArb = fc.uuid();
  const registrationIdArb = fc.uuid();
  const userIdArb = fc.uuid();
  const certificateIdArb = fc.uuid();
  
  // Date arbitraries
  const pastDateArb = fc.date({
    min: new Date('2020-01-01'),
    max: new Date('2024-12-01'),
  });

  const createEvent = (id: string, endsAt: Date): Event => ({
    id,
    endsAt,
    deletedAt: null,
  });

  const createRegistration = (
    id: string,
    eventId: string,
    userId: string,
    hasCertificate = false
  ): Registration => ({
    id,
    eventId,
    userId,
    deletedAt: null,
    hasCertificate,
  });

  const createCertificate = (
    id: string,
    registrationId: string,
    eventId: string
  ): Certificate => ({
    id,
    registrationId,
    eventId,
  });

  /**
   * Feature: events-system-redesign, Property 15: Data Retention Compliance
   * Validates: Requirements 23.1, 23.4
   */
  test('Property 1: Registrations older than 14 days are soft-deleted', () => {
    fc.assert(
      fc.property(
        eventIdArb,
        registrationIdArb,
        userIdArb,
        pastDateArb,
        (eventId, regId, userId, eventEndDate) => {
          simulator.reset();

          // Event ended in the past
          simulator.setupEvent(createEvent(eventId, eventEndDate));
          simulator.addRegistration(createRegistration(regId, eventId, userId));

          // Run cleanup 15 days after event end
          const cleanupDate = new Date(eventEndDate);
          cleanupDate.setDate(cleanupDate.getDate() + 15);

          const result = simulator.runCleanup(cleanupDate);

          // Registration should be soft-deleted
          expect(result.softDeletedCount).toBe(1);
          
          const registration = simulator.getRegistration(regId);
          expect(registration?.deletedAt).not.toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 2: Registrations within 14 days are NOT deleted', () => {
    fc.assert(
      fc.property(
        eventIdArb,
        registrationIdArb,
        userIdArb,
        pastDateArb,
        fc.integer({ min: 0, max: 13 }),
        (eventId, regId, userId, eventEndDate, daysAfter) => {
          simulator.reset();

          simulator.setupEvent(createEvent(eventId, eventEndDate));
          simulator.addRegistration(createRegistration(regId, eventId, userId));

          // Run cleanup within 14 days of event end
          const cleanupDate = new Date(eventEndDate);
          cleanupDate.setDate(cleanupDate.getDate() + daysAfter);

          const result = simulator.runCleanup(cleanupDate);

          // Registration should NOT be soft-deleted
          expect(result.softDeletedCount).toBe(0);
          
          const registration = simulator.getRegistration(regId);
          expect(registration?.deletedAt).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 3: Certificates are never deleted', () => {
    fc.assert(
      fc.property(
        eventIdArb,
        registrationIdArb,
        userIdArb,
        certificateIdArb,
        pastDateArb,
        fc.integer({ min: 15, max: 365 }),
        (eventId, regId, userId, certId, eventEndDate, daysAfter) => {
          simulator.reset();

          simulator.setupEvent(createEvent(eventId, eventEndDate));
          simulator.addRegistration(createRegistration(regId, eventId, userId));
          simulator.addCertificate(createCertificate(certId, regId, eventId));

          // Run cleanup long after event end
          const cleanupDate = new Date(eventEndDate);
          cleanupDate.setDate(cleanupDate.getDate() + daysAfter);

          simulator.runCleanup(cleanupDate);

          // Certificate should still exist
          const certificates = simulator.getCertificates(eventId);
          expect(certificates.length).toBe(1);
          expect(certificates[0].id).toBe(certId);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 4: Registrations with certificates are preserved', () => {
    fc.assert(
      fc.property(
        eventIdArb,
        registrationIdArb,
        userIdArb,
        certificateIdArb,
        pastDateArb,
        (eventId, regId, userId, certId, eventEndDate) => {
          simulator.reset();

          simulator.setupEvent(createEvent(eventId, eventEndDate));
          simulator.addRegistration(createRegistration(regId, eventId, userId));
          simulator.addCertificate(createCertificate(certId, regId, eventId));

          // Run cleanup 30 days after event end
          const cleanupDate = new Date(eventEndDate);
          cleanupDate.setDate(cleanupDate.getDate() + 30);

          const result = simulator.runCleanup(cleanupDate);

          // Registration should be preserved (not soft-deleted)
          expect(result.preservedCount).toBe(1);
          expect(result.softDeletedCount).toBe(0);
          
          const registration = simulator.getRegistration(regId);
          expect(registration?.deletedAt).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Soft-deleted registrations are excluded from active queries', () => {
    fc.assert(
      fc.property(
        eventIdArb,
        fc.array(registrationIdArb, { minLength: 2, maxLength: 10 }),
        fc.array(userIdArb, { minLength: 2, maxLength: 10 }),
        pastDateArb,
        (eventId, regIds, userIds, eventEndDate) => {
          simulator.reset();

          // Ensure unique IDs
          const uniqueRegIds = [...new Set(regIds)];
          const uniqueUserIds = [...new Set(userIds)];
          const count = Math.min(uniqueRegIds.length, uniqueUserIds.length);

          simulator.setupEvent(createEvent(eventId, eventEndDate));

          // Add registrations
          for (let i = 0; i < count; i++) {
            simulator.addRegistration(
              createRegistration(uniqueRegIds[i], eventId, uniqueUserIds[i])
            );
          }

          // Before cleanup
          const beforeCleanup = simulator.getActiveRegistrations(eventId);
          expect(beforeCleanup.length).toBe(count);

          // Run cleanup 15 days after event end
          const cleanupDate = new Date(eventEndDate);
          cleanupDate.setDate(cleanupDate.getDate() + 15);
          simulator.runCleanup(cleanupDate);

          // After cleanup - active registrations should be 0
          const afterCleanup = simulator.getActiveRegistrations(eventId);
          expect(afterCleanup.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 6: Analytics data is preserved after cleanup', () => {
    fc.assert(
      fc.property(
        eventIdArb,
        fc.array(registrationIdArb, { minLength: 1, maxLength: 20 }),
        fc.array(userIdArb, { minLength: 1, maxLength: 20 }),
        pastDateArb,
        (eventId, regIds, userIds, eventEndDate) => {
          simulator.reset();

          const uniqueRegIds = [...new Set(regIds)];
          const uniqueUserIds = [...new Set(userIds)];
          const count = Math.min(uniqueRegIds.length, uniqueUserIds.length);

          simulator.setupEvent(createEvent(eventId, eventEndDate));

          for (let i = 0; i < count; i++) {
            simulator.addRegistration(
              createRegistration(uniqueRegIds[i], eventId, uniqueUserIds[i])
            );
          }

          // Get analytics before cleanup
          const analyticsBefore = simulator.getAnalytics(eventId);
          expect(analyticsBefore?.totalRegistrations).toBe(count);

          // Run cleanup
          const cleanupDate = new Date(eventEndDate);
          cleanupDate.setDate(cleanupDate.getDate() + 15);
          simulator.runCleanup(cleanupDate);

          // Analytics should be preserved
          const analyticsAfter = simulator.getAnalytics(eventId);
          expect(analyticsAfter?.totalRegistrations).toBe(count);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 7: Cleanup is idempotent', () => {
    fc.assert(
      fc.property(
        eventIdArb,
        registrationIdArb,
        userIdArb,
        pastDateArb,
        fc.integer({ min: 2, max: 5 }),
        (eventId, regId, userId, eventEndDate, cleanupRuns) => {
          simulator.reset();

          simulator.setupEvent(createEvent(eventId, eventEndDate));
          simulator.addRegistration(createRegistration(regId, eventId, userId));

          const cleanupDate = new Date(eventEndDate);
          cleanupDate.setDate(cleanupDate.getDate() + 15);

          // Run cleanup multiple times
          let totalDeleted = 0;
          for (let i = 0; i < cleanupRuns; i++) {
            const result = simulator.runCleanup(cleanupDate);
            totalDeleted += result.softDeletedCount;
          }

          // Should only delete once
          expect(totalDeleted).toBe(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Edge cases
  describe('Edge Cases', () => {
    test('Event with no registrations', () => {
      simulator.setupEvent(createEvent('event_empty', new Date('2024-01-01')));
      
      const cleanupDate = new Date('2024-01-20');
      const result = simulator.runCleanup(cleanupDate);

      expect(result.softDeletedCount).toBe(0);
      expect(result.preservedCount).toBe(0);
    });

    test('Mixed registrations - some with certificates, some without', () => {
      const eventEndDate = new Date('2024-01-01');
      simulator.setupEvent(createEvent('event_mixed', eventEndDate));
      
      // Registration without certificate
      simulator.addRegistration(createRegistration('reg_1', 'event_mixed', 'user_1'));
      
      // Registration with certificate
      simulator.addRegistration(createRegistration('reg_2', 'event_mixed', 'user_2'));
      simulator.addCertificate(createCertificate('cert_1', 'reg_2', 'event_mixed'));

      const cleanupDate = new Date('2024-01-20');
      const result = simulator.runCleanup(cleanupDate);

      expect(result.softDeletedCount).toBe(1); // reg_1
      expect(result.preservedCount).toBe(1); // reg_2

      expect(simulator.getRegistration('reg_1')?.deletedAt).not.toBeNull();
      expect(simulator.getRegistration('reg_2')?.deletedAt).toBeNull();
    });

    test('Cleanup exactly on 14-day boundary', () => {
      const eventEndDate = new Date('2024-01-01');
      simulator.setupEvent(createEvent('event_boundary', eventEndDate));
      simulator.addRegistration(createRegistration('reg_boundary', 'event_boundary', 'user_1'));

      // Exactly 14 days after
      const cleanupDate = new Date('2024-01-15');
      const result = simulator.runCleanup(cleanupDate);

      // Should NOT be deleted (cutoff is < 14 days, not <=)
      expect(result.softDeletedCount).toBe(0);
    });
  });
});
