import { CREATE_CART } from "@/lib/cart";
import { shopifyFetch } from "@/lib/shopify";

export async function POST(request: Request) {
  try {
    const { lines } = (await request.json()) as {
      lines?: Array<{ merchandiseId: string; quantity: number }>;
    };

    if (!lines?.length) {
      return Response.json({ error: "Cart lines are required" }, { status: 400 });
    }

    const data = await shopifyFetch<{ cartCreate: { cart: unknown } }>({
      query: CREATE_CART,
      variables: { lines },
    });

    return Response.json({ cart: data.cartCreate.cart });
  } catch (error) {
    console.error("Cart creation failed:", error);
    return Response.json({ error: "Unable to create cart" }, { status: 500 });
  }
}
