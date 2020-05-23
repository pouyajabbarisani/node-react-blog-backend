import Categories from '../model/Categories';
import Posts from '../model/Posts';
import { createCategoryValidator, editCategoryValidator, deleteCategoryValidator } from '../validation/category';

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
      },
      deleteCategory: async (root, args, context, info) => {
         // validate input fields using joi
         const { error, validationResult: value } = await deleteCategoryValidator.validate(args, { abortEarly: false });
         if (error) {
            throw new Error(error);
         }
         // check if post exist in database or not
         const matchedCategoryArray = await Categories.find({ slug: args.slug.toString() });
         if (matchedCategoryArray.length) {
            const deleteResult = await Categories.remove({ slug: args.slug.toString() })
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
               error: 'Entered category not found!'
            }
         }
      }
   },
   Category: {
      posts: (category, args, context, info) => {
         return Posts.find({ categories: { $in: [category.slug] } });
      },
      pagedPosts: (category, args, content, info) => {
         const resultPerPage = args.limit || 10;
         const resultToSkip = args.page ? (resultPerPage * (args.page - 1)) : 0;
         return Posts.aggregate([
            {
               $match: {
                  categories: { $in: [category.slug] }
               }
            },
            {
               $facet: {
                  list: [
                     { $skip: resultToSkip },
                     { $limit: resultPerPage },
                  ],
                  pageInfo: [
                     { $group: { _id: null, count: { $sum: 1 } } },
                  ],
               },
            },
         ]).then(result => {
            return {
               status: true,
               list: result[0].list,
               total: result[0].pageInfo[0].count,
               page: args.page || 1
            }
         }).catch(err => {
            return { status: false }
         })
      }
   }
}