import { gql } from 'graphql-tag'

/**
 * Query to fetch all products for the authenticated merchant
 */
export const GET_PRODUCTS = gql`
  query GetProducts($categoryId: ID) {
    products(categoryId: $categoryId) {
      id
      name
      description
      price
      productType
      stockQuantity
      imageUrl
      category {
        id
        name
      }
      merchant {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`

/**
 * Query to fetch all categories for the authenticated merchant
 */
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      createdAt
      updatedAt
    }
  }
`

/**
 * Mutation to create a new product
 * Note: Image is handled separately via FormData
 */
export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $description: String
    $price: Float!
    $productType: String!
    $stockQuantity: Int
    $categoryId: ID!
    $imageUrl: String
  ) {
    createProduct(
      input: {
        name: $name
        description: $description
        price: $price
        productType: $productType
        stockQuantity: $stockQuantity
        categoryId: $categoryId
        imageUrl: $imageUrl
      }
    ) {
      product {
        id
        name
        description
        price
        productType
        stockQuantity
        imageUrl
        category {
          id
          name
        }
        createdAt
        updatedAt
      }
      errors
    }
  }
`

/**
 * Mutation to update an existing product
 * Note: Image is handled separately via FormData
 */
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct(
    $id: ID!
    $name: String
    $description: String
    $price: Float
    $productType: String
    $stockQuantity: Int
    $categoryId: ID
    $imageUrl: String
  ) {
    updateProduct(
      input: {
        id: $id
        name: $name
        description: $description
        price: $price
        productType: $productType
        stockQuantity: $stockQuantity
        categoryId: $categoryId
        imageUrl: $imageUrl
      }
    ) {
      product {
        id
        name
        description
        price
        productType
        stockQuantity
        imageUrl
        category {
          id
          name
        }
        createdAt
        updatedAt
      }
      errors
    }
  }
`

/**
 * Mutation to delete a product
 */
export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(input: { id: $id }) {
      success
      errors
    }
  }
`

/**
 * Mutation to create a new category
 */
export const CREATE_CATEGORY = gql`
  mutation CreateCategory($name: String!) {
    createCategory(input: { name: $name }) {
      category {
        id
        name
        createdAt
        updatedAt
      }
      errors
    }
  }
`
