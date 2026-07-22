// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { CUSTOMER_ACCESS_TOKEN_CREATE, GET_CUSTOMER } from '@/lib/auth';
import { setAuthCookies } from '@/lib/auth-utils.server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get access token
    const tokenData = await shopifyFetch<{
      customerAccessTokenCreate: {
        customerAccessToken: { accessToken: string; expiresAt: string } | null;
        customerUserErrors: { field: string[]; message: string; code: string }[];
      };
    }>({
      query: CUSTOMER_ACCESS_TOKEN_CREATE,
      variables: {
        input: { email, password },
      },
    });

    const { customerAccessToken, customerUserErrors } = tokenData.customerAccessTokenCreate;

    if (customerUserErrors && customerUserErrors.length > 0) {
      return NextResponse.json(
        { errors: customerUserErrors.map(e => e.message) },
        { status: 400 }
      );
    }

    if (!customerAccessToken) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get customer details to get the ID
    const customerData = await shopifyFetch<{
      customer: { id: string; firstName: string; lastName: string; email: string };
    }>({
      query: GET_CUSTOMER,
      variables: { customerAccessToken: customerAccessToken.accessToken },
      customerToken: customerAccessToken.accessToken,
    });

    if (!customerData.customer) {
      return NextResponse.json(
        { error: 'Failed to fetch customer details' },
        { status: 500 }
      );
    }

    // Set cookies
    setAuthCookies(
      customerAccessToken.accessToken,
      customerAccessToken.expiresAt,
      customerData.customer.id
    );

    return NextResponse.json({
      success: true,
      customer: customerData.customer,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}