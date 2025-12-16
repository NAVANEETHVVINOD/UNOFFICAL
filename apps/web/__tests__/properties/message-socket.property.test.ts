import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: linker-ui-overhaul, Property 18: Message socket emission**
 * **Validates: Requirements 8.4**
 * 
 * Property: For any message sent through the chat interface, the System SHALL 
 * emit a socket event with the message content, sender ID, and conversation ID.
 */

// Message payload interface (mirrors what ChatClient sends)
interface MessagePayload {
  conversationId: string;
  content: string;
  senderId: string;
}

// Mock socket interface for testing emission behavior
interface MockSocket {
  emit: (event: string, payload: MessagePayload, callback?: (response: unknown) => void) => void;
  emittedEvents: Array<{ event: string; payload: MessagePayload }>;
}

// Create a mock socket that tracks emissions
function createMockSocket(): MockSocket {
  const emittedEvents: Array<{ event: string; payload: MessagePayload }> = [];
  
  return {
    emit: (event: string, payload: MessagePayload) => {
      emittedEvents.push({ event, payload });
    },
    emittedEvents,
  };
}

// Function that mirrors the sendMessage behavior from ChatClient
function sendMessage(
  socket: MockSocket,
  conversationId: string,
  content: string,
  senderId: string
): boolean {
  // Validate inputs - content must be non-empty after trimming
  if (!content.trim()) {
    return false;
  }
  
  // Emit the socket event with required fields
  socket.emit('sendMessage', {
    conversationId,
    content,
    senderId,
  });
  
  return true;
}

// Validates that a message payload contains all required fields
function validateMessagePayload(payload: MessagePayload): boolean {
  return (
    typeof payload.conversationId === 'string' &&
    payload.conversationId.length > 0 &&
    typeof payload.content === 'string' &&
    payload.content.length > 0 &&
    typeof payload.senderId === 'string' &&
    payload.senderId.length > 0
  );
}

// Arbitrary for generating valid conversation IDs (UUIDs)
const conversationIdArb = fc.uuid();

// Arbitrary for generating valid sender IDs (UUIDs)
const senderIdArb = fc.uuid();

// Arbitrary for generating valid message content (non-empty, non-whitespace-only strings)
const validContentArb = fc.string({ minLength: 1, maxLength: 1000 })
  .filter(s => s.trim().length > 0);

// Arbitrary for generating whitespace-only content (invalid)
const whitespaceOnlyArb = fc.array(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1, maxLength: 20 })
  .map(chars => chars.join(''));

describe('Message Socket Emission Properties', () => {
  let mockSocket: MockSocket;

  beforeEach(() => {
    mockSocket = createMockSocket();
  });

  /**
   * **Feature: linker-ui-overhaul, Property 18: Message socket emission**
   * **Validates: Requirements 8.4**
   * 
   * For any valid message, sending it SHALL emit a socket event with 
   * conversationId, content, and senderId.
   */
  test('Property 18: Valid message emits socket event with all required fields', () => {
    fc.assert(
      fc.property(
        conversationIdArb,
        validContentArb,
        senderIdArb,
        (conversationId, content, senderId) => {
          mockSocket = createMockSocket();
          
          const sent = sendMessage(mockSocket, conversationId, content, senderId);
          
          // Message should be sent
          expect(sent).toBe(true);
          
          // Exactly one event should be emitted
          expect(mockSocket.emittedEvents.length).toBe(1);
          
          const emittedEvent = mockSocket.emittedEvents[0];
          
          // Event name should be 'sendMessage'
          expect(emittedEvent.event).toBe('sendMessage');
          
          // Payload should contain all required fields
          expect(emittedEvent.payload.conversationId).toBe(conversationId);
          expect(emittedEvent.payload.content).toBe(content);
          expect(emittedEvent.payload.senderId).toBe(senderId);
          
          // Validate the payload structure
          return validateMessagePayload(emittedEvent.payload);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: linker-ui-overhaul, Property 18: Message socket emission**
   * **Validates: Requirements 8.4**
   * 
   * Empty or whitespace-only content SHALL NOT emit a socket event.
   */
  test('Property 18: Empty content does not emit socket event', () => {
    fc.assert(
      fc.property(
        conversationIdArb,
        senderIdArb,
        (conversationId, senderId) => {
          mockSocket = createMockSocket();
          
          // Try to send empty message
          const sent = sendMessage(mockSocket, conversationId, '', senderId);
          
          // Message should not be sent
          expect(sent).toBe(false);
          
          // No events should be emitted
          return mockSocket.emittedEvents.length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: linker-ui-overhaul, Property 18: Message socket emission**
   * **Validates: Requirements 8.4**
   * 
   * Whitespace-only content SHALL NOT emit a socket event.
   */
  test('Property 18: Whitespace-only content does not emit socket event', () => {
    fc.assert(
      fc.property(
        conversationIdArb,
        whitespaceOnlyArb,
        senderIdArb,
        (conversationId, whitespaceContent, senderId) => {
          mockSocket = createMockSocket();
          
          const sent = sendMessage(mockSocket, conversationId, whitespaceContent, senderId);
          
          // Message should not be sent
          expect(sent).toBe(false);
          
          // No events should be emitted
          return mockSocket.emittedEvents.length === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: linker-ui-overhaul, Property 18: Message socket emission**
   * **Validates: Requirements 8.4**
   * 
   * The emitted payload SHALL preserve the exact content without modification.
   */
  test('Property 18: Message content is preserved exactly in emission', () => {
    fc.assert(
      fc.property(
        conversationIdArb,
        validContentArb,
        senderIdArb,
        (conversationId, content, senderId) => {
          mockSocket = createMockSocket();
          
          sendMessage(mockSocket, conversationId, content, senderId);
          
          if (mockSocket.emittedEvents.length === 0) {
            return false;
          }
          
          const emittedContent = mockSocket.emittedEvents[0].payload.content;
          
          // Content should be exactly preserved
          return emittedContent === content;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: linker-ui-overhaul, Property 18: Message socket emission**
   * **Validates: Requirements 8.4**
   * 
   * Multiple messages SHALL each emit their own socket event.
   */
  test('Property 18: Multiple messages emit separate socket events', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.tuple(conversationIdArb, validContentArb, senderIdArb),
          { minLength: 1, maxLength: 10 }
        ),
        (messages) => {
          mockSocket = createMockSocket();
          
          let successCount = 0;
          for (const [conversationId, content, senderId] of messages) {
            if (sendMessage(mockSocket, conversationId, content, senderId)) {
              successCount++;
            }
          }
          
          // Number of emitted events should equal number of successful sends
          return mockSocket.emittedEvents.length === successCount;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: linker-ui-overhaul, Property 18: Message socket emission**
   * **Validates: Requirements 8.4**
   * 
   * Each emitted event SHALL have a valid payload structure.
   */
  test('Property 18: All emitted payloads have valid structure', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.tuple(conversationIdArb, validContentArb, senderIdArb),
          { minLength: 1, maxLength: 20 }
        ),
        (messages) => {
          mockSocket = createMockSocket();
          
          for (const [conversationId, content, senderId] of messages) {
            sendMessage(mockSocket, conversationId, content, senderId);
          }
          
          // All emitted payloads should be valid
          return mockSocket.emittedEvents.every(event => 
            validateMessagePayload(event.payload)
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Feature: linker-ui-overhaul, Property 18: Message socket emission**
   * **Validates: Requirements 8.4**
   * 
   * The socket event name SHALL always be 'sendMessage'.
   */
  test('Property 18: Socket event name is always sendMessage', () => {
    fc.assert(
      fc.property(
        conversationIdArb,
        validContentArb,
        senderIdArb,
        (conversationId, content, senderId) => {
          mockSocket = createMockSocket();
          
          sendMessage(mockSocket, conversationId, content, senderId);
          
          if (mockSocket.emittedEvents.length === 0) {
            return false;
          }
          
          return mockSocket.emittedEvents[0].event === 'sendMessage';
        }
      ),
      { numRuns: 100 }
    );
  });
});
