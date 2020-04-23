import Authors from '../model/Authors';
import Posts from '../model/Posts';

export default {
   Query: {
      post: (root, args, context, info) => {
         return Posts.find({ slug: args.slug.toString() }).exec();
      },
      posts: (root, args, context, info) => {
         return Posts.find().exec();
      }
   },
   Mutation: {
      createPost: (root, args, context, info) => {

      }
   },
   Post: {
      author: async (post, args, { req }, info) => {
         await Authors.aggregate([
            {
               $match: {
                  username: post.author
               }
            },
            {
               $project: {
                  fullName: 1,
                  username: 1
               }
            }
         ])[0];
      }
   }
}