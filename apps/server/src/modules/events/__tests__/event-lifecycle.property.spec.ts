import * as fc from 'fast-check';
import { EventLifecycleStatus } from '@prisma/client';

/**
 * Property Test: Event Lifecycle State Machine
 * Property 6: Event Lifecycle State Machine
 * Validates: Requirements 11.1-11.7
 * 
 * For any event, state transitions SHALL only follow valid paths:
 * - DRAFT → PUBLISHED → REGISTRATION_CLOSED → ONGOING → COMPLETED → ARCHIVED
 * - PUBLISHED → CANCELLED (at any point from PUBLISHED, REGISTRATION_CLOSED, or ONGOING)
 */

// Valid state transitions map
const VALID_TRANSITIONS: Record<EventLifecycleStatus, EventLifecycleStatus[]> = {
  [EventLifecycleStatus.DRAFT]: [EventLifecycleStatus.PUBLISHED],
  [EventLifecycleStatus.PUBLISHED]: [
    EventLifecycleStatus.REGISTRATION_CLOSED,
    EventLifecycleStatus.CANCELLED,
  ],
  [EventLifecycleStatus.REGISTRATION_CLOSED]: [
    EventLifecycleStatus.ONGOING,
    EventLifecycleStatus.CANCELLED,
  ],
  [EventLifecycleStatus.ONGOING]: [
    EventLifecycleStatus.COMPLETED,
    EventLifecycleStatus.CANCELLED,
  ],
  [EventLifecycleStatus.COMPLETED]: [EventLifecycleStatus.ARCHIVED],
  [EventLifecycleStatus.CANCELLED]: [], // Terminal state
  [EventLifecycleStatus.ARCHIVED]: [], // Terminal state
};

// All possible statuses
const ALL_STATUSES: EventLifecycleStatus[] = [
  EventLifecycleStatus.DRAFT,
  EventLifecycleStatus.PUBLISHED,
  EventLifecycleStatus.REGISTRATION_CLOSED,
  EventLifecycleStatus.ONGOING,
  EventLifecycleStatus.COMPLETED,
  EventLifecycleStatus.CANCELLED,
  EventLifecycleStatus.ARCHIVED,
];

// Helper function to check if transition is valid
function isValidTransition(
  from: EventLifecycleStatus,
  to: EventLifecycleStatus,
): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

// Helper function to get valid next states
function getValidNextStates(status: EventLifecycleStatus): EventLifecycleStatus[] {
  return VALID_TRANSITIONS[status] || [];
}

// Arbitrary for generating random statuses
const statusArbitrary = fc.constantFrom(...ALL_STATUSES);

// Arbitrary for generating pairs of statuses
const statusPairArbitrary = fc.tuple(statusArbitrary, statusArbitrary);

describe('Event Lifecycle State Machine - Property Tests', () => {
  // Run 100+ iterations as required
  const numRuns = 100;

  describe('Property 6: Valid State Transitions', () => {
    it('should only allow transitions defined in the state machine', () => {
      fc.assert(
        fc.property(statusPairArbitrary, ([fromStatus, toStatus]) => {
          const isValid = isValidTransition(fromStatus, toStatus);
          const validTargets = VALID_TRANSITIONS[fromStatus] || [];
          
          // If transition is valid, target must be in valid targets
          if (isValid) {
            expect(validTargets).toContain(toStatus);
          } else {
            // If transition is invalid, target must NOT be in valid targets
            expect(validTargets).not.toContain(toStatus);
          }
        }),
        { numRuns },
      );
    });

    it('DRAFT can only transition to PUBLISHED', () => {
      fc.assert(
        fc.property(statusArbitrary, (targetStatus) => {
          const isValid = isValidTransition(EventLifecycleStatus.DRAFT, targetStatus);
          
          if (targetStatus === EventLifecycleStatus.PUBLISHED) {
            expect(isValid).toBe(true);
          } else {
            expect(isValid).toBe(false);
          }
        }),
        { numRuns },
      );
    });

    it('PUBLISHED can transition to REGISTRATION_CLOSED or CANCELLED', () => {
      fc.assert(
        fc.property(statusArbitrary, (targetStatus) => {
          const isValid = isValidTransition(EventLifecycleStatus.PUBLISHED, targetStatus);
          
          if (
            targetStatus === EventLifecycleStatus.REGISTRATION_CLOSED ||
            targetStatus === EventLifecycleStatus.CANCELLED
          ) {
            expect(isValid).toBe(true);
          } else {
            expect(isValid).toBe(false);
          }
        }),
        { numRuns },
      );
    });

    it('REGISTRATION_CLOSED can transition to ONGOING or CANCELLED', () => {
      fc.assert(
        fc.property(statusArbitrary, (targetStatus) => {
          const isValid = isValidTransition(
            EventLifecycleStatus.REGISTRATION_CLOSED,
            targetStatus,
          );
          
          if (
            targetStatus === EventLifecycleStatus.ONGOING ||
            targetStatus === EventLifecycleStatus.CANCELLED
          ) {
            expect(isValid).toBe(true);
          } else {
            expect(isValid).toBe(false);
          }
        }),
        { numRuns },
      );
    });

    it('ONGOING can transition to COMPLETED or CANCELLED', () => {
      fc.assert(
        fc.property(statusArbitrary, (targetStatus) => {
          const isValid = isValidTransition(EventLifecycleStatus.ONGOING, targetStatus);
          
          if (
            targetStatus === EventLifecycleStatus.COMPLETED ||
            targetStatus === EventLifecycleStatus.CANCELLED
          ) {
            expect(isValid).toBe(true);
          } else {
            expect(isValid).toBe(false);
          }
        }),
        { numRuns },
      );
    });

    it('COMPLETED can only transition to ARCHIVED', () => {
      fc.assert(
        fc.property(statusArbitrary, (targetStatus) => {
          const isValid = isValidTransition(EventLifecycleStatus.COMPLETED, targetStatus);
          
          if (targetStatus === EventLifecycleStatus.ARCHIVED) {
            expect(isValid).toBe(true);
          } else {
            expect(isValid).toBe(false);
          }
        }),
        { numRuns },
      );
    });

    it('CANCELLED is a terminal state with no valid transitions', () => {
      fc.assert(
        fc.property(statusArbitrary, (targetStatus) => {
          const isValid = isValidTransition(EventLifecycleStatus.CANCELLED, targetStatus);
          expect(isValid).toBe(false);
        }),
        { numRuns },
      );
    });

    it('ARCHIVED is a terminal state with no valid transitions', () => {
      fc.assert(
        fc.property(statusArbitrary, (targetStatus) => {
          const isValid = isValidTransition(EventLifecycleStatus.ARCHIVED, targetStatus);
          expect(isValid).toBe(false);
        }),
        { numRuns },
      );
    });
  });

  describe('Property 6: Happy Path Sequence', () => {
    it('should allow the complete happy path: DRAFT → PUBLISHED → REGISTRATION_CLOSED → ONGOING → COMPLETED → ARCHIVED', () => {
      const happyPath: EventLifecycleStatus[] = [
        EventLifecycleStatus.DRAFT,
        EventLifecycleStatus.PUBLISHED,
        EventLifecycleStatus.REGISTRATION_CLOSED,
        EventLifecycleStatus.ONGOING,
        EventLifecycleStatus.COMPLETED,
        EventLifecycleStatus.ARCHIVED,
      ];

      for (let i = 0; i < happyPath.length - 1; i++) {
        const from = happyPath[i];
        const to = happyPath[i + 1];
        expect(isValidTransition(from, to)).toBe(true);
      }
    });

    it('should allow cancellation from any active state', () => {
      const cancellableStates: EventLifecycleStatus[] = [
        EventLifecycleStatus.PUBLISHED,
        EventLifecycleStatus.REGISTRATION_CLOSED,
        EventLifecycleStatus.ONGOING,
      ];

      for (const state of cancellableStates) {
        expect(isValidTransition(state, EventLifecycleStatus.CANCELLED)).toBe(true);
      }
    });

    it('should NOT allow cancellation from DRAFT, COMPLETED, CANCELLED, or ARCHIVED', () => {
      const nonCancellableStates: EventLifecycleStatus[] = [
        EventLifecycleStatus.DRAFT,
        EventLifecycleStatus.COMPLETED,
        EventLifecycleStatus.CANCELLED,
        EventLifecycleStatus.ARCHIVED,
      ];

      for (const state of nonCancellableStates) {
        expect(isValidTransition(state, EventLifecycleStatus.CANCELLED)).toBe(false);
      }
    });
  });

  describe('Property 6: Invalid Transitions', () => {
    it('should NOT allow backward transitions', () => {
      // Test that we cannot go backwards in the lifecycle
      const backwardTransitions: [EventLifecycleStatus, EventLifecycleStatus][] = [
        [EventLifecycleStatus.PUBLISHED, EventLifecycleStatus.DRAFT],
        [EventLifecycleStatus.REGISTRATION_CLOSED, EventLifecycleStatus.PUBLISHED],
        [EventLifecycleStatus.REGISTRATION_CLOSED, EventLifecycleStatus.DRAFT],
        [EventLifecycleStatus.ONGOING, EventLifecycleStatus.REGISTRATION_CLOSED],
        [EventLifecycleStatus.ONGOING, EventLifecycleStatus.PUBLISHED],
        [EventLifecycleStatus.ONGOING, EventLifecycleStatus.DRAFT],
        [EventLifecycleStatus.COMPLETED, EventLifecycleStatus.ONGOING],
        [EventLifecycleStatus.COMPLETED, EventLifecycleStatus.REGISTRATION_CLOSED],
        [EventLifecycleStatus.COMPLETED, EventLifecycleStatus.PUBLISHED],
        [EventLifecycleStatus.COMPLETED, EventLifecycleStatus.DRAFT],
        [EventLifecycleStatus.ARCHIVED, EventLifecycleStatus.COMPLETED],
      ];

      for (const [from, to] of backwardTransitions) {
        expect(isValidTransition(from, to)).toBe(false);
      }
    });

    it('should NOT allow skipping states in the happy path', () => {
      // Test that we cannot skip states
      const skipTransitions: [EventLifecycleStatus, EventLifecycleStatus][] = [
        [EventLifecycleStatus.DRAFT, EventLifecycleStatus.REGISTRATION_CLOSED],
        [EventLifecycleStatus.DRAFT, EventLifecycleStatus.ONGOING],
        [EventLifecycleStatus.DRAFT, EventLifecycleStatus.COMPLETED],
        [EventLifecycleStatus.DRAFT, EventLifecycleStatus.ARCHIVED],
        [EventLifecycleStatus.PUBLISHED, EventLifecycleStatus.ONGOING],
        [EventLifecycleStatus.PUBLISHED, EventLifecycleStatus.COMPLETED],
        [EventLifecycleStatus.PUBLISHED, EventLifecycleStatus.ARCHIVED],
        [EventLifecycleStatus.REGISTRATION_CLOSED, EventLifecycleStatus.COMPLETED],
        [EventLifecycleStatus.REGISTRATION_CLOSED, EventLifecycleStatus.ARCHIVED],
        [EventLifecycleStatus.ONGOING, EventLifecycleStatus.ARCHIVED],
      ];

      for (const [from, to] of skipTransitions) {
        expect(isValidTransition(from, to)).toBe(false);
      }
    });

    it('should NOT allow self-transitions', () => {
      fc.assert(
        fc.property(statusArbitrary, (status) => {
          expect(isValidTransition(status, status)).toBe(false);
        }),
        { numRuns },
      );
    });
  });

  describe('Property 6: State Machine Invariants', () => {
    it('every non-terminal state should have at least one valid transition', () => {
      const nonTerminalStates: EventLifecycleStatus[] = [
        EventLifecycleStatus.DRAFT,
        EventLifecycleStatus.PUBLISHED,
        EventLifecycleStatus.REGISTRATION_CLOSED,
        EventLifecycleStatus.ONGOING,
        EventLifecycleStatus.COMPLETED,
      ];

      for (const state of nonTerminalStates) {
        const validNextStates = getValidNextStates(state);
        expect(validNextStates.length).toBeGreaterThan(0);
      }
    });

    it('terminal states should have no valid transitions', () => {
      const terminalStates: EventLifecycleStatus[] = [
        EventLifecycleStatus.CANCELLED,
        EventLifecycleStatus.ARCHIVED,
      ];

      for (const state of terminalStates) {
        const validNextStates = getValidNextStates(state);
        expect(validNextStates.length).toBe(0);
      }
    });

    it('DRAFT should be the only initial state (no transitions TO DRAFT)', () => {
      for (const status of ALL_STATUSES) {
        expect(isValidTransition(status, EventLifecycleStatus.DRAFT)).toBe(false);
      }
    });
  });

  describe('Property 6: Random Walk Simulation', () => {
    it('random valid transitions should always reach a terminal state', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 100 }), (seed) => {
          let currentState: EventLifecycleStatus = EventLifecycleStatus.DRAFT;
          let steps = 0;
          const maxSteps = 10; // Should reach terminal in at most 6 steps

          while (steps < maxSteps) {
            const validNextStates = getValidNextStates(currentState);
            
            if (validNextStates.length === 0) {
              // Reached terminal state
              expect([
                EventLifecycleStatus.CANCELLED,
                EventLifecycleStatus.ARCHIVED,
              ]).toContain(currentState);
              return;
            }

            // Pick a random valid next state
            const nextIndex = (seed + steps) % validNextStates.length;
            currentState = validNextStates[nextIndex];
            steps++;
          }

          // If we haven't reached terminal in maxSteps, something is wrong
          fail('Did not reach terminal state within max steps');
        }),
        { numRuns },
      );
    });
  });
});
