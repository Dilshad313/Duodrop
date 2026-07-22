// lib/shopify.ts
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN as string | undefined;

export function isShopifyConfigured() {
  return Boolean(domain && token);
}

export async function shopifyFetch<T>({
  query,
  variables = {},
  customerToken,
}: {
  query: string;
  variables?: Record<string, unknown>;
  customerToken?: string;
}): Promise<T> {
  if (!domain || !token) {
    throw new Error("Missing Shopify environment variables");
  }

  const trimmedQuery = query.trim();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token.startsWith("shpat_")
      ? { "Shopify-Storefront-Private-Token": token }
      : { "X-Shopify-Storefront-Access-Token": token }),
  };

  // Add customer token for authenticated requests
  if (customerToken) {
    headers["Authorization"] = `Bearer ${customerToken}`;
  }

  const response = await fetch(`https://${domain}/api/2024-07/graphql.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query: trimmedQuery, variables }),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Shopify API error (${response.status}): ${errorText}`);
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: unknown;
  };

  if (json.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  if (!json.data) {
    throw new Error("No Shopify data returned");
  }

  return json.data;
}