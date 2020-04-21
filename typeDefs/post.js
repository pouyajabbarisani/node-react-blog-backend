import { gql } from 'apollo-server-express';

export default gql`
   extend type Query {
      post(slug: String!): Post
      posts: [Post]!
   }
   extend type Mutation {
      createPost(slug: String, title: String!, content: String!, categories: [String]!): Post
   }
   type Post {
      postID: ID!
      slug: String!
      title: String!
      content: String!
      categories: [String]!
   }   
`
