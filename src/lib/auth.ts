import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

const AUTH_SECRET = process.env.AUTH_SECRET || 'default-secret-key-change-me-in-production';
const encodedKey = new TextEncoder().encode(AUTH_SECRET);

export const AUTH_COOKIE_NAME = 'auth_token';
export const USER_COOKIE_NAME = 'customer_user';
export const ONE_DAY_SECONDS = 60 * 60 * 24; // 86,400 seconds = 1 day
export const AUTH_TOKEN_EXPIRY = '1d'; // 1 day

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  [key: string]: unknown;
}

/**
 * Hashes a plaintext password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares plaintext password with the stored hash.
 */
export async function comparePassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

/**
 * Signs a JWT token with the given payload. Defaults to 1-day expiration.
 */
export async function signToken(
  payload: TokenPayload,
  expiresIn: string = AUTH_TOKEN_EXPIRY
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedKey);
}

/**
 * Verifies a JWT token and returns the payload.
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as TokenPayload;
  } catch {
    return null;
  }
}
