export default () => ({
    port: parseInt(process.env.PORT ?? '4000', 10),
    databaseUrl: process.env.DATABASE_URL,
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        accessExpires: process.env.JWT_ACCESS_EXPIRES ?? '15m',
        refreshExpires: process.env.JWT_REFRESH_EXPIRES ?? '7d',
    },
    corsOrigin: (process.env.CORS_ORIGIN ?? '').split(',').filter(Boolean),
    supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
    },
});
