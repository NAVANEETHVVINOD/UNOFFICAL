import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

/**
 * PII Encryption utility for sensitive data at rest
 * Validates: Requirement 26.5
 * 
 * Uses AES-256-GCM for authenticated encryption
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 32;

/**
 * Get encryption key from environment or generate one
 */
function getEncryptionKey(): Buffer {
  const secret = process.env.PII_ENCRYPTION_SECRET || 'default-dev-secret-change-in-production';
  const salt = process.env.PII_ENCRYPTION_SALT || 'linker-pii-salt';
  return scryptSync(secret, salt, 32);
}

/**
 * Encrypt sensitive PII data
 * @param plaintext - The data to encrypt
 * @returns Base64 encoded encrypted string (iv:authTag:ciphertext)
 */
export function encryptPII(plaintext: string): string {
  if (!plaintext) return plaintext;

  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:ciphertext (all base64)
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}

/**
 * Decrypt sensitive PII data
 * @param encryptedData - Base64 encoded encrypted string
 * @returns Decrypted plaintext
 */
export function decryptPII(encryptedData: string): string {
  if (!encryptedData || !encryptedData.includes(':')) return encryptedData;

  try {
    const [ivBase64, authTagBase64, ciphertext] = encryptedData.split(':');
    
    if (!ivBase64 || !authTagBase64 || !ciphertext) {
      return encryptedData; // Not encrypted data
    }

    const key = getEncryptionKey();
    const iv = Buffer.from(ivBase64, 'base64');
    const authTag = Buffer.from(authTagBase64, 'base64');

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'base64', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    // If decryption fails, return original (might not be encrypted)
    return encryptedData;
  }
}

/**
 * Check if a string appears to be encrypted
 */
export function isEncrypted(data: string): boolean {
  if (!data) return false;
  const parts = data.split(':');
  return parts.length === 3 && parts.every(p => p.length > 0);
}

/**
 * Encrypt an object's PII fields
 * @param obj - Object containing PII fields
 * @param fields - Array of field names to encrypt
 */
export function encryptPIIFields<T extends Record<string, unknown>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const result = { ...obj };
  for (const field of fields) {
    const value = result[field];
    if (typeof value === 'string' && value && !isEncrypted(value)) {
      (result as Record<string, unknown>)[field as string] = encryptPII(value);
    }
  }
  return result;
}

/**
 * Decrypt an object's PII fields
 * @param obj - Object containing encrypted PII fields
 * @param fields - Array of field names to decrypt
 */
export function decryptPIIFields<T extends Record<string, unknown>>(
  obj: T,
  fields: (keyof T)[]
): T {
  const result = { ...obj };
  for (const field of fields) {
    const value = result[field];
    if (typeof value === 'string' && value && isEncrypted(value)) {
      (result as Record<string, unknown>)[field as string] = decryptPII(value);
    }
  }
  return result;
}

/**
 * HMAC secret rotation support
 * Validates: Requirement 26.6
 * 
 * Supports multiple active secrets during rotation period
 */
export function getActiveHMACSecrets(): string[] {
  const primary = process.env.HMAC_SECRET || 'default-hmac-secret';
  const secondary = process.env.HMAC_SECRET_PREVIOUS;
  
  const secrets = [primary];
  if (secondary) {
    secrets.push(secondary);
  }
  return secrets;
}

/**
 * Verify HMAC with rotation support
 * Tries all active secrets
 */
export function verifyHMACWithRotation(
  data: string,
  signature: string,
  computeHMAC: (data: string, secret: string) => string
): boolean {
  const secrets = getActiveHMACSecrets();
  
  for (const secret of secrets) {
    const computed = computeHMAC(data, secret);
    if (computed === signature) {
      return true;
    }
  }
  
  return false;
}
