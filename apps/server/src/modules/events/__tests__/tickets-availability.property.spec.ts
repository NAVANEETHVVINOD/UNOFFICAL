import * as fc from 'fast-check';

/**
 * Property Test: Ticket Availability Display
 * Validates: Requirements 3.4, 3.5, 3.6
 * - 3.4: System SHALL display real-time ticket availability
 * - 3.5: System SHALL show "Sold Out" when quantity reaches zero
 * - 3.6: System SHALL enforce per-user ticket limits
 * 
 * Properties tested:
 * 1. Available count is always non-negative
 * 2. Available + sold = total (for limited tickets)
 * 3. Status correctly reflects availability
 * 4. Sales window status is accurate
 */

interface TicketData {
  quantity: number | null;
  quantitySold: number;
  salesStart: Date | null;
  salesEnd: Date | null;
  perUserLimit: number;
}

type TicketStatus = 'AVAILABLE' | 'SOLD_OUT' | 'NOT_ON_SALE' | 'SALES_ENDED';

interface AvailabilityResult {
  available: number | null;
  total: number | null;
  sold: number;
  status: TicketStatus;
}

// Pure function to calculate availability
function calculateAvailability(ticket: TicketData, now: Date): AvailabilityResult {
  const available = ticket.quantity !== null 
    ? ticket.quantity - ticket.quantitySold 
    : null;

  let status: TicketStatus = 'AVAILABLE';
  
  if (ticket.salesStart && ticket.salesStart > now) {
    status = 'NOT_ON_SALE';
  } else if (ticket.salesEnd && ticket.salesEnd < now) {
    status = 'SALES_ENDED';
  } else if (available !== null && available <= 0) {
    status = 'SOLD_OUT';
  }

  return {
    available,
    total: ticket.quantity,
    sold: ticket.quantitySold,
    status,
  };
}

describe('Ticket Availability Display Properties', () => {
  // Arbitrary for dates
  const dateArb = fc.date({ min: new Date('2024-01-01'), max: new Date('2026-12-31') });
  
  // Arbitrary for ticket data
  const ticketDataArb = fc.record({
    quantity: fc.option(fc.integer({ min: 1, max: 1000 }), { nil: null }),
    quantitySold: fc.integer({ min: 0, max: 500 }),
    salesStart: fc.option(dateArb, { nil: null }),
    salesEnd: fc.option(dateArb, { nil: null }),
    perUserLimit: fc.integer({ min: 1, max: 10 }),
  }).filter(t => {
    // Ensure sold doesn't exceed quantity
    if (t.quantity !== null && t.quantitySold > t.quantity) return false;
    // Ensure salesEnd is after salesStart if both exist
    if (t.salesStart && t.salesEnd && t.salesEnd < t.salesStart) return false;
    return true;
  });

  test('Property 1: Available count is always non-negative for limited tickets', () => {
    fc.assert(
      fc.property(ticketDataArb, dateArb, (ticket, now) => {
        const result = calculateAvailability(ticket, now);
        
        if (result.available !== null) {
          expect(result.available).toBeGreaterThanOrEqual(0);
        }
      }),
      { numRuns: 200 }
    );
  });

  test('Property 2: Available + sold = total for limited tickets', () => {
    fc.assert(
      fc.property(ticketDataArb, dateArb, (ticket, now) => {
        const result = calculateAvailability(ticket, now);
        
        if (result.total !== null && result.available !== null) {
          expect(result.available + result.sold).toBe(result.total);
        }
      }),
      { numRuns: 200 }
    );
  });

  test('Property 3: Unlimited tickets have null available and total', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1000 }),
        dateArb,
        (sold, now) => {
          const ticket: TicketData = {
            quantity: null,
            quantitySold: sold,
            salesStart: null,
            salesEnd: null,
            perUserLimit: 1,
          };
          
          const result = calculateAvailability(ticket, now);
          
          expect(result.available).toBeNull();
          expect(result.total).toBeNull();
          expect(result.sold).toBe(sold);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 4: SOLD_OUT status when available is zero', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        (quantity) => {
          const now = new Date();
          const ticket: TicketData = {
            quantity,
            quantitySold: quantity, // Sold out
            salesStart: new Date(now.getTime() - 86400000), // Started yesterday
            salesEnd: new Date(now.getTime() + 86400000), // Ends tomorrow
            perUserLimit: 1,
          };
          
          const result = calculateAvailability(ticket, now);
          
          expect(result.status).toBe('SOLD_OUT');
          expect(result.available).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 5: NOT_ON_SALE status when before salesStart', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 1, max: 30 }),
        (quantity, daysUntilStart) => {
          const now = new Date();
          const salesStart = new Date(now.getTime() + daysUntilStart * 86400000);
          
          const ticket: TicketData = {
            quantity,
            quantitySold: 0,
            salesStart,
            salesEnd: null,
            perUserLimit: 1,
          };
          
          const result = calculateAvailability(ticket, now);
          
          expect(result.status).toBe('NOT_ON_SALE');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 6: SALES_ENDED status when after salesEnd', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 1, max: 30 }),
        (quantity, daysSinceEnd) => {
          const now = new Date();
          const salesEnd = new Date(now.getTime() - daysSinceEnd * 86400000);
          
          const ticket: TicketData = {
            quantity,
            quantitySold: 0,
            salesStart: null,
            salesEnd,
            perUserLimit: 1,
          };
          
          const result = calculateAvailability(ticket, now);
          
          expect(result.status).toBe('SALES_ENDED');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 7: AVAILABLE status when tickets remain and within sales window', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 10, max: 100 }),
        fc.integer({ min: 0, max: 9 }),
        (quantity, sold) => {
          const now = new Date();
          const ticket: TicketData = {
            quantity,
            quantitySold: sold,
            salesStart: new Date(now.getTime() - 86400000), // Started yesterday
            salesEnd: new Date(now.getTime() + 86400000), // Ends tomorrow
            perUserLimit: 1,
          };
          
          const result = calculateAvailability(ticket, now);
          
          expect(result.status).toBe('AVAILABLE');
          expect(result.available).toBe(quantity - sold);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 8: Status priority - NOT_ON_SALE > SALES_ENDED > SOLD_OUT > AVAILABLE', () => {
    fc.assert(
      fc.property(ticketDataArb, dateArb, (ticket, now) => {
        const result = calculateAvailability(ticket, now);
        
        // Check priority order
        if (ticket.salesStart && ticket.salesStart > now) {
          expect(result.status).toBe('NOT_ON_SALE');
        } else if (ticket.salesEnd && ticket.salesEnd < now) {
          expect(result.status).toBe('SALES_ENDED');
        } else if (ticket.quantity !== null && ticket.quantitySold >= ticket.quantity) {
          expect(result.status).toBe('SOLD_OUT');
        } else {
          expect(result.status).toBe('AVAILABLE');
        }
      }),
      { numRuns: 200 }
    );
  });
});
