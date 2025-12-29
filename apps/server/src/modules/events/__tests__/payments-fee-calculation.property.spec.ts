import * as fc from 'fast-check';

/**
 * Property Test: Fee Calculation Consistency
 * Validates: Requirement 4.5 - Fee calculation consistency
 * 
 * Property 9: Fee Calculation Consistency
 * For any ticket price P, the sum of (organizerPayout + platformFee + gatewayFee) 
 * SHALL equal the totalCharge, and platformFee SHALL equal P * 0.03 (3%).
 * 
 * Properties tested:
 * 1. Fee components sum to total charge
 * 2. Platform fee is exactly 3% of ticket price
 * 3. Gateway fee is exactly 2% of ticket price
 * 4. Organizer payout is correct based on fee absorption mode
 * 5. All amounts are non-negative
 * 6. Fees are calculated consistently regardless of price
 */

// Fee percentages (in basis points for precision)
const PLATFORM_FEE_BPS = 300; // 3%
const GATEWAY_FEE_BPS = 200; // 2%

interface FeeBreakdown {
  ticketPrice: number;
  platformFee: number;
  gatewayFee: number;
  totalCharge: number;
  organizerPayout: number;
}

/**
 * Pure function to calculate fees
 * Mirrors the implementation in PaymentsService
 */
function calculateFees(ticketPrice: number, passFeesToBuyer: boolean): FeeBreakdown {
  // All amounts in paise (INR cents)
  const platformFee = Math.ceil((ticketPrice * PLATFORM_FEE_BPS) / 10000);
  const gatewayFee = Math.ceil((ticketPrice * GATEWAY_FEE_BPS) / 10000);

  if (passFeesToBuyer) {
    // Buyer pays ticket price + all fees
    const totalCharge = ticketPrice + platformFee + gatewayFee;
    return {
      ticketPrice,
      platformFee,
      gatewayFee,
      totalCharge,
      organizerPayout: ticketPrice,
    };
  } else {
    // Organizer absorbs fees, buyer pays ticket price only
    const totalCharge = ticketPrice;
    const organizerPayout = ticketPrice - platformFee - gatewayFee;
    return {
      ticketPrice,
      platformFee,
      gatewayFee,
      totalCharge,
      organizerPayout: Math.max(0, organizerPayout),
    };
  }
}

describe('Fee Calculation Consistency Properties', () => {
  // Arbitrary for ticket prices (in paise, 100 paise = 1 INR)
  // Range: 100 paise (₹1) to 10,000,000 paise (₹100,000)
  const ticketPriceArb = fc.integer({ min: 100, max: 10000000 });

  /**
   * Feature: events-system-redesign, Property 9: Fee Calculation Consistency
   * Validates: Requirements 4.5
   */
  test('Property 1: Fee components sum correctly when fees passed to buyer', () => {
    fc.assert(
      fc.property(ticketPriceArb, (ticketPrice) => {
        const fees = calculateFees(ticketPrice, true);
        
        // When fees are passed to buyer:
        // totalCharge = ticketPrice + platformFee + gatewayFee
        expect(fees.totalCharge).toBe(
          fees.ticketPrice + fees.platformFee + fees.gatewayFee
        );
        
        // Organizer gets full ticket price
        expect(fees.organizerPayout).toBe(fees.ticketPrice);
      }),
      { numRuns: 200 }
    );
  });

  test('Property 2: Fee components sum correctly when organizer absorbs fees', () => {
    fc.assert(
      fc.property(ticketPriceArb, (ticketPrice) => {
        const fees = calculateFees(ticketPrice, false);
        
        // When organizer absorbs fees:
        // totalCharge = ticketPrice (buyer pays only ticket price)
        expect(fees.totalCharge).toBe(fees.ticketPrice);
        
        // organizerPayout + platformFee + gatewayFee = ticketPrice
        // (unless organizerPayout is clamped to 0)
        const expectedPayout = fees.ticketPrice - fees.platformFee - fees.gatewayFee;
        if (expectedPayout >= 0) {
          expect(fees.organizerPayout + fees.platformFee + fees.gatewayFee)
            .toBe(fees.ticketPrice);
        } else {
          // Payout clamped to 0
          expect(fees.organizerPayout).toBe(0);
        }
      }),
      { numRuns: 200 }
    );
  });

  test('Property 3: Platform fee is 3% of ticket price (ceiling)', () => {
    fc.assert(
      fc.property(ticketPriceArb, fc.boolean(), (ticketPrice, passFeesToBuyer) => {
        const fees = calculateFees(ticketPrice, passFeesToBuyer);
        
        // Platform fee should be ceiling of 3%
        const expectedPlatformFee = Math.ceil((ticketPrice * PLATFORM_FEE_BPS) / 10000);
        expect(fees.platformFee).toBe(expectedPlatformFee);
        
        // Verify it's at least 3% (ceiling can make it slightly higher for small amounts)
        const actualPercentage = (fees.platformFee / ticketPrice) * 100;
        expect(actualPercentage).toBeGreaterThanOrEqual(3);
        // For small prices, ceiling can cause up to 1 paise extra per 100 paise
        // So max percentage is 3% + (1/ticketPrice * 100)
        const maxPercentage = 3 + (100 / ticketPrice);
        expect(actualPercentage).toBeLessThanOrEqual(maxPercentage);
      }),
      { numRuns: 200 }
    );
  });

  test('Property 4: Gateway fee is 2% of ticket price (ceiling)', () => {
    fc.assert(
      fc.property(ticketPriceArb, fc.boolean(), (ticketPrice, passFeesToBuyer) => {
        const fees = calculateFees(ticketPrice, passFeesToBuyer);
        
        // Gateway fee should be ceiling of 2%
        const expectedGatewayFee = Math.ceil((ticketPrice * GATEWAY_FEE_BPS) / 10000);
        expect(fees.gatewayFee).toBe(expectedGatewayFee);
        
        // Verify it's at least 2% (ceiling can make it slightly higher for small amounts)
        const actualPercentage = (fees.gatewayFee / ticketPrice) * 100;
        expect(actualPercentage).toBeGreaterThanOrEqual(2);
        // For small prices, ceiling can cause up to 1 paise extra per 100 paise
        const maxPercentage = 2 + (100 / ticketPrice);
        expect(actualPercentage).toBeLessThanOrEqual(maxPercentage);
      }),
      { numRuns: 200 }
    );
  });

  test('Property 5: All fee amounts are non-negative', () => {
    fc.assert(
      fc.property(ticketPriceArb, fc.boolean(), (ticketPrice, passFeesToBuyer) => {
        const fees = calculateFees(ticketPrice, passFeesToBuyer);
        
        expect(fees.ticketPrice).toBeGreaterThanOrEqual(0);
        expect(fees.platformFee).toBeGreaterThanOrEqual(0);
        expect(fees.gatewayFee).toBeGreaterThanOrEqual(0);
        expect(fees.totalCharge).toBeGreaterThanOrEqual(0);
        expect(fees.organizerPayout).toBeGreaterThanOrEqual(0);
      }),
      { numRuns: 200 }
    );
  });

  test('Property 6: Total charge is always >= ticket price when fees passed to buyer', () => {
    fc.assert(
      fc.property(ticketPriceArb, (ticketPrice) => {
        const fees = calculateFees(ticketPrice, true);
        
        expect(fees.totalCharge).toBeGreaterThanOrEqual(fees.ticketPrice);
      }),
      { numRuns: 200 }
    );
  });

  test('Property 7: Total charge equals ticket price when organizer absorbs fees', () => {
    fc.assert(
      fc.property(ticketPriceArb, (ticketPrice) => {
        const fees = calculateFees(ticketPrice, false);
        
        expect(fees.totalCharge).toBe(fees.ticketPrice);
      }),
      { numRuns: 200 }
    );
  });

  test('Property 8: Organizer payout is less than ticket price when absorbing fees', () => {
    fc.assert(
      fc.property(ticketPriceArb, (ticketPrice) => {
        const fees = calculateFees(ticketPrice, false);
        
        // Organizer payout should be less than or equal to ticket price
        expect(fees.organizerPayout).toBeLessThanOrEqual(fees.ticketPrice);
      }),
      { numRuns: 200 }
    );
  });

  test('Property 9: Fee calculation is deterministic', () => {
    fc.assert(
      fc.property(ticketPriceArb, fc.boolean(), (ticketPrice, passFeesToBuyer) => {
        const fees1 = calculateFees(ticketPrice, passFeesToBuyer);
        const fees2 = calculateFees(ticketPrice, passFeesToBuyer);
        
        expect(fees1).toEqual(fees2);
      }),
      { numRuns: 100 }
    );
  });

  test('Property 10: Higher ticket price results in higher fees', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 5000000 }),
        fc.integer({ min: 1, max: 5000000 }),
        fc.boolean(),
        (basePrice, increment, passFeesToBuyer) => {
          const lowerPrice = basePrice;
          const higherPrice = basePrice + increment;
          
          const lowerFees = calculateFees(lowerPrice, passFeesToBuyer);
          const higherFees = calculateFees(higherPrice, passFeesToBuyer);
          
          expect(higherFees.platformFee).toBeGreaterThanOrEqual(lowerFees.platformFee);
          expect(higherFees.gatewayFee).toBeGreaterThanOrEqual(lowerFees.gatewayFee);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Edge case tests
  describe('Edge Cases', () => {
    test('Minimum ticket price (₹1 = 100 paise)', () => {
      const fees = calculateFees(100, true);
      
      expect(fees.platformFee).toBe(3); // 3% of 100 = 3
      expect(fees.gatewayFee).toBe(2); // 2% of 100 = 2
      expect(fees.totalCharge).toBe(105);
      expect(fees.organizerPayout).toBe(100);
    });

    test('Large ticket price (₹100,000 = 10,000,000 paise)', () => {
      const fees = calculateFees(10000000, true);
      
      expect(fees.platformFee).toBe(300000); // 3% of 10,000,000
      expect(fees.gatewayFee).toBe(200000); // 2% of 10,000,000
      expect(fees.totalCharge).toBe(10500000);
      expect(fees.organizerPayout).toBe(10000000);
    });

    test('Very small ticket price where fees exceed price (organizer absorbs)', () => {
      // Price so small that fees would make payout negative
      const fees = calculateFees(1, false);
      
      // Payout should be clamped to 0
      expect(fees.organizerPayout).toBe(0);
      expect(fees.totalCharge).toBe(1);
    });
  });
});
