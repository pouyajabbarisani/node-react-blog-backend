import bcrypt from 'bcrypt';

export default async (password) => {

   return new Promise(function (resolve, reject) {
      bcrypt.genSalt(10, function (err, salt) {
         if (err) reject(err)
         resolve(salt)
      });
   }).then(function (enterySaltResult) {
      return new Promise((resolve, reject) => {
         bcrypt.hash(password, enterySaltResult, function (err, hash) {
            if (err) reject(err)
            resolve(hash)
         });
      })
   }).then(function (hash) { // (***)
      return {
         status: true,
         password: hash
      }
   }).catch((err) => {
      return {
         status: false,
         password: null
      }
   });

}