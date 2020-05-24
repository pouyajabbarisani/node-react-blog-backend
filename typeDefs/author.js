import { gql } from 'apollo-server-express'

export default gql`
   extend type Query {
      author(username: String!): Author
      checkEmailExistance(email: String!): Author
      authors: [Author]!
      checkAuth: Author @auth
   }
   extend type Mutation {
      createAuthor(fullName: String!, email: String!, password: String!, username: String!): Author @auth(role: "manager")
      initialManager(fullName: String!, email: String!, password: String!, username: String!): Author
      deleteAuthor(username: String!): AuthorDeleteResult @auth(role: "manager")
      login(email: String!, password: String!): Author
      logout: LogoutResponse
   }
   type Author {
      fullName: String!
      email: String! @auth(role: "manager")
      username: String!
      isManager: Boolean!
      posts: [Post]!
      created_at: String
   }
   type LogoutResponse {
      status: Boolean
      message: String
   }
   type AuthorDeleteResult {
      status: Boolean
   }
`