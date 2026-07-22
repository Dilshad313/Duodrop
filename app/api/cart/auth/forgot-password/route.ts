// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { CUSTOMER_RECOVER } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const data = await shopifyFetch<{
      customerRecover: {
        customerUserErrors: { field: string[]; message: string; code: string }[];
      };
    }>({
      query: CUSTOMER_RECOVER,
      variables: { email },
    });

    const { customerUserErrors } = data.customerRecover;

    if (customerUserErrors && customerUserErrors.length > 0) {
      return NextResponse.json(
        { errors: customerUserErrors.map(e => e.message) },
        { status: 400 }
      );
    }

    // Always return success even if email not found (security best practice)
    return NextResponse.json({
      success: true,
      message: 'If an account exists, reset instructions have been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}