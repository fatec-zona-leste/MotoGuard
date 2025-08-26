export const PORT = process.env.PORT || 8082;
export const APP_ENV = process.env.APP_ENV || "dev";
export const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

export const DATABASE_NAME = process.env.DATABASE_NAME || "motoguard";
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME || "root";
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "";
export const DATABASE_HOST = process.env.DATABASE_HOST || "localhost";

export const ALLOW_ORIGINS = process.env.ALLOW_ORIGINS?.split(",") || "*";
export const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";