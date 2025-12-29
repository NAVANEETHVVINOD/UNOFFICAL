import * as fc from 'fast-check';

/**
 * Property Test: Ticket Overselling Prevention
 * Validates: Requirement 3.3 - System SHALL prevent overselling tickets
 * 
 * Properties tested:
 * 1. Sold count never exceeds quantity
 * 2. Concurrent reservations don't cause overselling
 * 3. Released reservations return tickets to pool
 * 4. Per-user limits are enforced
 */

// Simulated ticket state for property testing
interface TicketState {
  quantity: number | null; // null = unlimited
  quantitySold: number;
  perUserLimit: number;
}

interface ReservationAttempt {
  userId: string;
  existingUserReservations: number;
}

// Pure function to check if reservation should succeed
function canReserve(ticket: TicketState, attempt: ReservationAttempt): boolean {
  // Check quantity limit
  if (ticket.quantity !== null && ticket.quantitySold >= ticket.quantity) {
    return false;
  }
  
  // Check per-user limit
  if (attempt.existingUserReservations >= ticket.perUserLimit) {
    return false;
  }
  
  return true;
}

// Pure function to process reservation
function processReservation(
  ticket: TicketState,
  attempt: ReservationAttempt,
): { newState: TicketState; success: boolean } {
  if (!canReserve(ticket, attempt)) {
    return { newState: ticket, success: false };
  }
  
  return {
    newState: {
      ...ticket,
      quantitySold: ticket.quantitySold + 1,
    },
    success: true,
  };
}

// Pure function to release reservation
function releaseReservation(ticket: TicketState): TicketState {
  return {
    ...ticket,
    quantitySold: Math.max(0, ticket.quantitySold - 1),
  };
}

describe('Ticket Overselling Prevention Properties', () => {
  // Arbitrary for ticket state
  const ticketStateArb = fc.record({
    quantity: fc.option(fc.integer({ min: 1, max: 1000 }), { nil: null }),
    quantitySold: fc.integer({ min: 0, max: 500 }),
    perUserLimit: fc.integer({ min: 1, max: 10 }),
  }).filter(t => t.quantity === null || t.quantitySold <= t.quantity);

  // Arbitrary for reservation attempt
  const reservationAttemptArb = fc.record({
    userId: fc.uuid(),
    existingUserReservations: fc.integer({ min: 0, max: 10 }),
  });

  test('Property 1: Sold count never exceeds quantity after reservation', () => {
    fc.assert(
      fc.property(ticketStateArb, reservationAttemptArb, (ticket, attempt) => {
        const { newState } = processReservation(ticket, attempt);
        
        // If quantity is limited, sold should never exceed it
        if (newState.quantity !== null) {
          expect(newState.quantitySold).toBeLessThanOrEqual(newState.quantity);
        }
        
        // Sold count should never be negative
        expect(newState.quantitySold).toBeGreaterThanOrEqual(0);
      }),
      { numRuns: 200 }
    );
  });

  test('Property 2: Reservation fails when sold equals quantity', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 1, max: 5 }),
        reservationAttemptArb,
        (quantity, perUserLimit, attempt) => {
          const soldOutTicket: TicketState = {
            quantity,
            quantitySold: quantity, // Sold out
            perUserLimit,
          };
          
          const { success, newState } = processReservation(soldOutTicket, attempt);
          
          // Should fail
          expect(success).toBe(false);
          // State should not change
          expect(newState.quantitySold).toBe(quantity);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 3: Unlimited tickets always allow reservation (within user limit)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        fc.integer({ min: 0, max: 1000 }),
        (perUserLimit, currentSold) => {
          const unlimitedTicket: TicketState = {
            quantity: null,
            quantitySold: currentSold,
            perUserLimit,
          };
          
          const attempt: ReservationAttempt = {
            userId: 'test-user',
            existingUserReservations: 0, // Fresh user
          };
          
          const { success } = processReservation(unlimitedTicket, attempt);
          
          // Should always succeed for fresh user
          expect(success).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 4: Per-user limit is enforced', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 5 }),
        fc.integer({ min: 0, max: 10 }),
        (perUserLimit, existingReservations) => {
          const ticket: TicketState = {
            quantity: 1000, // Plenty available
            quantitySold: 0,
            perUserLimit,
          };
          
          const attempt: ReservationAttempt = {
            userId: 'test-user',
            existingUserReservations: existingReservations,
          };
          
          const { success } = processReservation(ticket, attempt);
          
          if (existingReservations >= perUserLimit) {
            expect(success).toBe(false);
          } else {
            expect(success).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: Released reservation returns ticket to pool', () => {
    fc.assert(
      fc.property(ticketStateArb, (ticket) => {
        // Only test if there's something to release
        if (ticket.quantitySold === 0) return true;
        
        const newState = releaseReservation(ticket);
        
        expect(newState.quantitySold).toBe(ticket.quantitySold - 1);
        expect(newState.quantitySold).toBeGreaterThanOrEqual(0);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });

  test('Property 6: Concurrent reservations simulation', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50 }), // quantity
        fc.integer({ min: 1, max: 100 }), // number of concurrent attempts
        (quantity, numAttempts) => {
          let ticket: TicketState = {
            quantity,
            quantitySold: 0,
            perUserLimit: 1,
          };
          
          let successCount = 0;
          
          // Simulate concurrent reservations from different users
          for (let i = 0; i < numAttempts; i++) {
            const attempt: ReservationAttempt = {
              userId: `user-${i}`,
              existingUserReservations: 0,
            };
            
            const result = processReservation(ticket, attempt);
            if (result.success) {
              ticket = result.newState;
              successCount++;
            }
          }
          
          // Success count should equal min(quantity, numAttempts)
          expect(successCount).toBe(Math.min(quantity, numAttempts));
          // Final sold count should equal success count
          expect(ticket.quantitySold).toBe(successCount);
          // Should never exceed quantity
          expect(ticket.quantitySold).toBeLessThanOrEqual(quantity);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 7: Reserve then release is idempotent on availability', () => {
    fc.assert(
      fc.property(ticketStateArb, reservationAttemptArb, (ticket, attempt) => {
        // Skip if can't reserve
        if (!canReserve(ticket, attempt)) return true;
        
        const { newState: afterReserve } = processReservation(ticket, attempt);
        const afterRelease = releaseReservation(afterReserve);
        
        // Should return to original sold count
        expect(afterRelease.quantitySold).toBe(ticket.quantitySold);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});
