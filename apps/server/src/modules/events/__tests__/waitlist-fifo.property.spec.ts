import * as fc from 'fast-check';
import { WaitlistStatus } from '@prisma/client';

/**
 * Property Test: Waitlist FIFO Ordering
 * Property 7: Waitlist FIFO Ordering
 * Validates: Requirements 15.2, 15.3
 * 
 * For any waitlist with entries, when a ticket becomes available,
 * the user with the lowest position number (earliest join time)
 * SHALL be notified first.
 */

// Simulated waitlist entry
interface WaitlistEntry {
  id: string;
  userId: string;
  position: number;
  status: WaitlistStatus;
  joinedAt: Date;
}

// Simulated waitlist manager for testing FIFO property
class WaitlistSimulator {
  private entries: WaitlistEntry[] = [];
  private nextId = 1;

  /**
   * Add user to waitlist (FIFO - gets next position)
   */
  join(userId: string): WaitlistEntry {
    // Check if already on waitlist
    const existing = this.entries.find((e) => e.userId === userId);
    if (existing) {
      throw new Error('User already on waitlist');
    }

    const maxPosition = Math.max(0, ...this.entries.map((e) => e.position));
    const entry: WaitlistEntry = {
      id: `entry_${this.nextId++}`,
      userId,
      position: maxPosition + 1,
      status: WaitlistStatus.WAITING,
      joinedAt: new Date(),
    };

    this.entries.push(entry);
    return entry;
  }

  /**
   * Leave waitlist and reorder positions
   */
  leave(userId: string): void {
    const index = this.entries.findIndex((e) => e.userId === userId);
    if (index === -1) {
      throw new Error('User not on waitlist');
    }

    this.entries.splice(index, 1);
    this.reorderPositions();
  }

  /**
   * Get next user to notify (FIFO - lowest position among WAITING)
   */
  getNextToNotify(): WaitlistEntry | null {
    const waiting = this.entries
      .filter((e) => e.status === WaitlistStatus.WAITING)
      .sort((a, b) => a.position - b.position);

    return waiting[0] || null;
  }

  /**
   * Notify next user in line
   */
  notifyNext(): WaitlistEntry | null {
    const next = this.getNextToNotify();
    if (!next) return null;

    next.status = WaitlistStatus.NOTIFIED;
    return next;
  }

  /**
   * Get all entries sorted by position
   */
  getAll(): WaitlistEntry[] {
    return [...this.entries].sort((a, b) => a.position - b.position);
  }

  /**
   * Get waiting entries sorted by position
   */
  getWaiting(): WaitlistEntry[] {
    return this.entries
      .filter((e) => e.status === WaitlistStatus.WAITING)
      .sort((a, b) => a.position - b.position);
  }

  /**
   * Reorder positions to be sequential
   */
  private reorderPositions(): void {
    const sorted = [...this.entries].sort((a, b) => a.position - b.position);
    sorted.forEach((entry, index) => {
      entry.position = index + 1;
    });
  }

  /**
   * Reset for new test
   */
  reset(): void {
    this.entries = [];
    this.nextId = 1;
  }
}

describe('Waitlist FIFO Ordering - Property Tests', () => {
  const numRuns = 100;
  let waitlist: WaitlistSimulator;

  beforeEach(() => {
    waitlist = new WaitlistSimulator();
  });

  describe('Property 7: FIFO Ordering', () => {
    it('users joining waitlist should get sequential positions', () => {
      fc.assert(
        fc.property(
          fc.array(fc.uuid(), { minLength: 1, maxLength: 20 }),
          (userIds) => {
            waitlist.reset();
            const uniqueUserIds = [...new Set(userIds)];

            // Join all users
            const entries: WaitlistEntry[] = [];
            for (const userId of uniqueUserIds) {
              entries.push(waitlist.join(userId));
            }

            // Verify positions are sequential starting from 1
            const positions = entries.map((e) => e.position).sort((a, b) => a - b);
            for (let i = 0; i < positions.length; i++) {
              expect(positions[i]).toBe(i + 1);
            }
          },
        ),
        { numRuns },
      );
    });

    it('first user to join should always be first to be notified', () => {
      fc.assert(
        fc.property(
          fc.array(fc.uuid(), { minLength: 2, maxLength: 20 }),
          (userIds) => {
            waitlist.reset();
            const uniqueUserIds = [...new Set(userIds)];
            if (uniqueUserIds.length < 2) return; // Need at least 2 users

            // Join all users
            for (const userId of uniqueUserIds) {
              waitlist.join(userId);
            }

            // First user to join should be first to notify
            const firstUserId = uniqueUserIds[0];
            const nextToNotify = waitlist.getNextToNotify();

            expect(nextToNotify).not.toBeNull();
            expect(nextToNotify!.userId).toBe(firstUserId);
            expect(nextToNotify!.position).toBe(1);
          },
        ),
        { numRuns },
      );
    });

    it('notification order should match join order', () => {
      fc.assert(
        fc.property(
          fc.array(fc.uuid(), { minLength: 1, maxLength: 10 }),
          (userIds) => {
            waitlist.reset();
            const uniqueUserIds = [...new Set(userIds)];

            // Join all users
            for (const userId of uniqueUserIds) {
              waitlist.join(userId);
            }

            // Notify all users and track order
            const notificationOrder: string[] = [];
            let next = waitlist.notifyNext();
            while (next) {
              notificationOrder.push(next.userId);
              next = waitlist.notifyNext();
            }

            // Notification order should match join order
            expect(notificationOrder).toEqual(uniqueUserIds);
          },
        ),
        { numRuns },
      );
    });

    it('leaving waitlist should not affect FIFO order of remaining users', () => {
      fc.assert(
        fc.property(
          fc.array(fc.uuid(), { minLength: 3, maxLength: 10 }),
          fc.integer({ min: 0, max: 9 }),
          (userIds, leaveIndex) => {
            waitlist.reset();
            const uniqueUserIds = [...new Set(userIds)];
            if (uniqueUserIds.length < 3) return;

            // Join all users
            for (const userId of uniqueUserIds) {
              waitlist.join(userId);
            }

            // Remove one user (not the first one for this test)
            const safeLeaveIndex = (leaveIndex % (uniqueUserIds.length - 1)) + 1;
            const leavingUserId = uniqueUserIds[safeLeaveIndex];
            waitlist.leave(leavingUserId);

            // First user should still be first to notify
            const nextToNotify = waitlist.getNextToNotify();
            expect(nextToNotify).not.toBeNull();
            expect(nextToNotify!.userId).toBe(uniqueUserIds[0]);

            // Remaining users should maintain relative order
            const remaining = waitlist.getWaiting();
            const expectedOrder = uniqueUserIds.filter((id) => id !== leavingUserId);
            const actualOrder = remaining.map((e) => e.userId);
            expect(actualOrder).toEqual(expectedOrder);
          },
        ),
        { numRuns },
      );
    });

    it('positions should be reordered after user leaves', () => {
      fc.assert(
        fc.property(
          fc.array(fc.uuid(), { minLength: 3, maxLength: 10 }),
          fc.integer({ min: 0, max: 9 }),
          (userIds, leaveIndex) => {
            waitlist.reset();
            const uniqueUserIds = [...new Set(userIds)];
            if (uniqueUserIds.length < 3) return;

            // Join all users
            for (const userId of uniqueUserIds) {
              waitlist.join(userId);
            }

            // Remove one user
            const safeLeaveIndex = leaveIndex % uniqueUserIds.length;
            waitlist.leave(uniqueUserIds[safeLeaveIndex]);

            // Positions should be sequential after reordering
            const remaining = waitlist.getAll();
            const positions = remaining.map((e) => e.position).sort((a, b) => a - b);
            
            for (let i = 0; i < positions.length; i++) {
              expect(positions[i]).toBe(i + 1);
            }
          },
        ),
        { numRuns },
      );
    });

    it('lowest position user should always be notified first', () => {
      fc.assert(
        fc.property(
          fc.array(fc.uuid(), { minLength: 1, maxLength: 20 }),
          (userIds) => {
            waitlist.reset();
            const uniqueUserIds = [...new Set(userIds)];

            // Join all users
            for (const userId of uniqueUserIds) {
              waitlist.join(userId);
            }

            // Get next to notify
            const nextToNotify = waitlist.getNextToNotify();
            if (!nextToNotify) return;

            // Should have the lowest position among waiting
            const waiting = waitlist.getWaiting();
            const minPosition = Math.min(...waiting.map((e) => e.position));
            
            expect(nextToNotify.position).toBe(minPosition);
          },
        ),
        { numRuns },
      );
    });
  });

  describe('Property 7: Edge Cases', () => {
    it('empty waitlist should return null for next to notify', () => {
      waitlist.reset();
      expect(waitlist.getNextToNotify()).toBeNull();
    });

    it('single user waitlist should work correctly', () => {
      fc.assert(
        fc.property(fc.uuid(), (userId) => {
          waitlist.reset();
          
          const entry = waitlist.join(userId);
          expect(entry.position).toBe(1);
          
          const next = waitlist.getNextToNotify();
          expect(next).not.toBeNull();
          expect(next!.userId).toBe(userId);
          expect(next!.position).toBe(1);
        }),
        { numRuns },
      );
    });

    it('duplicate user join should throw error', () => {
      fc.assert(
        fc.property(fc.uuid(), (userId) => {
          waitlist.reset();
          
          waitlist.join(userId);
          expect(() => waitlist.join(userId)).toThrow('User already on waitlist');
        }),
        { numRuns },
      );
    });

    it('leaving non-existent user should throw error', () => {
      fc.assert(
        fc.property(fc.uuid(), (userId) => {
          waitlist.reset();
          expect(() => waitlist.leave(userId)).toThrow('User not on waitlist');
        }),
        { numRuns },
      );
    });
  });

  describe('Property 7: Notification State Transitions', () => {
    it('notified users should not be considered for next notification', () => {
      fc.assert(
        fc.property(
          fc.array(fc.uuid(), { minLength: 2, maxLength: 10 }),
          (userIds) => {
            waitlist.reset();
            const uniqueUserIds = [...new Set(userIds)];
            if (uniqueUserIds.length < 2) return;

            // Join all users
            for (const userId of uniqueUserIds) {
              waitlist.join(userId);
            }

            // Notify first user
            const first = waitlist.notifyNext();
            expect(first).not.toBeNull();
            expect(first!.status).toBe(WaitlistStatus.NOTIFIED);

            // Next to notify should be second user
            const second = waitlist.getNextToNotify();
            expect(second).not.toBeNull();
            expect(second!.userId).toBe(uniqueUserIds[1]);
            expect(second!.userId).not.toBe(first!.userId);
          },
        ),
        { numRuns },
      );
    });

    it('all users notified should result in null for next', () => {
      fc.assert(
        fc.property(
          fc.array(fc.uuid(), { minLength: 1, maxLength: 5 }),
          (userIds) => {
            waitlist.reset();
            const uniqueUserIds = [...new Set(userIds)];

            // Join all users
            for (const userId of uniqueUserIds) {
              waitlist.join(userId);
            }

            // Notify all users
            for (let i = 0; i < uniqueUserIds.length; i++) {
              waitlist.notifyNext();
            }

            // No more users to notify
            expect(waitlist.getNextToNotify()).toBeNull();
          },
        ),
        { numRuns },
      );
    });
  });
});
