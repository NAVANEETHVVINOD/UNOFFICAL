/**
 * Utility for formatting resource filenames according to the naming convention.
 * 
 * **Validates: Requirements 3.1, 3.2, 3.4**
 * 
 * Format: SubjectName_Username.extension
 * - Special characters are removed from subject and username
 * - Spaces are replaced with underscores
 */

/**
 * Sanitize a string by removing special characters and replacing spaces with underscores.
 */
export function sanitizeForFilename(input: string): string {
  return input
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '_')           // Replace spaces with underscores
    .trim();
}

/**
 * Format a resource filename according to the naming convention.
 * 
 * @param subjectName - The subject name for the resource
 * @param username - The username of the uploader
 * @param originalFilename - The original filename with extension
 * @returns Formatted filename as "SubjectName_Username.extension"
 * 
 * @example
 * formatResourceFilename("Computer Science", "john_doe", "notes.pdf")
 * // Returns: "Computer_Science_john_doe.pdf"
 */
export function formatResourceFilename(
  subjectName: string,
  username: string,
  originalFilename: string,
): string {
  // Extract extension from original filename
  const lastDotIndex = originalFilename.lastIndexOf('.');
  const extension = lastDotIndex !== -1 
    ? originalFilename.substring(lastDotIndex + 1).toLowerCase()
    : 'pdf'; // Default to pdf if no extension

  // Sanitize subject and username
  const sanitizedSubject = sanitizeForFilename(subjectName);
  const sanitizedUsername = sanitizeForFilename(username);

  // Combine into formatted filename
  return `${sanitizedSubject}_${sanitizedUsername}.${extension}`;
}

/**
 * Parse a formatted resource filename to extract metadata.
 * 
 * @param filename - The formatted filename
 * @returns Object with subject, username, and extension, or null if invalid format
 */
export function parseResourceFilename(filename: string): {
  subject: string;
  username: string;
  extension: string;
} | null {
  // Match pattern: Subject_Username.extension
  const match = filename.match(/^(.+)_([^_]+)\.(\w+)$/);
  
  if (!match) {
    return null;
  }

  return {
    subject: match[1].replace(/_/g, ' '),
    username: match[2],
    extension: match[3],
  };
}

/**
 * Validate that a filename follows the resource naming convention.
 * 
 * @param filename - The filename to validate
 * @returns true if the filename follows the convention
 */
export function isValidResourceFilename(filename: string): boolean {
  // Must have format: Something_Something.extension
  const pattern = /^[A-Za-z0-9_]+_[A-Za-z0-9_]+\.\w+$/;
  return pattern.test(filename);
}
