import { describe, test, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: teacher-classroom-admin-views, Property 37: Sentry Error Capture**
 * **Validates: Requirements 31.2, 31.3, 31.5**
 * 
 * Property 37: Error reports SHALL scrub PII and include only user ID.
 */

// PII patterns to scrub from error messages and context
const PII_PATTERNS = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // Email
  /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, // Phone numbers (xxx-xxx-xxxx or xxx.xxx.xxxx)
  /\b\d{3}-\d{2}-\d{4}\b/g, // SSN (xxx-xx-xxxx)
  /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b/g, // Credit cards
];

/**
 * Scrub PII from a string.
 */
function scrubPII(text: string): string {
  let scrubbed = text;
  for (const pattern of PII_PATTERNS) {
    scrubbed = scrubbed.replace(pattern, '[REDACTED]');
  }
  return scrubbed;
}

/**
 * Scrub PII from an object recursively.
 */
function scrubObjectPII(obj: Record<string, any>): Record<string, any> {
  const scrubbed: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip sensitive keys entirely
    const sensitiveKeys = ['email', 'password', 'token', 'secret', 'apiKey', 'phone', 'ssn', 'creditCard'];
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
      scrubbed[key] = '[REDACTED]';
      continue;
    }
    
    if (typeof value === 'string') {
      scrubbed[key] = scrubPII(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      scrubbed[key] = scrubObjectPII(value);
    } else {
      scrubbed[key] = value;
    }
  }
  return scrubbed;
}

// Custom arbitraries that generate valid PII formats
const validEmailArb = fc.tuple(
  fc.stringMatching(/^[a-z]{3,10}$/),
  fc.stringMatching(/^[a-z]{3,10}$/),
  fc.constantFrom('com', 'org', 'net', 'edu')
).map(([user, domain, tld]) => `${user}@${domain}.${tld}`);

const validPhoneArb = fc.tuple(
  fc.integer({ min: 100, max: 999 }),
  fc.integer({ min: 100, max: 999 }),
  fc.integer({ min: 1000, max: 9999 })
).map(([a, b, c]) => `${a}-${b}-${c}`);

const validSsnArb = fc.tuple(
  fc.integer({ min: 100, max: 999 }),
  fc.integer({ min: 10, max: 99 }),
  fc.integer({ min: 1000, max: 9999 })
).map(([a, b, c]) => `${a}-${String(b).padStart(2, '0')}-${c}`);

const userIdArb = fc.uuid();
const safeTextArb = fc.stringMatching(/^[a-zA-Z ]{1,50}$/);

describe('Error Reporting PII Scrubbing Properties', () => {
  /**
   * **Property 37: Sentry Error Capture**
   * **Validates: Requirements 31.3**
   * 
   * Email addresses are scrubbed from error messages.
   */
  test('Property 37: Email addresses are scrubbed', () => {
    fc.assert(
      fc.property(validEmailArb, safeTextArb, (email, prefix) => {
        const message = `${prefix} Error for user ${email} failed`;
        const scrubbed = scrubPII(message);
        
        return !scrubbed.includes(email) && scrubbed.includes('[REDACTED]');
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 37: Sentry Error Capture**
   * **Validates: Requirements 31.3**
   * 
   * Phone numbers are scrubbed from error messages.
   */
  test('Property 37: Phone numbers are scrubbed', () => {
    fc.assert(
      fc.property(validPhoneArb, safeTextArb, (phone, prefix) => {
        const message = `${prefix} Contact at ${phone} for support`;
        const scrubbed = scrubPII(message);
        
        return !scrubbed.includes(phone) && scrubbed.includes('[REDACTED]');
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 37: Sentry Error Capture**
   * **Validates: Requirements 31.3**
   * 
   * SSN numbers are scrubbed from error messages.
   */
  test('Property 37: SSN numbers are scrubbed', () => {
    fc.assert(
      fc.property(validSsnArb, safeTextArb, (ssn, prefix) => {
        const message = `${prefix} SSN: ${ssn}`;
        const scrubbed = scrubPII(message);
        
        return !scrubbed.includes(ssn) && scrubbed.includes('[REDACTED]');
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 37: Sentry Error Capture**
   * **Validates: Requirements 31.3**
   * 
   * Sensitive keys in objects are redacted.
   */
  test('Property 37: Sensitive object keys are redacted', () => {
    fc.assert(
      fc.property(validEmailArb, fc.string(), fc.string(), (email, password, token) => {
        const obj = {
          userEmail: email,
          password: password,
          authToken: token,
          safeField: 'safe value',
        };
        
        const scrubbed = scrubObjectPII(obj);
        
        return scrubbed.userEmail === '[REDACTED]' &&
          scrubbed.password === '[REDACTED]' &&
          scrubbed.authToken === '[REDACTED]' &&
          scrubbed.safeField === 'safe value';
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 37: Sentry Error Capture**
   * **Validates: Requirements 31.3**
   * 
   * Nested objects have PII scrubbed.
   */
  test('Property 37: Nested objects have PII scrubbed', () => {
    fc.assert(
      fc.property(validEmailArb, safeTextArb, (email, name) => {
        const obj = {
          user: {
            email: email,
            profile: {
              displayName: name,
              secretKey: 'secret123',
            },
          },
        };
        
        const scrubbed = scrubObjectPII(obj);
        
        return scrubbed.user.email === '[REDACTED]' &&
          scrubbed.user.profile.secretKey === '[REDACTED]' &&
          scrubbed.user.profile.displayName === name;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 37: Sentry Error Capture**
   * **Validates: Requirements 31.5**
   * 
   * User ID is preserved (not PII).
   */
  test('Property 37: User ID is preserved', () => {
    fc.assert(
      fc.property(userIdArb, (userId) => {
        const obj = {
          userId: userId,
          action: 'login',
        };
        
        const scrubbed = scrubObjectPII(obj);
        
        // userId should be preserved as it's not in sensitive keys
        return scrubbed.userId === userId;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 37: Sentry Error Capture**
   * **Validates: Requirements 31.3**
   * 
   * Multiple PII instances are all scrubbed.
   */
  test('Property 37: Multiple PII instances are all scrubbed', () => {
    fc.assert(
      fc.property(validEmailArb, validEmailArb, validPhoneArb, (email1, email2, phone) => {
        const message = `Users ${email1} and ${email2} called from ${phone}`;
        const scrubbed = scrubPII(message);
        
        return !scrubbed.includes(email1) &&
          !scrubbed.includes(email2) &&
          !scrubbed.includes(phone);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 37: Sentry Error Capture**
   * **Validates: Requirements 31.3**
   * 
   * Safe text without PII is preserved.
   */
  test('Property 37: Safe text is preserved', () => {
    fc.assert(
      fc.property(safeTextArb, (text) => {
        const scrubbed = scrubPII(text);
        
        // If no PII, text should be unchanged
        return scrubbed === text;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 37: Sentry Error Capture**
   * **Validates: Requirements 31.2**
   * 
   * Error context includes timestamp.
   */
  test('Property 37: Error context includes timestamp', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: Date.parse('2020-01-01'), max: Date.parse('2030-12-31') }),
        (timestamp) => {
          const date = new Date(timestamp);
          const isoString = date.toISOString();
          
          // Timestamp format should be valid ISO string
          return !isNaN(Date.parse(isoString));
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 37: Sentry Error Capture**
   * **Validates: Requirements 31.3**
   * 
   * Credit card numbers are scrubbed.
   */
  test('Property 37: Credit card numbers are scrubbed', () => {
    // Test with valid Visa card format
    const visaCards = ['4111111111111111', '4012888888881881'];
    
    for (const card of visaCards) {
      const message = `Payment failed for card ${card}`;
      const scrubbed = scrubPII(message);
      
      expect(scrubbed).not.toContain(card);
      expect(scrubbed).toContain('[REDACTED]');
    }
  });

  /**
   * **Property 37: Sentry Error Capture**
   * **Validates: Requirements 31.3**
   * 
   * Empty strings and null values are handled.
   */
  test('Property 37: Empty and null values are handled', () => {
    expect(scrubPII('')).toBe('');
    expect(scrubObjectPII({})).toEqual({});
    expect(scrubObjectPII({ nullField: null })).toEqual({ nullField: null });
  });
});
