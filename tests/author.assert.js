import mongoose from 'mongoose';
import request from 'supertest';
import Authors from '../model/Authors';
const url = `http://localhost:${process.env.PORT}`;
var cookie;

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

   test("Should return error when asking for author's email without authentication", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .send({ query: '{author(username: "testmanager"){ email }}' })
         .then(res => {
            expect(res.body).toHaveProperty('errors');
            expect(res.body.errors[0]).toHaveProperty('message');
            expect(res.body.errors[0].message).toEqual('You must be signed in.');
            done();
         });
   });

   test("Should return list of authors with full name and username", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .send({ query: '{authors { fullName username }}' })
         .then(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('authors');
            expect(res.body.data.authors[0]).toHaveProperty('fullName');
            expect(res.body.data.authors[0]).toHaveProperty('username');
            done();
         });
   });

   test("Should login", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .send({ query: 'mutation {login(email: "testmanager@test.com", password: "123qWe!@#qwe") { username }}' })
         .then(res => {
            cookie = res.headers['set-cookie'];
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('login');
            expect(res.body.data.login).toHaveProperty('username');
            expect(res.body.data.login.username).toEqual('testmanager');
            done();
         });
   });

   test("Should create new author as manager", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json').set('Cookie', cookie)
         .send({ query: 'mutation {createAuthor(fullName: "test author", email: "testauthor@test.com", password: "123qWe!@#q22", username: "testauthor") { username }}' })
         .then(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('createAuthor');
            expect(res.body.data.createAuthor).toHaveProperty('username');
            expect(res.body.data.createAuthor.username).toEqual('testauthor');
            done();
         });
   });

});