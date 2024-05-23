import { config } from 'dotenv';

config();

// App
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = parseInt(process.env.PORT, 10) || 3000;
export const LOG_LEVEL = process.env.LOG_LEVEL || 'log,error,warn,debug,verbose';
export const SERVER_URL = process.env.SERVER_URL;
export const LISTEN_ON = process.env.LISTEN_ON || 'localhost';
export const TIMEZONE = process.env.TIMEZONE || 'Asia/Ho_Chi_Minh';
export const API_PREFIX = process.env.API_PREFIX || 'api';
export const PAGE_SIZE = parseInt(process.env.PAGE_SIZE, 10) || 20;
export const DOMAIN_WHITELIST = process.env.DOMAIN_WHITELIST || '*';

// THROTTLE
export const THROTTLE_TTL = parseInt(process.env.THROTTLE_TTL) || 300;
export const THROTTLE_LIMIT = parseInt(process.env.THROTTLE_LIMIT) || 300;

// BCRYPT_SALT
export const BCRYPT_SALT = parseInt(process.env.BCRYPT_SALT, 10) || 10;

// i18n
export const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'en-US';

// DATABASE
export const DATABASE_CONNECTION = process.env.DATABASE_CONNECTION || 'mysql';
export const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
export const DATABASE_PORT = parseInt(process.env.DATABASE_PORT, 10) || 3306;
export const DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'root';
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'password';
export const DATABASE_DB_NAME = process.env.DATABASE_DB_NAME || 'nest-starter';
