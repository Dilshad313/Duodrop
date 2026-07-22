// app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { getCustomer, getCustomerToken } from '@/lib/auth-utils.server';

export async function GET() {
  try {
    const token = await getCustomerToken();
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const customer = await getCustomer(token);
    if (!customer) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Get customer error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}