// lib/queries.ts
export const GET_ALL_PRODUCTS = `query GetAllProducts($first: Int!) {
  products(first: $first, sortKey: BEST_SELLING) {
    edges {
      node {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 4) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              quantityAvailable
              price {
                amount
              }
            }
          }
        }
      }
    }
  }
}`;

export const GET_PRODUCT_BY_ID = `query GetProduct($id: ID!) {
  product(id: $id) {
    id
    title
    handle
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 8) {
      edges {
        node {
          url
          altText
        }
      }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          quantityAvailable
          price {
            amount
          }
        }
      }
    }
  }
}`;

export const SEARCH_PRODUCTS = `query SearchProducts($query: String!, $first: Int!) {
  products(query: $query, first: $first, sortKey: RELEVANCE) {
    edges {
      node {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 4) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              quantityAvailable
              price {
                amount
              }
            }
          }
        }
      }
    }
  }
}`;