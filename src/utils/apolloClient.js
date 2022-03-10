import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export const client = new ApolloClient({
  uri: `https://backend-scandiweb-test.herokuapp.com/`,
  cache: new InMemoryCache(),
});

export const queryCategories = async () => {
  const data = await client.query({
    query: gql`
      query {
        categories {
          name
        }
      }
    `,
  });
  return data.data.categories.map((objectElement) => objectElement.name);
};

export const queryCurrencies = async () => {
  const data = await client.query({
    query: gql`
      query {
        currencies {
          label
          symbol
        }
      }
    `,
  });
  return data.data.currencies;
};

export const queryProducts = async (categoryName) => {
  const data = await client.query({
    query: gql`
      query {
        category(input: { title: "all" }) {
          name
          products {
            id
            name
            inStock
            gallery
            description
            category
            attributes {
              id
              name
              type
              items {
                displayValue
                value
                id
              }
              # Disable Apollo caching for this AttributeSet
              __typename @skip(if: true)
            }
            prices {
              currency {
                label
                symbol
              }
              amount
            }
            brand
          }
        }
      }
    `,
  });
  return data.data.category.products;

  /* name: data.data.category.name, */
};

export const queryProduct = async (id) => {
  const data = await client.query({
    query: gql`
      query {
        product(id: "${id}") {
          id
          name
          brand
          inStock
          gallery
          description
          category
          attributes {
            id
            type
            items {
              id, value
            }
            # Disable Apollo caching for this Color
            __typename @skip(if: true)
          }
          prices {
            currency {
              label
              symbol
            }
            amount
          }
        }
      }
      
    `,
  });

  return data.data.product;
};
export const getProductForCart = async (id) => {
  const data = await client.query({
    query: gql`
      query {
        product(id: "${id}") {
          id
          name
          brand
          gallery
          attributes {
            id
            type
            items {
              id, value
            }
          }
          prices {
            currency {
              label
              symbol
            }
            amount
          }
        }
      }
      
    `,
  });
  return data.data.product;
};
