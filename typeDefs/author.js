import { gql } from 'apollo-server-express'

export default gql`
   extend type Query {
      author(username: String!): Author
      authors: [Author]!
      checkAuth: Author @auth
   }
   extend type Mutation {
      createAuthor(fullName: String!, email: String!, password: String!, username: String!): Author @auth(role: "manager")
      initialManager(fullName: String!, email: String!, password: String!, username: String!): Author
      login(email: String!, password: String!): Author
      logout: Author
   }
   type Author {
      fullName: String!
      email: String! @auth(role: "manager")
      username: String!
      isManager: Boolean!
      posts: [Post]!
   }
`