import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client'

// HTTP Link for GraphQL requests
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:3000/graphql',
  credentials: 'omit', // Don't send credentials - we use Bearer token instead
})

// Add auth token to every request
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('authToken')

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  })

  return forward(operation)
})

// Apollo Client configuration
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true,
})

export default apolloClient
