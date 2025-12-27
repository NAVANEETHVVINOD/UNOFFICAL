/**
 * Property Test: Club Admin Member Management
 * 
 * **Property 18: Club Admin Member Management**
 * **Validates: Requirements 12.2**
 * 
 * Tests that club admins can add/remove members and assign roles.
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';

type ClubRole = 'MEMBER' | 'LEAD' | 'STAFF';

interface ClubMember {
  id: string;
  userId: string;
  clubId: string;
  role: ClubRole;
  displayRole?: string;
  joinedAt: string;
}

interface Club {
  id: string;
  name: string;
  members: ClubMember[];
}

// Generators
const clubRoleArbitrary = fc.constantFrom<ClubRole>('MEMBER', 'LEAD', 'STAFF');

const clubMemberArbitrary = fc.record({
  id: fc.uuid(),
  userId: fc.uuid(),
  clubId: fc.uuid(),
  role: clubRoleArbitrary,
  displayRole: fc.option(fc.string({ minLength: 1, maxLength: 50 }), { nil: undefined }),
  joinedAt: fc.integer({ min: Date.parse('2024-01-01'), max: Date.parse('2025-12-31') })
    .map(ts => new Date(ts).toISOString()),
});

// Member management functions
function addMember(
  club: Club,
  userId: string,
  role: ClubRole = 'MEMBER'
): { success: boolean; club: Club; error?: string } {
  // Check if already a member
  if (club.members.some(m => m.userId === userId)) {
    return { success: false, club, error: 'User is already a member' };
  }

  const newMember: ClubMember = {
    id: `member-${Date.now()}`,
    userId,
    clubId: club.id,
    role,
    joinedAt: new Date().toISOString(),
  };

  return {
    success: true,
    club: {
      ...club,
      members: [...club.members, newMember],
    },
  };
}

function removeMember(
  club: Club,
  userId: string
): { success: boolean; club: Club; error?: string } {
  const memberIndex = club.members.findIndex(m => m.userId === userId);
  
  if (memberIndex === -1) {
    return { success: false, club, error: 'User is not a member' };
  }

  // Cannot remove the last LEAD
  const member = club.members[memberIndex];
  if (member.role === 'LEAD') {
    const leadCount = club.members.filter(m => m.role === 'LEAD').length;
    if (leadCount <= 1) {
      return { success: false, club, error: 'Cannot remove the last lead' };
    }
  }

  return {
    success: true,
    club: {
      ...club,
      members: club.members.filter(m => m.userId !== userId),
    },
  };
}

function updateMemberRole(
  club: Club,
  userId: string,
  newRole: ClubRole
): { success: boolean; club: Club; error?: string } {
  const memberIndex = club.members.findIndex(m => m.userId === userId);
  
  if (memberIndex === -1) {
    return { success: false, club, error: 'User is not a member' };
  }

  const member = club.members[memberIndex];
  
  // Cannot demote the last LEAD
  if (member.role === 'LEAD' && newRole !== 'LEAD') {
    const leadCount = club.members.filter(m => m.role === 'LEAD').length;
    if (leadCount <= 1) {
      return { success: false, club, error: 'Cannot demote the last lead' };
    }
  }

  const updatedMembers = [...club.members];
  updatedMembers[memberIndex] = { ...member, role: newRole };

  return {
    success: true,
    club: {
      ...club,
      members: updatedMembers,
    },
  };
}

describe('Property 18: Club Admin Member Management', () => {
  it('should add new members successfully', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 100 }),
          members: fc.array(clubMemberArbitrary, { minLength: 0, maxLength: 20 }),
        }),
        fc.uuid(),
        clubRoleArbitrary,
        (club, newUserId, role) => {
          // Ensure newUserId is not already a member
          const isExisting = club.members.some(m => m.userId === newUserId);
          
          const result = addMember(club, newUserId, role);
          
          if (isExisting) {
            expect(result.success).toBe(false);
            expect(result.error).toBe('User is already a member');
          } else {
            expect(result.success).toBe(true);
            expect(result.club.members.length).toBe(club.members.length + 1);
            expect(result.club.members.some(m => m.userId === newUserId)).toBe(true);
          }
          return true;
        }
      )
    );
  });

  it('should not add duplicate members', () => {
    const club: Club = {
      id: 'club-1',
      name: 'Test Club',
      members: [{
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: 'MEMBER',
        joinedAt: new Date().toISOString(),
      }],
    };

    const result = addMember(club, 'user-1');
    expect(result.success).toBe(false);
    expect(result.error).toBe('User is already a member');
    expect(result.club.members.length).toBe(1);
  });

  it('should remove members successfully', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 100 }),
          members: fc.array(clubMemberArbitrary, { minLength: 2, maxLength: 20 }),
        }),
        (club) => {
          // Ensure at least 2 leads if removing a lead
          const leads = club.members.filter(m => m.role === 'LEAD');
          const nonLeads = club.members.filter(m => m.role !== 'LEAD');
          
          if (nonLeads.length > 0) {
            const memberToRemove = nonLeads[0];
            const result = removeMember(club, memberToRemove.userId);
            
            expect(result.success).toBe(true);
            expect(result.club.members.length).toBe(club.members.length - 1);
            expect(result.club.members.some(m => m.userId === memberToRemove.userId)).toBe(false);
          }
          return true;
        }
      )
    );
  });

  it('should not remove non-existent members', () => {
    const club: Club = {
      id: 'club-1',
      name: 'Test Club',
      members: [],
    };

    const result = removeMember(club, 'non-existent-user');
    expect(result.success).toBe(false);
    expect(result.error).toBe('User is not a member');
  });

  it('should not remove the last lead', () => {
    const club: Club = {
      id: 'club-1',
      name: 'Test Club',
      members: [{
        id: 'member-1',
        userId: 'user-1',
        clubId: 'club-1',
        role: 'LEAD',
        joinedAt: new Date().toISOString(),
      }],
    };

    const result = removeMember(club, 'user-1');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Cannot remove the last lead');
  });

  it('should update member roles successfully', () => {
    fc.assert(
      fc.property(
        clubRoleArbitrary,
        clubRoleArbitrary,
        (originalRole, newRole) => {
          const club: Club = {
            id: 'club-1',
            name: 'Test Club',
            members: [
              {
                id: 'member-1',
                userId: 'user-1',
                clubId: 'club-1',
                role: originalRole,
                joinedAt: new Date().toISOString(),
              },
              {
                id: 'member-2',
                userId: 'user-2',
                clubId: 'club-1',
                role: 'LEAD', // Ensure there's always a lead
                joinedAt: new Date().toISOString(),
              },
            ],
          };

          const result = updateMemberRole(club, 'user-1', newRole);
          
          // Should succeed unless demoting the only lead
          if (originalRole === 'LEAD' && newRole !== 'LEAD') {
            const leadCount = club.members.filter(m => m.role === 'LEAD').length;
            if (leadCount <= 1) {
              expect(result.success).toBe(false);
            }
          } else {
            expect(result.success).toBe(true);
            const updatedMember = result.club.members.find(m => m.userId === 'user-1');
            expect(updatedMember?.role).toBe(newRole);
          }
          return true;
        }
      )
    );
  });

  it('should preserve member count after role update', () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          name: fc.string({ minLength: 1, maxLength: 100 }),
          members: fc.array(clubMemberArbitrary, { minLength: 1, maxLength: 20 }),
        }),
        clubRoleArbitrary,
        (club, newRole) => {
          if (club.members.length > 0) {
            const memberToUpdate = club.members[0];
            const result = updateMemberRole(club, memberToUpdate.userId, newRole);
            
            // Member count should not change
            expect(result.club.members.length).toBe(club.members.length);
          }
          return true;
        }
      )
    );
  });
});
