export const env = {
    PORT: Number(process.env.PORT || 4000),
    HOST: '0.0.0.0',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/health',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    // JWT
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'change-me-access',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'change-me-refresh',
    ACCESS_TTL: process.env.ACCESS_TTL || '15m', // e.g., '15m'
    REFRESH_TTL_DAYS: Number(process.env.REFRESH_TTL_DAYS || 30),
    // Misc
    INVITE_TTL_HOURS: Number(process.env.INVITE_TTL_HOURS || 72),
};
