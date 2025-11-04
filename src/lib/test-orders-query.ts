import { useQuery } from '@vue/apollo-composable'
import { gql } from 'graphql-tag'

// Test the GetOrders query
const ORDERS_QUERY = gql`
  query GetOrders($status: String) {
    orders(status: $status) {
      id
      referenceNumber
      status
      customer {
        id
        email
      }
    }
  }
`

const { result, loading, error, onResult } = useQuery(ORDERS_QUERY)

onResult((response) => {
  console.log('GraphQL Response:', JSON.stringify(response, null, 2))
  console.log('Orders:', response.data?.orders)
})

console.log('Loading:', loading.value)
console.log('Error:', error)
console.log('Result:', result)
