import { z } from 'zod';

// Common environment variables
export const commonEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  APP_NAME: z.string().default('College Connect'),
});

// Backend environment variables
export const backendEnvSchema = commonEnvSchema.extend({
  PORT: z.number().default(3001),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  VECTOR_DB_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
});

// Frontend environment variables
export const frontendEnvSchema = commonEnvSchema.extend({
  NEXT_PUBLIC_API_URL: z.string(),
  NEXT_PUBLIC_SOCKET_URL: z.string().optional(),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
});

// Mobile environment variables
export const mobileEnvSchema = commonEnvSchema.extend({
  API_URL: z.string(),
  SOCKET_URL: z.string().optional(),
});

// Environment type definitions
export type CommonEnv = z.infer<typeof commonEnvSchema>;
export type BackendEnv = z.infer<typeof backendEnvSchema>;
export type FrontendEnv = z.infer<typeof frontendEnvSchema>;
export type MobileEnv = z.infer<typeof mobileEnvSchema>;