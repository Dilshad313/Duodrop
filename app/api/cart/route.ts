// app/api/cart/route.ts
import { shopifyFetch } from '@/lib/shopify';
import { CREATE_CART } from '@/lib/cart';

export async function POST(request: Request) {
  const { lines } = await request.json();

  const data = await shopifyFetch<{ cartCreate: { cart: any } }>({
    query: CREATE_CART,
    variables: { lines },
  });

  return Response.json({ cart: data.cartCreate.cart });
}