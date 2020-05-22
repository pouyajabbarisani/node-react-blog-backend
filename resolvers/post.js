import Authors from '../model/Authors'
import Posts from '../model/Posts'
import Categories from '../model/Categories'
import path from 'path'
import { createPostValidator, editPostValidator, deletePostValidator } from '../validation/post'
import { createWriteStream } from 'fs'

export default {
   Query: {
      post: async (root, args, context, info) => {
         return Posts.findOne({ slug: args.slug.toString() }).exec();
      },
      posts: async (root, args, context, info) => {
         const resultPerPage = args.limit || 10;
         const resultToSkip = args.page ? (resultPerPage * (args.page - 1)) : 0;
         return Posts.aggregate([
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

            if (args.updatedFeaturedImage == null || typeof args.updatedFeaturedImage == 'string') {
               typeof args.updatedFeaturedImage == 'string' && (updatedPost.featuredImage = args.updatedFeaturedImage);
               args.updatedFeaturedImage == null && (updatedPost.featuredImage = '');
            }

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
      uploadPhoto: async (root, { photo }, context, info) => {
         const { filename, createReadStream } = await photo;
         const { mimetype, filesize } = await getFileData(photo);
         if ((mimetype == 'image/jpeg' || mimetype == 'image/png') && filesize <= 2097152) {
            const now = Date.now();
            await new Promise(res =>
               createReadStream()
                  .pipe(createWriteStream(path.join(__dirname, "../uploads/posts/", now + filename)))
                  .on("close", res)
            );
            return {
               status: true,
               url: ('/uploads/posts/' + now + filename).toString()
            }
         }
         else {
            return {
               status: false
            }
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


const getFileData = file => new Promise(async (resolves, rejects) => {
   const { filename, mimetype, createReadStream } = await file;
   let filesize = 0;
   let stream = createReadStream();
   stream.on("data", chunk => {
      filesize += chunk.length;
   });
   stream.once("end", () =>
      resolves({
         filename,
         mimetype,
         filesize
      })
   );
   stream.on("error", rejects);
});

