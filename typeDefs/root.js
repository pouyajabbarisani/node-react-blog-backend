import { gql } from 'apollo-server-express'

export default gql`
   directive @auth(role: String) on FIELD | FIELD_DEFINITION

   type Query {
      _: String
   }
   type Mutation {
      _: String
   }
`