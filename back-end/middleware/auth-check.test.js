const authCheck = require('./auth-check.js');

describe("Auth-check middleware tests", () => {
   test("Should return isAuth:false when token not provided", () => {
      let req = {}
      let res = {}
      let next = jest.fn()

      authCheck(req, res, next);

      expect(req).toHaveProperty('isAuth');
      expect(req.isAuth).toEqual(false);
   });
});