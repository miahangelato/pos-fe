import { apolloClient } from '@/apollo'
import { useQuery, useMutation, useSubscription } from '@vue/apollo-composable'
import type { DocumentNode, ApolloQueryResult, OperationVariables } from '@apollo/client'

/**
 * Composable to provide Apollo Client functionality
 */
export function useApollo() {
  return {
    useQuery,
    useMutation,
    useSubscription,
    client: apolloClient,
  }
}

/**
 * Composable for handling GraphQL errors
 */
export function useApolloError() {
  const handleError = (error: any) => {
    console.error('Apollo Error:', error)

    // Handle specific error types
    if (error.networkError) {
      console.error('Network Error:', error.networkError)
    }

    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      error.graphQLErrors.forEach((err: any) => {
        console.error('GraphQL Error:', err.message)
      })
    }
  }

  return {
    handleError,
  }
}
