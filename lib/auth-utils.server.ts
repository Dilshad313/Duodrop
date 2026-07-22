// lib/auth-utils.server.ts
import { cookies } from 'next/headers';
import { shopifyFetch } from './shopify';
import { GET_CUSTOMER } from './auth';

export const CUSTOMER_TOKEN_COOKIE = 'customer_token';
export const CUSTOMER_EXPIRY_COOKIE = 'customer_expiry';
export const CUSTOMER_ID_COOKIE = 'customer_id';

// Get customer token from cookies (Server)
export function getCustomerToken() {
  const cookieStore = cookies();
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value;
}

// Get customer ID from cookies (Server)
export function getCustomerId() {
  const cookieStore = cookies();
  return cookieStore.get(CUSTOMER_ID_COOKIE)?.value;
}

// Get customer expiry from cookies (Server)
export function getCustomerExpiry() {
  const cookieStore = cookies();
  return cookieStore.get(CUSTOMER_EXPIRY_COOKIE)?.value;
}

// Get logged in customer details (Server)
export async function getCustomer(customerToken?: string) {
  const token = customerToken || getCustomerToken();
  if (!token) return null;

  try {
    const data = await shopifyFetch<{ customer: any }>({
      query: GET_CUSTOMER,
      variables: { customerAccessToken: token },
      customerToken: token,
    });
    return data.customer;
  } catch (error) {
    console.error('Failed to fetch customer:', error);
    return null;
  }
}

// Set auth cookies (Server)
export function setAuthCookies(accessToken: string, expiresAt: string, customerId: string) {
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
}

// Clear auth cookies (Server)
export function clearAuthCookies() {
  const cookieStore = cookies();
  cookieStore.delete(CUSTOMER_TOKEN_COOKIE);
  cookieStore.delete(CUSTOMER_EXPIRY_COOKIE);
  cookieStore.delete(CUSTOMER_ID_COOKIE);
}

// Check if authenticated (Server)
export function isAuthenticated() {
  return !!getCustomerToken();
}