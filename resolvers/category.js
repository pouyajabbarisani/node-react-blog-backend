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
      }
   },
   Category: {
      posts: (category, args, context, info) => {
         return Posts.find({ category: category.slug });
      }
   }
}