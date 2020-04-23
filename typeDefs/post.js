import { gql } from 'apollo-server-express';

export default gql`
   extend type Query {
      post(slug: String!): Post
      posts: [Post]!
   }
   extend type Mutation {
      createPost(slug: String, title: String!, content: String!, featuredImage: String, categories: [String]!): Post @auth(role: "manager")
   }
   type Post {
      postID: ID!
      slug: String!
      title: String!
      content: String!
      featuredImage: String
      thumnail: String
      categories: [String]!
      author: Author!
   }   
`
