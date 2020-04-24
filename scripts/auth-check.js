import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';

export const authCheck = (req, role) => {
   if (!req.signedCookies || !req.signedCookies.token || req.signedCookies.token == '') {
      throw new AuthenticationError('You must be signed in.');
   }
   const token = req.signedCookies.token.split(' ')[1]; // to just get token value (without bearer word)
   if (!token || token == '') {
      throw new AuthenticationError('You must be signed in.');
   }
   let decodedCookie;
   try {
      decodedCookie = jwt.verify(token, process.env.PASS_SECRET);
   }
   catch (err) {
      throw new AuthenticationError('You must be signed in.');
   }
   if (!decodedCookie) {
      throw new AuthenticationError('You must be signed in.');
   }
   if (role == 'manager' && !decodedCookie.isManager) {
      throw new AuthenticationError('You must be Manager to able do this action!');
   }
   req.author = decodedCookie.username;
   return true;
};