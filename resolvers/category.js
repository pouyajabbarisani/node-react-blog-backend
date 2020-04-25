import Categories from '../model/Categories';
import Posts from '../model/Posts';

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
      createCategory: (root, args, context, info) => {
         // TODO: add field verification
         const newCategory = new Categories({
            title: args.title,
            slug: args.slug
         });
         return newCategory.save();
      },
      editCategory: async (root, args, context, info) => {
         // TODO: add field verification
         const matchedCategoryArray = await Categories.find({ slug: args.slug.toString() });
         if (matchedCategoryArray.length) {
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