import mongoose from 'mongoose';
import request from 'supertest';
import Authors from '../model/Authors';
const url = `http://localhost:${process.env.PORT}`;


describe("Author tests", () => {

   beforeAll(async () => {
      await mongoose.connect(process.env.mongoURI_TEST, { useNewUrlParser: true })
         .then(async () => { await Authors.deleteMany() })
         .catch(err => { throw new Error(err) });
   });

   afterAll(async () => {
      await Authors.deleteMany();
   });

   test("Shoud create first author as manager if not exist", (done) => {

      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .send({ query: 'mutation {initialManager(fullName: "test manager", email: "testmanager@test.com", password: "123qWe!@#qwe", username: "testmanager"){ fullName username isManager}}' })
         .then(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('initialManager');
            expect(res.body.data.initialManager).toHaveProperty('fullName');
            expect(res.body.data.initialManager.fullName).toEqual('test manager');
            expect(res.body.data.initialManager).toHaveProperty('username');
            expect(res.body.data.initialManager.username).toEqual('testmanager');
            expect(res.body.data.initialManager).toHaveProperty('isManager');
            expect(res.body.data.initialManager.isManager).toEqual(true);
            done();
         });
   });
});