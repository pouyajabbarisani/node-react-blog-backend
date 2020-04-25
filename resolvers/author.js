import Authors from '../model/Authors';
import Posts from '../model/Posts';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passwordHasher from '../scripts/password-hasher';

export default {
   Query: {
      author: (root, args, context, info) => {
         return Authors.findOne({ username: args.username.toString() });
      },
      authors: (root, args, context, info) => {
         return Authors.aggregate([{
            $project: {
               fullName: 1,
               username: 1,
               isManager: 1,
               email: 1
            }
         }])
      }
   },
   Mutation: {
      createAuthor: async (root, args, context, info) => {
         // TODO: add field verification
         var unhashedPass = args.password;
         hashedPassword = await passwordHasher(unhashedPass);
         const newAuthor = new Authors({
            fullName: args.fullName,
            email: args.email,
            password: hashedPassword,
            username: args.username,
         })
         return newAuthor.save();
      },
      initialManager: async (root, args, context, info) => {
         const existAuthor = await Authors.find();
         if (existAuthor.length) {
            throw new Error('Manager exist!');
         }
         // TODO: add field verification
         var unhashedPass = args.password;
         hashedPassword = await passwordHasher(unhashedPass);
         const manager = new Authors({
            fullName: args.fullName.toString(),
            email: args.email.toString(),
            password: hashedPassword,
            username: args.username.toString(),
            isManager: true
         });
         return manager.save();
      },
      login: async (root, args, context, info) => {
         // TODO: add field verification
         const author = await Authors.findOne({ email: args.email });
         if (!author) {
            throw new Error('Author with entered email not found!');
         }
         const hashCompare = await bcrypt.compare(args.password, author.password);
         if (hashCompare) {
            // user matched   
            const payload = { username: author.username, isManager: author.isManager } // create jwt payload
            // sign token
            const token = await jwt.sign(payload, process.env.PASS_SECRET, { expiresIn: 60 * 60 * 24 * 3 /* 3 days */ });
            if (!token) {
               throw new Error('Unexpected error!');
            }
            context.res.cookie('token', 'Bearer ' + token, {
               httpOnly: true,
               maxAge: 1000 * 60 * 60 * 24 * 3,
               signed: true
            })
            return author;
         } else {
            throw new Error('Wrong password!');
         }
      },
      logout(parent, args, context, info) {
         context.res.clearCookie('token');
         return { message: "logged out successfully!" }
      }
   },
   Author: {
      posts: (author, args, context, info) => {
         return Posts.find({ author: author.username })
      }
   }
}