import * as Joi from 'joi';

export const validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test')
        .default('development'),
    PORT: Joi.number().default(4000),
    DATABASE_URL: Joi.string().required(),
    JWT_ACCESS_SECRET: Joi.string().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_ACCESS_EXPIRES: Joi.string().default('15m'),
    JWT_REFRESH_EXPIRES: Joi.string().default('7d'),
    CORS_ORIGIN: Joi.string().default('*'),
    SUPABASE_URL: Joi.string().required(),
    SUPABASE_KEY: Joi.string().required(),
});
