const jwt = require('jsonwebtoken');

const authCheck = (req, res, next) => {
   if (!req.signedCookies.token || req.signedCookies.token == '') {
      req.isAuth = false;
      return next();
   }
   const token = req.signedCookies.token.split(' ')[1]; // to just get token value (without bearer word)
   if (!token || token == '') {
      req.isAuth = false;
      return next();
   }
   let decodedCookie;
   try {
      decodedCookie = jwt.verify(token, process.env.AUTH_SECRET);
   }
   catch (err) {
      req.isAuth = false;
      return next();
   }
   if (!decodedCookie) {
      req.isAuth = false;
      return next();
   }
   req.isAuth = true;
   req.adminID = decodedCookie.adminID;
   next();
};

module.exports = authCheck;