import { gql } from 'apollo-server-express';

export default gql`
   extend type Query {
      category(slug: String!): Category
      categories: [Category]!
   }
   extend type Mutation {
      createCategory(slug: String!, title: String!): Category @auth(role: "author")
      editCategory(slug: String!, updatedTitle: String, updatedSlug: String): Category @auth(role: "author")
      deleteCategory(slug: String!): CategoryDeleteResult
   }
   type Category {
      categoryID: ID!
      slug: String!
      title: String!
      posts: [Post]!
   }
   type CategoryDeleteResult {
      status: Boolean!
      error: String
   }
`