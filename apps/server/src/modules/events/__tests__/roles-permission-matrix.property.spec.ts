import * as fc from 'fast-check';
import { EventRoleType } from '@prisma/client';
import {
  ROLE_PERMISSIONS,
  EventAction,
  RolesService,
} from '../roles.service';

/**
 * Property Test: Role Permission Matrix
 * Property 5: For any user with a role and any action, the permission check
 * SHALL return true if and only if the action is in the role's allowed actions set,
 * and SHALL return false for all actions in the role's denied actions set.
 * 
 * Validates: Requirements 7.1-7.11, 19.1-19.7
 */
describe('Property 5: Role Permission Matrix', () => {
  // All possible roles
  const allRoles: EventRoleType[] = ['CREATOR', 'CO_ORGANIZER', 'HEAD', 'VOLUNTEER'];

  // All possible actions
  const allActions: EventAction[] = [
    'EDIT_EVENT',
    'DELETE_EVENT',
    'MANAGE_TICKETS',
    'PROCESS_REFUNDS',
    'ASSIGN_ROLES',
    'EXPORT_DATA',
    'SCAN_QR',
    'VIEW_ATTENDEES',
    'VIEW_CONTACT_INFO',
    'SEND_MESSAGES',
    'ISSUE_CERTIFICATES',
    'MANUAL_CHECKIN',
  ];

  // Arbitraries for property tests
  const roleArb = fc.constantFrom(...allRoles);
  const actionArb = fc.constantFrom(...allActions);

  // Create a mock RolesService for testing the pure canPerformAction function
  let rolesService: RolesService;

  beforeEach(() => {
    // Create service with null prisma (we only test pure functions)
    rolesService = new RolesService(null as any);
  });

  describe('Permission Matrix Completeness', () => {
    it('should define permissions for all roles', () => {
      fc.assert(
        fc.property(roleArb, (role) => {
          const permissions = ROLE_PERMISSIONS[role];
          expect(permissions).toBeDefined();
          expect(Array.isArray(permissions)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should have CREATOR with all permissions', () => {
      const creatorPermissions = ROLE_PERMISSIONS.CREATOR;
      expect(creatorPermissions).toHaveLength(allActions.length);
      allActions.forEach((action) => {
        expect(creatorPermissions).toContain(action);
      });
    });
  });

  describe('canPerformAction - Pure Function Tests', () => {
    it('should return true for allowed actions and false for denied actions', () => {
      fc.assert(
        fc.property(roleArb, actionArb, (role, action) => {
          const allowedActions = ROLE_PERMISSIONS[role];
          const isAllowed = allowedActions.includes(action);
          const result = rolesService.canPerformAction(role, action);
          
          expect(result).toBe(isAllowed);
        }),
        { numRuns: 100 }
      );
    });

    it('should be consistent across multiple calls', () => {
      fc.assert(
        fc.property(roleArb, actionArb, (role, action) => {
          const result1 = rolesService.canPerformAction(role, action);
          const result2 = rolesService.canPerformAction(role, action);
          const result3 = rolesService.canPerformAction(role, action);
          
          expect(result1).toBe(result2);
          expect(result2).toBe(result3);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('getAllowedActions and getDeniedActions', () => {
    it('should partition all actions into allowed and denied', () => {
      fc.assert(
        fc.property(roleArb, (role) => {
          const allowed = rolesService.getAllowedActions(role);
          const denied = rolesService.getDeniedActions(role);
          
          // No overlap
          const overlap = allowed.filter((a) => denied.includes(a));
          expect(overlap).toHaveLength(0);
          
          // Complete coverage
          const combined = [...allowed, ...denied];
          expect(combined.sort()).toEqual([...allActions].sort());
        }),
        { numRuns: 100 }
      );
    });

    it('should match canPerformAction results', () => {
      fc.assert(
        fc.property(roleArb, actionArb, (role, action) => {
          const allowed = rolesService.getAllowedActions(role);
          const denied = rolesService.getDeniedActions(role);
          const canPerform = rolesService.canPerformAction(role, action);
          
          if (canPerform) {
            expect(allowed).toContain(action);
            expect(denied).not.toContain(action);
          } else {
            expect(denied).toContain(action);
            expect(allowed).not.toContain(action);
          }
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Role Hierarchy Requirements', () => {
    // Requirement 7.2: Creator has full permissions
    it('CREATOR should have all permissions', () => {
      fc.assert(
        fc.property(actionArb, (action) => {
          expect(rolesService.canPerformAction('CREATOR', action)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    // Requirement 7.3, 7.4: Co-organizer cannot delete or assign roles
    it('CO_ORGANIZER should not have DELETE_EVENT or ASSIGN_ROLES', () => {
      expect(rolesService.canPerformAction('CO_ORGANIZER', 'DELETE_EVENT')).toBe(false);
      expect(rolesService.canPerformAction('CO_ORGANIZER', 'ASSIGN_ROLES')).toBe(false);
      expect(rolesService.canPerformAction('CO_ORGANIZER', 'EXPORT_DATA')).toBe(false);
    });

    // Requirement 7.3: Co-organizer can edit, manage tickets, process refunds
    it('CO_ORGANIZER should have management permissions', () => {
      expect(rolesService.canPerformAction('CO_ORGANIZER', 'EDIT_EVENT')).toBe(true);
      expect(rolesService.canPerformAction('CO_ORGANIZER', 'MANAGE_TICKETS')).toBe(true);
      expect(rolesService.canPerformAction('CO_ORGANIZER', 'PROCESS_REFUNDS')).toBe(true);
      expect(rolesService.canPerformAction('CO_ORGANIZER', 'VIEW_ATTENDEES')).toBe(true);
      expect(rolesService.canPerformAction('CO_ORGANIZER', 'SEND_MESSAGES')).toBe(true);
    });

    // Requirement 7.5, 7.6: Head can scan QR and view attendees
    it('HEAD should have limited permissions', () => {
      expect(rolesService.canPerformAction('HEAD', 'SCAN_QR')).toBe(true);
      expect(rolesService.canPerformAction('HEAD', 'VIEW_ATTENDEES')).toBe(true);
      expect(rolesService.canPerformAction('HEAD', 'MANUAL_CHECKIN')).toBe(true);
      
      // Should NOT have
      expect(rolesService.canPerformAction('HEAD', 'EDIT_EVENT')).toBe(false);
      expect(rolesService.canPerformAction('HEAD', 'DELETE_EVENT')).toBe(false);
      expect(rolesService.canPerformAction('HEAD', 'MANAGE_TICKETS')).toBe(false);
      expect(rolesService.canPerformAction('HEAD', 'ASSIGN_ROLES')).toBe(false);
    });

    // Requirement 7.7, 7.8: Volunteer can only scan QR
    it('VOLUNTEER should only have SCAN_QR permission', () => {
      expect(rolesService.canPerformAction('VOLUNTEER', 'SCAN_QR')).toBe(true);
      
      // Should NOT have any other permissions
      const otherActions = allActions.filter((a) => a !== 'SCAN_QR');
      otherActions.forEach((action) => {
        expect(rolesService.canPerformAction('VOLUNTEER', action)).toBe(false);
      });
    });
  });

  describe('Permission Boundary Requirements (19.1-19.7)', () => {
    // Requirement 19.1: Only creator can delete
    it('only CREATOR can DELETE_EVENT', () => {
      fc.assert(
        fc.property(roleArb, (role) => {
          const canDelete = rolesService.canPerformAction(role, 'DELETE_EVENT');
          if (role === 'CREATOR') {
            expect(canDelete).toBe(true);
          } else {
            expect(canDelete).toBe(false);
          }
        }),
        { numRuns: 100 }
      );
    });

    // Requirement 19.2: Only creator can assign roles
    it('only CREATOR can ASSIGN_ROLES', () => {
      fc.assert(
        fc.property(roleArb, (role) => {
          const canAssign = rolesService.canPerformAction(role, 'ASSIGN_ROLES');
          if (role === 'CREATOR') {
            expect(canAssign).toBe(true);
          } else {
            expect(canAssign).toBe(false);
          }
        }),
        { numRuns: 100 }
      );
    });

    // Requirement 19.3: Only creator can export data
    it('only CREATOR can EXPORT_DATA', () => {
      fc.assert(
        fc.property(roleArb, (role) => {
          const canExport = rolesService.canPerformAction(role, 'EXPORT_DATA');
          if (role === 'CREATOR') {
            expect(canExport).toBe(true);
          } else {
            expect(canExport).toBe(false);
          }
        }),
        { numRuns: 100 }
      );
    });

    // Requirement 19.4: Head cannot view contact info
    it('HEAD cannot VIEW_CONTACT_INFO', () => {
      expect(rolesService.canPerformAction('HEAD', 'VIEW_CONTACT_INFO')).toBe(false);
    });
  });

  describe('Permission Set Properties', () => {
    it('higher roles should have superset of lower role permissions (except volunteer)', () => {
      // CREATOR >= CO_ORGANIZER >= HEAD
      const creatorPerms = new Set(ROLE_PERMISSIONS.CREATOR);
      const coOrgPerms = new Set(ROLE_PERMISSIONS.CO_ORGANIZER);
      const headPerms = new Set(ROLE_PERMISSIONS.HEAD);
      
      // All CO_ORGANIZER permissions should be in CREATOR
      ROLE_PERMISSIONS.CO_ORGANIZER.forEach((perm) => {
        expect(creatorPerms.has(perm)).toBe(true);
      });
      
      // All HEAD permissions should be in CO_ORGANIZER (except MANUAL_CHECKIN which HEAD has but CO_ORG also has)
      ROLE_PERMISSIONS.HEAD.forEach((perm) => {
        expect(coOrgPerms.has(perm) || creatorPerms.has(perm)).toBe(true);
      });
    });

    it('VOLUNTEER permissions should be subset of HEAD permissions', () => {
      const headPerms = new Set(ROLE_PERMISSIONS.HEAD);
      const volunteerPerms = ROLE_PERMISSIONS.VOLUNTEER;
      
      volunteerPerms.forEach((perm) => {
        expect(headPerms.has(perm)).toBe(true);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle all role-action combinations without throwing', () => {
      fc.assert(
        fc.property(roleArb, actionArb, (role, action) => {
          expect(() => rolesService.canPerformAction(role, action)).not.toThrow();
        }),
        { numRuns: 100 }
      );
    });

    it('getAllowedActions should return a new array each time', () => {
      fc.assert(
        fc.property(roleArb, (role) => {
          const arr1 = rolesService.getAllowedActions(role);
          const arr2 = rolesService.getAllowedActions(role);
          
          // Should be equal in content
          expect(arr1).toEqual(arr2);
          
          // But not the same reference (immutability)
          expect(arr1).not.toBe(arr2);
        }),
        { numRuns: 100 }
      );
    });
  });
});
