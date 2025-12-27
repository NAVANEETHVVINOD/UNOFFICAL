/**
 * Property Test: College Admin Content Moderation
 * 
 * **Property 19: College Admin Content Moderation**
 * **Validates: Requirements 13.2, 13.3**
 * 
 * Tests that college admins can hide, feature, or remove posts,
 * and approve or reject event submissions.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

type PostStatus = 'ACTIVE' | 'HIDDEN' | 'FEATURED' | 'REMOVED';
type EventApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface Post {
  id: string;
  content: string;
  status: PostStatus;
  collegeId: string;
  authorId: string;
}

interface Event {
  id: string;
  title: string;
  status: EventApprovalStatus;
  collegeId: string;
  createdById: string;
  rejectionReason?: string;
}

// Generators
const postStatusArbitrary = fc.constantFrom<PostStatus>('ACTIVE', 'HIDDEN', 'FEATURED', 'REMOVED');
const eventStatusArbitrary = fc.constantFrom<EventApprovalStatus>('PENDING', 'APPROVED', 'REJECTED');

const postArbitrary = fc.record({
  id: fc.uuid(),
  content: fc.string({ minLength: 1, maxLength: 500 }),
  status: postStatusArbitrary,
  collegeId: fc.uuid(),
  authorId: fc.uuid(),
});

const eventArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  status: eventStatusArbitrary,
  collegeId: fc.uuid(),
  createdById: fc.uuid(),
  rejectionReason: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
});

// Content moderation functions
function moderatePost(
  post: Post,
  action: 'hide' | 'feature' | 'remove' | 'restore',
  adminCollegeId: string
): { success: boolean; post: Post; error?: string } {
  // Admin can only moderate posts from their college
  if (post.collegeId !== adminCollegeId) {
    return { success: false, post, error: 'Cannot moderate posts from other colleges' };
  }

  let newStatus: PostStatus;
  switch (action) {
    case 'hide':
      newStatus = 'HIDDEN';
      break;
    case 'feature':
      newStatus = 'FEATURED';
      break;
    case 'remove':
      newStatus = 'REMOVED';
      break;
    case 'restore':
      newStatus = 'ACTIVE';
      break;
  }

  return {
    success: true,
    post: { ...post, status: newStatus },
  };
}

function approveEvent(
  event: Event,
  adminCollegeId: string
): { success: boolean; event: Event; error?: string } {
  if (event.collegeId !== adminCollegeId) {
    return { success: false, event, error: 'Cannot approve events from other colleges' };
  }

  if (event.status !== 'PENDING') {
    return { success: false, event, error: 'Event is not pending approval' };
  }

  return {
    success: true,
    event: { ...event, status: 'APPROVED', rejectionReason: undefined },
  };
}

function rejectEvent(
  event: Event,
  adminCollegeId: string,
  reason?: string
): { success: boolean; event: Event; error?: string } {
  if (event.collegeId !== adminCollegeId) {
    return { success: false, event, error: 'Cannot reject events from other colleges' };
  }

  if (event.status !== 'PENDING') {
    return { success: false, event, error: 'Event is not pending approval' };
  }

  return {
    success: true,
    event: { ...event, status: 'REJECTED', rejectionReason: reason },
  };
}

describe('Property 19: College Admin Content Moderation', () => {
  describe('Post Moderation', () => {
    it('should hide posts from same college', () => {
      fc.assert(
        fc.property(
          postArbitrary,
          (post) => {
            const result = moderatePost(post, 'hide', post.collegeId);
            expect(result.success).toBe(true);
            expect(result.post.status).toBe('HIDDEN');
            return true;
          }
        )
      );
    });

    it('should feature posts from same college', () => {
      fc.assert(
        fc.property(
          postArbitrary,
          (post) => {
            const result = moderatePost(post, 'feature', post.collegeId);
            expect(result.success).toBe(true);
            expect(result.post.status).toBe('FEATURED');
            return true;
          }
        )
      );
    });

    it('should remove posts from same college', () => {
      fc.assert(
        fc.property(
          postArbitrary,
          (post) => {
            const result = moderatePost(post, 'remove', post.collegeId);
            expect(result.success).toBe(true);
            expect(result.post.status).toBe('REMOVED');
            return true;
          }
        )
      );
    });

    it('should restore posts from same college', () => {
      fc.assert(
        fc.property(
          postArbitrary,
          (post) => {
            const result = moderatePost(post, 'restore', post.collegeId);
            expect(result.success).toBe(true);
            expect(result.post.status).toBe('ACTIVE');
            return true;
          }
        )
      );
    });

    it('should not moderate posts from other colleges', () => {
      fc.assert(
        fc.property(
          postArbitrary,
          fc.uuid(),
          fc.constantFrom('hide' as const, 'feature' as const, 'remove' as const, 'restore' as const),
          (post, differentCollegeId, action) => {
            // Ensure different college
            if (post.collegeId === differentCollegeId) return true;
            
            const result = moderatePost(post, action, differentCollegeId);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Cannot moderate posts from other colleges');
            expect(result.post.status).toBe(post.status); // Status unchanged
            return true;
          }
        )
      );
    });

    it('should preserve post content after moderation', () => {
      fc.assert(
        fc.property(
          postArbitrary,
          fc.constantFrom('hide' as const, 'feature' as const, 'remove' as const, 'restore' as const),
          (post, action) => {
            const result = moderatePost(post, action, post.collegeId);
            expect(result.post.id).toBe(post.id);
            expect(result.post.content).toBe(post.content);
            expect(result.post.authorId).toBe(post.authorId);
            return true;
          }
        )
      );
    });
  });

  describe('Event Approval', () => {
    it('should approve pending events from same college', () => {
      fc.assert(
        fc.property(
          eventArbitrary,
          (event) => {
            const pendingEvent = { ...event, status: 'PENDING' as EventApprovalStatus };
            const result = approveEvent(pendingEvent, pendingEvent.collegeId);
            expect(result.success).toBe(true);
            expect(result.event.status).toBe('APPROVED');
            return true;
          }
        )
      );
    });

    it('should reject pending events from same college', () => {
      fc.assert(
        fc.property(
          eventArbitrary,
          fc.string({ minLength: 1, maxLength: 200 }),
          (event, reason) => {
            const pendingEvent = { ...event, status: 'PENDING' as EventApprovalStatus };
            const result = rejectEvent(pendingEvent, pendingEvent.collegeId, reason);
            expect(result.success).toBe(true);
            expect(result.event.status).toBe('REJECTED');
            expect(result.event.rejectionReason).toBe(reason);
            return true;
          }
        )
      );
    });

    it('should not approve non-pending events', () => {
      fc.assert(
        fc.property(
          eventArbitrary,
          fc.constantFrom('APPROVED' as EventApprovalStatus, 'REJECTED' as EventApprovalStatus),
          (event, status) => {
            const nonPendingEvent = { ...event, status };
            const result = approveEvent(nonPendingEvent, nonPendingEvent.collegeId);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Event is not pending approval');
            return true;
          }
        )
      );
    });

    it('should not reject non-pending events', () => {
      fc.assert(
        fc.property(
          eventArbitrary,
          fc.constantFrom('APPROVED' as EventApprovalStatus, 'REJECTED' as EventApprovalStatus),
          (event, status) => {
            const nonPendingEvent = { ...event, status };
            const result = rejectEvent(nonPendingEvent, nonPendingEvent.collegeId, 'reason');
            expect(result.success).toBe(false);
            expect(result.error).toBe('Event is not pending approval');
            return true;
          }
        )
      );
    });

    it('should not approve events from other colleges', () => {
      fc.assert(
        fc.property(
          eventArbitrary,
          fc.uuid(),
          (event, differentCollegeId) => {
            if (event.collegeId === differentCollegeId) return true;
            
            const pendingEvent = { ...event, status: 'PENDING' as EventApprovalStatus };
            const result = approveEvent(pendingEvent, differentCollegeId);
            expect(result.success).toBe(false);
            expect(result.error).toBe('Cannot approve events from other colleges');
            return true;
          }
        )
      );
    });

    it('should clear rejection reason when approving', () => {
      const event: Event = {
        id: '1',
        title: 'Test Event',
        status: 'PENDING',
        collegeId: 'college-1',
        createdById: 'user-1',
        rejectionReason: 'Previous rejection reason',
      };

      const result = approveEvent(event, event.collegeId);
      expect(result.success).toBe(true);
      expect(result.event.rejectionReason).toBeUndefined();
    });
  });
});
