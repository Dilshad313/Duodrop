// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { clearAuthCookies, getCustomerToken } from '@/lib/auth-utils.server';
import { shopifyFetch } from '@/lib/shopify';
import { CUSTOMER_ACCESS_TOKEN_DELETE } from '@/lib/auth';

export async function POST() {
  try {
    const token = await getCustomerToken();

    // Delete token from Shopify (optional but good practice)
    if (token) {
      try {
        await shopifyFetch<{
          customerAccessTokenDelete: {
            deletedAccessToken: string;
            userErrors: { message: string }[];
          };
        }>({
          query: CUSTOMER_ACCESS_TOKEN_DELETE,
          variables: { customerAccessToken: token },
          customerToken: token,
        });
      } catch (error) {
        console.error('Error deleting token from Shopify:', error);
      }
    }

    // Clear cookies (must be awaited in Next.js 15+)
    await clearAuthCookies();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear cookies even if API fails
    await clearAuthCookies();
    return NextResponse.json({ success: true });
  }
}