import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
});

export const getCategoryNames = async () => {
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

export const getCurrencyNames = async () => {
  const data = await client.query({
    query: gql`
      query {
        currencies {
          label
        }
      }
    `,
  });
  return data.data.currencies.map((objectElement) => objectElement.label);
};

export const getCategoryProducts = async (categoryName) => {
  const data = await client
    .query({
      query: gql`
      query {
        category(input: { title: "${categoryName}" }) {
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
    })
    .catch((err) => console.log(err));
  return data.data.category.products;

  /* name: data.data.category.name, */
};
