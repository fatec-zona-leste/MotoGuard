export const PORT = process.env.PORT ?? 8081;
export const APP_ENV = process.env.APP_ENV ?? "prod";
export const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
export const ALLOW_ORIGINS = process.env.ALLOW_ORIGINS?.split(",") || "*";