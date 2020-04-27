import Categories from '../model/Categories';
import Posts from '../model/Posts';
import Joi from '@hapi/joi';
import { createCategoryValidator, editCategoryValidator } from '../validation/category';

export default {
   Query: {
      category: (root, args, context, info) => {
         return Categories.findOne({ slug: args.slug });
      },
      categories: (root, args, context, info) => {
         return Categories.find({});
      }
   },
   Mutation: {
      createCategory: async (root, args, context, info) => {
         // validating input fields using Joi
         const { error, validateResult: value } = await createCategoryValidator.validate(args, { abortEarly: false });
         if (error) {
            throw new Error(error);
         }
         // create new category object and save in the database
         const newCategory = new Categories({
            title: args.title,
            slug: args.slug
         });
         return newCategory.save();
      },
      editCategory: async (root, args, context, info) => {
         // validating input fields using Joi
         const { error, validateResult: value } = await editCategoryValidator.validate(args, { abortEarly: false });
         if (error) {
            throw new Error(error);
         }
         // check database for requested category
         const matchedCategoryArray = await Categories.find({ slug: args.slug.toString() });
         if (matchedCategoryArray.length) {
            // create new object with updated field and save in database
            let updatedCategory = {}
            args.updatedSlug && (updatedCategory.slug = args.updatedSlug);
            args.updatedTitle && (updatedCategory.title = args.updatedTitle);
            return Categories.findOneAndUpdate(
               { slug: args.slug.toString() },
               updatedCategory,
               { new: true });
         }
         else {
            throw new Error('Entered category not found!')
         }
      }
   },
   Category: {
      posts: (category, args, context, info) => {
         return Posts.find({ category: category.slug });
      }
   }
}