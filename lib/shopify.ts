// lib/shopify.ts
const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN as string | undefined;

export function isShopifyConfigured() {
  return Boolean(domain && token);
}

export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  if (!domain || !token) {
    throw new Error("Missing Shopify environment variables");
  }

  // Trim whitespace to avoid parser errors
  const trimmedQuery = query.trim();

  const response = await fetch(`https://${domain}/api/2024-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token.startsWith("shpat_")
        ? { "Shopify-Storefront-Private-Token": token }
        : { "X-Shopify-Storefront-Access-Token": token }),
    },
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