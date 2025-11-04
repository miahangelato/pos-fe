import { gql } from '@apollo/client/core'

export const GET_USERS = gql`
  query GetUsers($role: String, $query: String) {
    users(role: $role, query: $query) {
      id
      name
      email
      role
      active
      createdAt
      updatedAt
    }
  }
`
