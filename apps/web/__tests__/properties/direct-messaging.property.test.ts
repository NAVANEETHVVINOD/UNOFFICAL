import { describe, test, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';

/**
 * **Feature: teacher-classroom-admin-views, Property 35 & 36: Direct Messaging**
 * **Validates: Requirements 29.1, 29.2, 29.3**
 * 
 * Property 35: Direct conversations SHALL be created between two users.
 * Property 36: Real-time messages SHALL be delivered to conversation participants.
 */

// Types mirroring the backend implementation
interface User {
  id: string;
  email: string;
  profile?: {
    fullName: string;
  };
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  seen: boolean;
}

interface Conversation {
  id: string;
  participants: User[];
  messages: Message[];
  listingId: string | null;
  type: 'direct' | 'listing';
  createdAt: Date;
  updatedAt: Date;
}

interface CreateConversationResult {
  success: boolean;
  conversation?: Conversation;
  error?: string;
}

interface SendMessageResult {
  success: boolean;
  message?: Message;
  error?: string;
}

// Simulated messaging store
class DirectMessagingStore {
  private users: Map<string, User> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private messageIdCounter = 0;
  private conversationIdCounter = 0;

  addUser(user: User): void {
    this.users.set(user.id, user);
  }

  /**
   * Create or get a direct conversation between two users.
   * Returns existing conversation if one already exists.
   * 
   * **Validates: Requirements 29.1, 29.2**
   */
  createDirectConversation(userId: string, participantId: string): CreateConversationResult {
    // Validate users exist
    const user = this.users.get(userId);
    const participant = this.users.get(participantId);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    if (!participant) {
      return { success: false, error: 'Participant not found' };
    }

    // Prevent self-conversation
    if (userId === participantId) {
      return { success: false, error: 'Cannot start a conversation with yourself' };
    }

    // Check for existing direct conversation (no listing)
    for (const conv of this.conversations.values()) {
      if (
        conv.listingId === null &&
        conv.participants.length === 2 &&
        conv.participants.some(p => p.id === userId) &&
        conv.participants.some(p => p.id === participantId)
      ) {
        return { success: true, conversation: conv };
      }
    }

    // Create new direct conversation
    const conversation: Conversation = {
      id: `conv-${++this.conversationIdCounter}`,
      participants: [user, participant],
      messages: [],
      listingId: null,
      type: 'direct',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.conversations.set(conversation.id, conversation);
    return { success: true, conversation };
  }

  /**
   * Send a message in a conversation.
   * 
   * **Validates: Requirements 29.3**
   */
  sendMessage(conversationId: string, senderId: string, content: string): SendMessageResult {
    const conversation = this.conversations.get(conversationId);

    if (!conversation) {
      return { success: false, error: 'Conversation not found' };
    }

    // Validate sender is a participant
    if (!conversation.participants.some(p => p.id === senderId)) {
      return { success: false, error: 'User is not a participant in this conversation' };
    }

    // Validate content
    if (!content || content.trim().length === 0) {
      return { success: false, error: 'Message content cannot be empty' };
    }

    const message: Message = {
      id: `msg-${++this.messageIdCounter}`,
      conversationId,
      senderId,
      content: content.trim(),
      createdAt: new Date(),
      seen: false,
    };

    conversation.messages.push(message);
    conversation.updatedAt = new Date();

    return { success: true, message };
  }

  /**
   * Get messages for a conversation.
   */
  getMessages(conversationId: string, userId: string): Message[] | null {
    const conversation = this.conversations.get(conversationId);

    if (!conversation) {
      return null;
    }

    // Validate user is a participant
    if (!conversation.participants.some(p => p.id === userId)) {
      return null;
    }

    return conversation.messages;
  }

  /**
   * Get all conversations for a user.
   */
  getUserConversations(userId: string): Conversation[] {
    return Array.from(this.conversations.values()).filter(conv =>
      conv.participants.some(p => p.id === userId)
    );
  }

  /**
   * Get conversation by ID.
   */
  getConversation(conversationId: string): Conversation | null {
    return this.conversations.get(conversationId) || null;
  }

  clear(): void {
    this.users.clear();
    this.conversations.clear();
    this.messageIdCounter = 0;
    this.conversationIdCounter = 0;
  }
}

// Arbitraries
const userIdArb = fc.uuid();
const emailArb = fc.emailAddress();
const fullNameArb = fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length >= 2);
const messageContentArb = fc.string({ minLength: 1, maxLength: 1000 }).filter(s => s.trim().length > 0);

const userArb = fc.record({
  id: userIdArb,
  email: emailArb,
  profile: fc.record({
    fullName: fullNameArb,
  }),
});

describe('Direct Messaging Properties', () => {
  let store: DirectMessagingStore;

  beforeEach(() => {
    store = new DirectMessagingStore();
  });

  /**
   * **Property 35: Direct Conversation Creation**
   * **Validates: Requirements 29.1, 29.2**
   * 
   * Direct conversations can be created between two different users.
   */
  test('Property 35: Direct conversations can be created between two users', () => {
    fc.assert(
      fc.property(userArb, userArb, (user1, user2) => {
        // Skip if same user ID
        if (user1.id === user2.id) return true;

        store.clear();
        store.addUser(user1);
        store.addUser(user2);

        const result = store.createDirectConversation(user1.id, user2.id);

        return result.success === true &&
          result.conversation !== undefined &&
          result.conversation.type === 'direct' &&
          result.conversation.listingId === null &&
          result.conversation.participants.length === 2;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 35: Direct Conversation Creation**
   * **Validates: Requirements 29.1**
   * 
   * Creating a conversation with same users returns existing conversation.
   */
  test('Property 35: Conversation creation is idempotent', () => {
    fc.assert(
      fc.property(userArb, userArb, (user1, user2) => {
        // Skip if same user ID
        if (user1.id === user2.id) return true;

        store.clear();
        store.addUser(user1);
        store.addUser(user2);

        const result1 = store.createDirectConversation(user1.id, user2.id);
        const result2 = store.createDirectConversation(user1.id, user2.id);
        const result3 = store.createDirectConversation(user2.id, user1.id); // Reversed order

        return result1.success && result2.success && result3.success &&
          result1.conversation?.id === result2.conversation?.id &&
          result2.conversation?.id === result3.conversation?.id;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 35: Direct Conversation Creation**
   * **Validates: Requirements 29.1**
   * 
   * Cannot create conversation with yourself.
   */
  test('Property 35: Cannot create self-conversation', () => {
    fc.assert(
      fc.property(userArb, (user) => {
        store.clear();
        store.addUser(user);

        const result = store.createDirectConversation(user.id, user.id);

        return result.success === false &&
          result.error === 'Cannot start a conversation with yourself';
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 35: Direct Conversation Creation**
   * **Validates: Requirements 29.1**
   * 
   * Cannot create conversation with non-existent user.
   */
  test('Property 35: Cannot create conversation with non-existent user', () => {
    fc.assert(
      fc.property(userArb, userIdArb, (user, nonExistentId) => {
        // Skip if IDs match
        if (user.id === nonExistentId) return true;

        store.clear();
        store.addUser(user);

        const result = store.createDirectConversation(user.id, nonExistentId);

        return result.success === false &&
          result.error === 'Participant not found';
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 36: Real-Time Message Delivery**
   * **Validates: Requirements 29.3**
   * 
   * Messages sent in a conversation are stored and retrievable.
   */
  test('Property 36: Messages are stored and retrievable', () => {
    fc.assert(
      fc.property(userArb, userArb, messageContentArb, (user1, user2, content) => {
        // Skip if same user ID
        if (user1.id === user2.id) return true;

        store.clear();
        store.addUser(user1);
        store.addUser(user2);

        const convResult = store.createDirectConversation(user1.id, user2.id);
        if (!convResult.success || !convResult.conversation) return false;

        const msgResult = store.sendMessage(convResult.conversation.id, user1.id, content);
        if (!msgResult.success) return false;

        const messages = store.getMessages(convResult.conversation.id, user1.id);
        return messages !== null &&
          messages.length === 1 &&
          messages[0].content === content.trim() &&
          messages[0].senderId === user1.id;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 36: Real-Time Message Delivery**
   * **Validates: Requirements 29.3**
   * 
   * Both participants can see messages in a conversation.
   */
  test('Property 36: Both participants can see messages', () => {
    fc.assert(
      fc.property(userArb, userArb, messageContentArb, (user1, user2, content) => {
        // Skip if same user ID
        if (user1.id === user2.id) return true;

        store.clear();
        store.addUser(user1);
        store.addUser(user2);

        const convResult = store.createDirectConversation(user1.id, user2.id);
        if (!convResult.success || !convResult.conversation) return false;

        store.sendMessage(convResult.conversation.id, user1.id, content);

        const messagesForUser1 = store.getMessages(convResult.conversation.id, user1.id);
        const messagesForUser2 = store.getMessages(convResult.conversation.id, user2.id);

        return messagesForUser1 !== null &&
          messagesForUser2 !== null &&
          messagesForUser1.length === messagesForUser2.length &&
          messagesForUser1[0].id === messagesForUser2[0].id;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 36: Real-Time Message Delivery**
   * **Validates: Requirements 29.3**
   * 
   * Only participants can send messages.
   */
  test('Property 36: Only participants can send messages', () => {
    fc.assert(
      fc.property(userArb, userArb, userArb, messageContentArb, (user1, user2, outsider, content) => {
        // Skip if outsider is a participant or IDs match
        if (outsider.id === user1.id || outsider.id === user2.id) return true;
        if (user1.id === user2.id) return true;

        store.clear();
        store.addUser(user1);
        store.addUser(user2);
        store.addUser(outsider);

        const convResult = store.createDirectConversation(user1.id, user2.id);
        if (!convResult.success || !convResult.conversation) return false;

        const result = store.sendMessage(convResult.conversation.id, outsider.id, content);

        return result.success === false &&
          result.error === 'User is not a participant in this conversation';
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 36: Real-Time Message Delivery**
   * **Validates: Requirements 29.3**
   * 
   * Only participants can read messages.
   */
  test('Property 36: Only participants can read messages', () => {
    fc.assert(
      fc.property(userArb, userArb, userArb, messageContentArb, (user1, user2, outsider, content) => {
        // Skip if outsider is a participant or IDs match
        if (outsider.id === user1.id || outsider.id === user2.id) return true;
        if (user1.id === user2.id) return true;

        store.clear();
        store.addUser(user1);
        store.addUser(user2);
        store.addUser(outsider);

        const convResult = store.createDirectConversation(user1.id, user2.id);
        if (!convResult.success || !convResult.conversation) return false;

        store.sendMessage(convResult.conversation.id, user1.id, content);

        const messagesForOutsider = store.getMessages(convResult.conversation.id, outsider.id);

        return messagesForOutsider === null;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 36: Real-Time Message Delivery**
   * **Validates: Requirements 29.3**
   * 
   * Empty messages are rejected.
   */
  test('Property 36: Empty messages are rejected', () => {
    fc.assert(
      fc.property(userArb, userArb, (user1, user2) => {
        // Skip if same user ID
        if (user1.id === user2.id) return true;

        store.clear();
        store.addUser(user1);
        store.addUser(user2);

        const convResult = store.createDirectConversation(user1.id, user2.id);
        if (!convResult.success || !convResult.conversation) return false;

        const emptyResult = store.sendMessage(convResult.conversation.id, user1.id, '');
        const whitespaceResult = store.sendMessage(convResult.conversation.id, user1.id, '   ');

        return emptyResult.success === false &&
          whitespaceResult.success === false;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 36: Real-Time Message Delivery**
   * **Validates: Requirements 29.3**
   * 
   * Messages are ordered by creation time.
   */
  test('Property 36: Messages are ordered by creation time', () => {
    fc.assert(
      fc.property(
        userArb,
        userArb,
        fc.array(messageContentArb, { minLength: 2, maxLength: 10 }),
        (user1, user2, contents) => {
          // Skip if same user ID
          if (user1.id === user2.id) return true;

          store.clear();
          store.addUser(user1);
          store.addUser(user2);

          const convResult = store.createDirectConversation(user1.id, user2.id);
          if (!convResult.success || !convResult.conversation) return false;

          for (const content of contents) {
            store.sendMessage(convResult.conversation.id, user1.id, content);
          }

          const messages = store.getMessages(convResult.conversation.id, user1.id);
          if (!messages) return false;

          // Check messages are in order
          for (let i = 1; i < messages.length; i++) {
            if (messages[i].createdAt < messages[i - 1].createdAt) {
              return false;
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Property 35: Direct Conversation Creation**
   * **Validates: Requirements 29.2**
   * 
   * User can only see their own conversations.
   */
  test('Property 35: User can only see their own conversations', () => {
    fc.assert(
      fc.property(userArb, userArb, userArb, (user1, user2, user3) => {
        // Skip if any users are the same
        if (user1.id === user2.id || user2.id === user3.id || user1.id === user3.id) return true;

        store.clear();
        store.addUser(user1);
        store.addUser(user2);
        store.addUser(user3);

        // Create conversation between user1 and user2
        store.createDirectConversation(user1.id, user2.id);

        // User3 should not see this conversation
        const user3Convs = store.getUserConversations(user3.id);
        const user1Convs = store.getUserConversations(user1.id);
        const user2Convs = store.getUserConversations(user2.id);

        return user3Convs.length === 0 &&
          user1Convs.length === 1 &&
          user2Convs.length === 1;
      }),
      { numRuns: 100 }
    );
  });
});
