import { gql } from 'apollo-server-express'

export default gql`
   extend type Query {
      author(id: String!): Author
      authors: [Author]!
   }
   extend type Mutation {
      createAuthor(fullName: String!, email: String!, password: String!, username: String!): Author @auth(role: "manager")
      initialManager(fullName: String!, email: String!, password: String!, username: String!): Author
      login(email: String!, password: String!): Author
      logout: Author
   }
   type Author {
      fullName: String!
      email: String!
      username: String!
      isManager: Boolean!
      posts: [Post]!
   }
`