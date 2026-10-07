export const JWT_SECRET = process.env.JWT_SECRET || 'cafe_artisan_secret_key_2026';
export const MONGODB_URI = process.env.MONGODB_URI || '';
export const PORT = Number(process.env.PORT) || 3000;
export const IS_PROD = process.env.NODE_ENV === 'production';
