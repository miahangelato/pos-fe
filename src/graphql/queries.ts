import { gql } from 'graphql-tag'

// Product queries and mutations
export { 
  GET_PRODUCTS as PRODUCTS_QUERY,
  GET_CATEGORIES as CATEGORIES_QUERY,
  CREATE_PRODUCT as CREATE_PRODUCT_MUTATION,
  UPDATE_PRODUCT as UPDATE_PRODUCT_MUTATION,
  DELETE_PRODUCT as DELETE_PRODUCT_MUTATION,
  CREATE_CATEGORY as CREATE_CATEGORY_MUTATION
} from './products'

// Order queries and mutations - to be implemented
export const ORDERS_QUERY = gql`
  query GetOrders($status: String) {
    orders(status: $status) {
      id
      referenceNumber
      orderType
      status
      paymentStatus
      paymentMethod
      shippingMethod
      subtotal
      deliveryFee
      convenienceFee
      discountAmount
      grandTotal
      createdAt
      updatedAt
      customer {
        id
        email
        firstName
        lastName
        fullName
        mobileNumber
      }
      orderItems {
        id
        quantity
        unitPrice
        totalPrice
        product {
          id
          name
          price
          productType
          imageUrl
        }
      }
      deliveryAddress {
        id
        province
        city
        barangay
        street
        unitFloor
        buildingName
        landmark
        remarks
        fullAddress
      }
      paymentProof {
        id
        status
        fileKey
        imageUrl
        remarks
        verifiedAt
        createdAt
      }
    }
  }
`

export const CUSTOMERS_QUERY = gql`
  query GetCustomers($query: String) {
    customers(query: $query) {
      id
      email
      firstName
      lastName
      fullName
      mobileNumber
      createdAt
      updatedAt
    }
  }
`