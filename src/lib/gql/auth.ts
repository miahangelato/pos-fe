import { gql } from 'graphql-tag'

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    signUp(input: {
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    }) {
      merchant {
        id
        name
        email
        role
      }
      token
      errors
    }
  }
`

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(input: {
      email: $email
      password: $password
    }) {
      merchant {
        id
        name
        email
        role
      }
      token
      errors
    }
  }
`
