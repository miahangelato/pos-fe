// Simple test to check if orders query works
fetch('http://localhost:3000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  },
  body: JSON.stringify({
    query: `
      query GetOrders {
        orders {
          id
          referenceNumber
          status
        }
      }
    `
  })
})
.then(res => res.json())
.then(data => {
  console.log('Direct GraphQL Test:', JSON.stringify(data, null, 2))
  if (data.data?.orders) {
    console.log('✅ Orders returned:', data.data.orders.length)
  } else if (data.errors) {
    console.log('❌ GraphQL Errors:', data.errors)
  } else {
    console.log('❌ Unexpected response:', data)
  }
})
.catch(err => console.error('Network error:', err))
