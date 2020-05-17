import { gql } from 'apollo-server-express';

export default gql`
   extend type Query {
      post(slug: String!): Post
      posts(page: Int, limit: Int): PostsList
   }
   extend type Mutation {
      createPost(slug: String!, title: String!, content: String!, featuredImage: String, categories: [String]!): Post @auth(role: "author")
      editPost(slug: String!, updatedSlug: String, updatedTitle: String, updatedContent: String, updatedFeaturedImage: String, updatedCategories: [String]): Post @auth(role: "author")
      uploadPhoto(photo: Upload!): UploadResult @auth(role: "author")
      deletePost(slug: String!): PostDeleteResult @auth(role: "author")
   }
   type Post {
      postID: ID!
      slug: String!
      title: String!
      content: String!
      featuredImage: String
      thumnail: String
      categories: [String]!
      categoriesList: [Category]!
      author: Author! 
      created_at: String
   }
   type PostsList {
      status: Boolean
      list: [Post]
      total: Int
      page: Int
   }
   type PostDeleteResult {
      status: Boolean!
      error: String
   }
   type UploadResult {
      status: Boolean!
      url: String
   }
`
