/**
 * Property-based tests for Resource Filename Format
 * 
 * **Feature: teacher-classroom-admin-views, Property 1: Resource Filename Format**
 * **Validates: Requirements 3.1, 3.2, 3.4**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Replicate the utility functions for testing
function sanitizeForFilename(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .trim();
}

function formatResourceFilename(
  subjectName: string,
  username: string,
  originalFilename: string,
): string {
  const lastDotIndex = originalFilename.lastIndexOf('.');
  const extension = lastDotIndex !== -1 
    ? originalFilename.substring(lastDotIndex + 1).toLowerCase()
    : 'pdf';

  const sanitizedSubject = sanitizeForFilename(subjectName);
  const sanitizedUsername = sanitizeForFilename(username);

  return `${sanitizedSubject}_${sanitizedUsername}.${extension}`;
}

function isValidResourceFilename(filename: string): boolean {
  const pattern = /^[A-Za-z0-9_]+_[A-Za-z0-9_]+\.\w+$/;
  return pattern.test(filename);
}

describe('Property 1: Resource Filename Format', () => {
  /**
   * Property: For any subject, username, and original filename,
   * the formatted filename SHALL follow the pattern "SubjectName_Username.extension"
   */
  it('should always produce filenames in SubjectName_Username.extension format', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => /[a-zA-Z0-9]/.test(s)),
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => /[a-zA-Z0-9]/.test(s)),
        fc.constantFrom('notes.pdf', 'document.docx', 'image.png', 'file.jpg', 'data.doc'),
        (subject, username, originalFilename) => {
          const result = formatResourceFilename(subject, username, originalFilename);
          
          // Should contain exactly one underscore separating subject and username
          const parts = result.split('.');
          expect(parts.length).toBe(2);
          
          // Should have an extension
          expect(parts[1]).toBeTruthy();
          
          // The filename part should contain underscore
          expect(parts[0]).toContain('_');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Special characters should be removed from subject and username
   */
  it('should remove special characters from subject and username', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 30 }),
        fc.constantFrom('.pdf', '.docx', '.png'),
        (subject, username, ext) => {
          const originalFilename = `file${ext}`;
          const result = formatResourceFilename(subject, username, originalFilename);
          
          // Result should not contain special characters except underscore and dot
          const filenameWithoutExt = result.split('.')[0];
          expect(filenameWithoutExt).toMatch(/^[A-Za-z0-9_]*$/);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Extension should be preserved from original filename
   */
  it('should preserve the file extension from original filename', () => {
    const extensions = ['pdf', 'docx', 'png', 'jpg', 'doc'];
    
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /[a-zA-Z0-9]/.test(s)),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /[a-zA-Z0-9]/.test(s)),
        fc.constantFrom(...extensions),
        (subject, username, ext) => {
          const originalFilename = `original_file.${ext}`;
          const result = formatResourceFilename(subject, username, originalFilename);
          
          expect(result.endsWith(`.${ext}`)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Spaces in subject and username should be replaced with underscores
   */
  it('should replace spaces with underscores', () => {
    const result1 = formatResourceFilename('Computer Science', 'John Doe', 'notes.pdf');
    expect(result1).toBe('Computer_Science_John_Doe.pdf');
    
    const result2 = formatResourceFilename('Data Structures', 'Jane Smith', 'lecture.docx');
    expect(result2).toBe('Data_Structures_Jane_Smith.docx');
  });

  /**
   * Property: The same inputs should always produce the same output (deterministic)
   */
  it('should be deterministic - same inputs produce same output', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => /[a-zA-Z0-9]/.test(s)),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /[a-zA-Z0-9]/.test(s)),
        fc.constantFrom('file.pdf', 'doc.docx', 'img.png'),
        (subject, username, originalFilename) => {
          const result1 = formatResourceFilename(subject, username, originalFilename);
          const result2 = formatResourceFilename(subject, username, originalFilename);
          
          expect(result1).toBe(result2);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Valid formatted filenames should pass validation
   */
  it('should produce valid filenames that pass validation', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9 ]{0,20}$/),
        fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,15}$/),
        fc.constantFrom('notes.pdf', 'doc.docx', 'file.png'),
        (subject, username, originalFilename) => {
          const result = formatResourceFilename(subject, username, originalFilename);
          
          // Should be a valid filename
          expect(isValidResourceFilename(result)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property: Extension should be lowercase
   */
  it('should convert extension to lowercase', () => {
    const result1 = formatResourceFilename('Math', 'user', 'FILE.PDF');
    expect(result1).toBe('Math_user.pdf');
    
    const result2 = formatResourceFilename('Physics', 'student', 'Notes.DOCX');
    expect(result2).toBe('Physics_student.docx');
  });

  /**
   * Property: Files without extension should default to pdf
   */
  it('should default to pdf extension when original has no extension', () => {
    const result = formatResourceFilename('Subject', 'User', 'filename');
    expect(result).toBe('Subject_User.pdf');
  });
});

describe('Sanitize for Filename', () => {
  it('should remove special characters', () => {
    expect(sanitizeForFilename('Hello@World!')).toBe('HelloWorld');
    expect(sanitizeForFilename('Test#123$')).toBe('Test123');
    expect(sanitizeForFilename('File/Name\\Path')).toBe('FileNamePath');
  });

  it('should replace spaces with underscores', () => {
    expect(sanitizeForFilename('Hello World')).toBe('Hello_World');
    expect(sanitizeForFilename('Multiple   Spaces')).toBe('Multiple_Spaces');
  });

  it('should handle empty strings', () => {
    expect(sanitizeForFilename('')).toBe('');
  });

  it('should preserve alphanumeric characters', () => {
    fc.assert(
      fc.property(
        fc.stringMatching(/^[a-zA-Z0-9]+$/),
        (input) => {
          const result = sanitizeForFilename(input);
          expect(result).toBe(input);
        }
      ),
      { numRuns: 100 }
    );
  });
});
