/**
 * Cookie utilities for cookie-based authentication with 1-day expiration.
 */

export const ONE_DAY_SECONDS = 60 * 60 * 24; // 86,400 seconds = 1 day
export const AUTH_COOKIE_NAME = 'auth_token';
export const USER_COOKIE_NAME = 'customer_user';

/**
 * Reads a cookie by name from document.cookie on client.
 */
export function getClientCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|;\\s*)' + encodeURIComponent(name) + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Sets a client-accessible cookie with 1-day (or specified) expiration.
 */
export function setClientCookie(
  name: string,
  value: string,
  maxAgeSeconds: number = ONE_DAY_SECONDS
): void {
  if (typeof document === 'undefined') return;
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${isSecure ? '; Secure' : ''}`;
}

/**
 * Deletes a cookie on client by setting max-age to 0.
 */
export function deleteClientCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`;
}
