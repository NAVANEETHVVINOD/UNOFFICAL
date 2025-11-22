"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configValidationSchema = void 0;
var Joi = require("joi");
exports.configValidationSchema = Joi.object({
    // Database
    DATABASE_URL: Joi.string().required(),
    // JWT
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().required(),
    JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
    // Server
    PORT: Joi.number().default(4000),
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'staging')
        .default('development'),
    // Email - Optional for now
    SMTP_HOST: Joi.string().optional(),
    SMTP_PORT: Joi.number().optional(),
    SMTP_USER: Joi.string().optional(),
    SMTP_PASS: Joi.string().optional(),
    // AWS S3 - Optional for now
    AWS_ACCESS_KEY_ID: Joi.string().optional(),
    AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
    AWS_REGION: Joi.string().optional(),
    AWS_S3_BUCKET: Joi.string().optional(),
    // OpenAI - Optional for now
    OPENAI_API_KEY: Joi.string().optional(),
    // Redis - Optional for now
    REDIS_URL: Joi.string().optional(),
});
