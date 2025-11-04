import { gql } from 'graphql-tag'

// Re-export product mutations
export { 
  CREATE_PRODUCT_MUTATION,
  UPDATE_PRODUCT_MUTATION,
  DELETE_PRODUCT_MUTATION,
  CREATE_CATEGORY_MUTATION
} from './queries'

// Order mutations
export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder(
    $customerId: ID
    $customerAttributes: CustomerInput
    $orderItems: [OrderItemInput!]!
    $orderType: String!
    $paymentMethod: String!
    $shippingMethod: String
    $deliveryAddressAttributes: DeliveryAddressInput
    $voucherCode: String
  ) {
    createOrder(
      input: {
        customerId: $customerId
        customerAttributes: $customerAttributes
        orderItems: $orderItems
        orderType: $orderType
        paymentMethod: $paymentMethod
        shippingMethod: $shippingMethod
        deliveryAddressAttributes: $deliveryAddressAttributes
        voucherCode: $voucherCode
      }
    ) {
      order {
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
            category {
              id
              name
            }
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
      }
      errors
    }
  }
`

export const UPDATE_ORDER_STATUS_MUTATION = gql`
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      order {
        id
        referenceNumber
        status
        updatedAt
      }
      errors
    }
  }
`

export const CANCEL_ORDER_MUTATION = gql`
  mutation CancelOrder($id: ID!) {
    cancelOrder(input: { id: $id }) {
      order {
        id
        referenceNumber
        status
        updatedAt
      }
      errors
    }
  }
`

export const PLACE_CUSTOMER_ORDER_MUTATION = gql`
  mutation PlaceCustomerOrder(
    $customerAttributes: CustomerInput!
    $orderItems: [OrderItemInput!]!
    $paymentMethod: String!
    $shippingMethod: String!
    $deliveryAddressAttributes: DeliveryAddressInput!
  ) {
    placeCustomerOrder(
      input: {
        customerAttributes: $customerAttributes
        orderItems: $orderItems
        paymentMethod: $paymentMethod
        shippingMethod: $shippingMethod
        deliveryAddressAttributes: $deliveryAddressAttributes
      }
    ) {
      orders {
        id
        referenceNumber
        orderType
        status
        paymentStatus
        paymentMethod
        shippingMethod
        subtotal
        shippingFee
        convenienceFee
        grandTotal
        createdAt
        merchant {
          id
          name
        }
        customer {
          id
          email
          firstName
          lastName
          fullName
        }
        orderItems {
          id
          quantity
          priceAtPurchase
          product {
            id
            name
            price
          }
        }
      }
      errors
    }
  }
`

export const SEARCH_CUSTOMERS_MUTATION = gql`
  mutation SearchCustomers($query: String!, $searchType: String) {
    searchCustomers(input: { query: $query, searchType: $searchType }) {
      customers {
        id
        email
        firstName
        lastName
        fullName
        mobileNumber
        createdAt
      }
      errors
    }
  }
`

// User management mutations (Admin only)
export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!, $role: String!, $active: Boolean) {
    createUser(input: { name: $name, email: $email, password: $password, role: $role, active: $active }) {
      user {
        id
        name
        email
        role
        active
        createdAt
      }
      errors
    }
  }
`

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: ID!, $name: String, $email: String, $password: String, $role: String, $active: Boolean) {
    updateUser(input: { id: $id, name: $name, email: $email, password: $password, role: $role, active: $active }) {
      user {
        id
        name
        email
        role
        active
        updatedAt
      }
      errors
    }
  }
`

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(input: { id: $id }) {
      success
      errors
    }
  }
`

export const UPDATE_PAYMENT_STATUS_MUTATION = gql`
  mutation UpdatePaymentStatus($input: UpdatePaymentStatusInput!) {
    updatePaymentStatus(input: $input) {
      order {
        id
        referenceNumber
        status
        paymentStatus
        paymentMethod
        grandTotal
        createdAt
        updatedAt
      }
      errors
    }
  }
`
