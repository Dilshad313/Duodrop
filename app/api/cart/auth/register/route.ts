// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { CUSTOMER_CREATE, CUSTOMER_ACCESS_TOKEN_CREATE } from '@/lib/auth';
import { setAuthCookies } from '@/lib/auth-utils.server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create customer
    const createData = await shopifyFetch<{
      customerCreate: {
        customer: { id: string; email: string; firstName: string; lastName: string } | null;
        customerUserErrors: { field: string[]; message: string; code: string }[];
      };
    }>({
      query: CUSTOMER_CREATE,
      variables: {
        input: {
          firstName,
          lastName,
          email,
          password,
        },
      },
    });

    const { customer, customerUserErrors } = createData.customerCreate;

    if (customerUserErrors && customerUserErrors.length > 0) {
      return NextResponse.json(
        { errors: customerUserErrors.map(e => e.message) },
        { status: 400 }
      );
    }

    if (!customer) {
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // Auto-login after registration
    const loginData = await shopifyFetch<{
      customerAccessTokenCreate: {
        customerAccessToken: { accessToken: string; expiresAt: string } | null;
        customerUserErrors: { message: string }[];
      };
    }>({
      query: CUSTOMER_ACCESS_TOKEN_CREATE,
      variables: {
        input: { email, password },
      },
    });

    const { customerAccessToken, customerUserErrors: loginErrors } = loginData.customerAccessTokenCreate;

    if (loginErrors && loginErrors.length > 0) {
      return NextResponse.json(
        { error: 'Account created but login failed. Please try logging in.' },
        { status: 400 }
      );
    }

    if (!customerAccessToken) {
      return NextResponse.json(
        { error: 'Failed to authenticate' },
        { status: 500 }
      );
    }

    // Set cookies (must be awaited in Next.js 15+)
    await setAuthCookies(
      customerAccessToken.accessToken,
      customerAccessToken.expiresAt,
      customer.id
    );

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}