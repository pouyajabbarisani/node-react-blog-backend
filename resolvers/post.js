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
         // TODO: field verification
         const authorUsername = context.req.author;
         if (!authorUsername) {
            throw new Error('Login again!');
         }
         const newPost = new Posts({
            author: authorUsername,
            slug: args.slug.toString(),
            title: args.title.toString(),
            content: args.content,
            categories: args.categories
         })
         return newPost.save();
      }
   },
   Post: {
      author: (post, args, context, info) => {
         return Authors.findOne({ username: post.author })
      },
      categoriesList: async (post, args, context, info) => {
         let catArray = [];
         for (let singleCatSlug of post.categories) {
            var foundCat = await Categories.findOne({ slug: singleCatSlug })
            catArray.push(foundCat);
         }
         return catArray;
      }
   }
}