// lib/auth-utils.client.ts
"use client";

export const CUSTOMER_TOKEN_COOKIE = 'customer_token';
export const CUSTOMER_EXPIRY_COOKIE = 'customer_expiry';
export const CUSTOMER_ID_COOKIE = 'customer_id';

// Get customer token from cookies (Client)
export function getCustomerTokenClient() {
  if (typeof window === 'undefined') return null;
  
  try {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith(CUSTOMER_TOKEN_COOKIE + '='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
    return null;
  } catch (error) {
    console.error('Error reading cookie client-side:', error);
    return null;
  }
}

// Get customer ID from cookies (Client)
export function getCustomerIdClient() {
  if (typeof window === 'undefined') return null;
  
  try {
    const cookies = document.cookie.split('; ');
    const idCookie = cookies.find(row => row.startsWith(CUSTOMER_ID_COOKIE + '='));
    if (idCookie) {
      return idCookie.split('=')[1];
    }
    return null;
  } catch (error) {
    console.error('Error reading cookie client-side:', error);
    return null;
  }
}

// Get customer expiry from cookies (Client)
export function getCustomerExpiryClient() {
  if (typeof window === 'undefined') return null;
  
  try {
    const cookies = document.cookie.split('; ');
    const expiryCookie = cookies.find(row => row.startsWith(CUSTOMER_EXPIRY_COOKIE + '='));
    if (expiryCookie) {
      return expiryCookie.split('=')[1];
    }
    return null;
  } catch (error) {
    console.error('Error reading cookie client-side:', error);
    return null;
  }
}

// Check if authenticated (Client)
export function isAuthenticatedClient() {
  return !!getCustomerTokenClient();
}

// Clear cookies client-side
export function clearCookiesClient() {
  if (typeof window === 'undefined') return;
  
  document.cookie = `${CUSTOMER_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  document.cookie = `${CUSTOMER_EXPIRY_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
  document.cookie = `${CUSTOMER_ID_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}