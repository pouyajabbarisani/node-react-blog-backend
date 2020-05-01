import Authors from '../model/Authors';
import Posts from '../model/Posts';
import Joi from '@hapi/joi';
import { createPostValidator, editPostValidator, deletePostValidator } from '../validation/post';

export default {
   Query: {
      post: async (root, args, context, info) => {
         return Posts.findOne({ slug: args.slug.toString() }).exec();
      },
      posts: (root, args, context, info) => {
         return Posts.find().exec();
      }
   },
   Mutation: {
      createPost: async (root, args, context, info) => {
         // validating input fields using Joi
         const { error, validateResult: value } = await createPostValidator.validate(args, { abortEarly: false });
         if (error) {
            throw new Error(error);
         }
         const authorUsername = context.req.author;
         if (!authorUsername) {
            throw new Error('Login again!');
         }
         // create new post and save in the database
         const newPost = new Posts({
            author: authorUsername,
            slug: args.slug.toString(),
            title: args.title.toString(),
            content: args.content,
            categories: args.categories,
            featuredImage: args.featuredImage || null
         })
         return newPost.save();
      },
      editPost: async (root, args, context, info) => {
         // validating input fields using Joi
         const { error, validateResult: value } = await editPostValidator.validate(args, { abortEarly: false });
         if (error) {
            throw new Error(error);
         }
         // check it enterd post exist in database or not
         const matchedPostArray = await Posts.find({ slug: args.slug.toString() });
         if (matchedPostArray.length) {
            // create new object with updated fields
            let updatedPost = {}
            args.updatedSlug && (updatedPost.slug = args.updatedSlug);
            args.updatedTitle && (updatedPost.title = args.updatedTitle);
            args.updatedContent && (updatedPost.content = args.updatedContent);
            args.updatedCategories && (updatedPost.categories = args.updatedCategories);
            args.updatedFeaturedImage && (updatedPost.featuredImage = args.updatedFeaturedImage);
            // update edited fields of the post in database
            return Posts.findOneAndUpdate(
               { slug: args.slug.toString() },
               updatedPost,
               { new: true });
         }
         else {
            throw new Error('Entered post not found!')
         }
      },
      deletePost: async (root, args, context, info) => {
         // validate input fields using joi
         const { error, validationResult: value } = await deletePostValidator.validate(args, { abortEarly: false });
         if (error) {
            throw new Error(error);
         }
         // check if post exist in database or not
         const matchedPostArray = await Posts.find({ slug: args.slug.toString() });
         if (matchedPostArray.length) {
            const deleteResult = await Posts.remove({ slug: args.slug.toString() })
            if (!deleteResult.ok) {
               return {
                  status: false,
                  error: 'Error in database!'
               }
            }
            return {
               status: true
            }
         }
         else {
            return {
               status: false,
               error: 'Entered post not found!'
            }
         }
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