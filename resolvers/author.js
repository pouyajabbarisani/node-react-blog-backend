import Authors from '../model/Authors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default {
   Query: {
      author: (root, args, context, info) => {

      },
      authors: (root, args, context, info) => {

      }
   },
   Mutation: {
      createAuthor: (root, args, context, info) => {

      },
      initialManager: async (root, args, context, info) => {
         const existAuthor = await Authors.find();
         if (existAuthor.length) {
            throw new Error('Manager exist!');
         }
         // TODO: add field verification
         var unhashedPass = args.password;
         var hashedPassword;
         var saltResult = new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function (err, salt) {
               if (err) reject(err)
               resolve(salt)
            });
         })
         var hasherFunction = (enterySaltResult, pass) => {
            return new Promise((resolve, reject) => {
               bcrypt.hash(pass, enterySaltResult, function (err, hash) {
                  if (err) reject(err)
                  resolve(hash)
               });
            })
         }
         await saltResult.then(async (generatedSalt) => {
            return await hasherFunction(generatedSalt, unhashedPass)
               .then((hashedPass) => {
                  hashedPassword = hashedPass
               })
         });
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
            context.res.cookie('token', token, {
               httpOnly: true,
               maxAge: 1000 * 60 * 60 * 24 * 3,
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
   }
}