// lib/auth-utils.ts
export const CUSTOMER_TOKEN_COOKIE = 'customer_token';
export const CUSTOMER_EXPIRY_COOKIE = 'customer_expiry';
export const CUSTOMER_ID_COOKIE = 'customer_id';

// Get customer token (Universal)
export function getCustomerToken() {
  // Server side
  if (typeof window === 'undefined') {
    try {
      // Dynamically import next/headers only on server
      const { cookies } = require('next/headers');
      const cookieStore = cookies();
      return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value;
    } catch (error) {
      return null;
    }
  }
  
  // Client side
  try {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith(CUSTOMER_TOKEN_COOKIE + '='));
    return tokenCookie ? tokenCookie.split('=')[1] : null;
  } catch (error) {
    return null;
  }
}

// Set auth cookies (Server only)
export function setAuthCookies(accessToken: string, expiresAt: string, customerId: string) {
  if (typeof window !== 'undefined') {
    throw new Error('setAuthCookies can only be called on the server');
  }
  
  try {
    const { cookies } = require('next/headers');
    const cookieStore = cookies();
    
    cookieStore.set(CUSTOMER_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    cookieStore.set(CUSTOMER_EXPIRY_COOKIE, expiresAt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    cookieStore.set(CUSTOMER_ID_COOKIE, customerId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });
  } catch (error) {
    console.error('Error setting auth cookies:', error);
  }
}

// Clear auth cookies (Server only)
export function clearAuthCookies() {
  if (typeof window !== 'undefined') {
    throw new Error('clearAuthCookies can only be called on the server');
  }
  
  try {
    const { cookies } = require('next/headers');
    const cookieStore = cookies();
    cookieStore.delete(CUSTOMER_TOKEN_COOKIE);
    cookieStore.delete(CUSTOMER_EXPIRY_COOKIE);
    cookieStore.delete(CUSTOMER_ID_COOKIE);
  } catch (error) {
    console.error('Error clearing auth cookies:', error);
  }
}

// Client-side clear cookies
export function clearCookiesClient() {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${CUSTOMER_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  document.cookie = `${CUSTOMER_EXPIRY_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  document.cookie = `${CUSTOMER_ID_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}