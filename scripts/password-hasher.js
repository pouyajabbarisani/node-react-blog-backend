export default async (password) => {
   var unhashedPass = password;
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
         }).catch((err) => {
            return {
               status: false,
            }
         })
   }).catch((err) => {
      return {
         status: false,
      }
   });
   return {
      status: true,
      hashedPassword
   }
}