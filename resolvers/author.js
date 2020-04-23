import Authors from '../model/Authors';
import bcrypt from 'bcrypt';

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
      }
   }
}