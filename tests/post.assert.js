

import mongoose from 'mongoose';
import request from 'supertest';
import Authors from '../model/Authors';
import Posts from '../model/Posts';
import passwordHasher from '../scripts/password-hasher';
const url = `http://localhost:${process.env.PORT}`;
var cookie;

describe("Post tests", () => {

   beforeAll(async () => {
      await mongoose.connect(process.env.mongoURI_TEST, { useNewUrlParser: true })
         .then(async () => {
            await Authors.deleteMany();

            const hashedPassword = await passwordHasher('paS12!@12p');
            const manager = new Authors({
               fullName: 'test author',
               email: 'testauthor@test.com',
               password: hashedPassword.password,
               username: 'testauthor',
               isManager: true
            });
            await manager.save();
            await request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
               .send({ query: 'mutation {login(email: "testauthor@test.com", password: "paS12!@12p") { username }}' })
               .then(res => {
                  cookie = res.headers['set-cookie'];
               });
         })
         .catch(err => { throw new Error(err) });
   });

   afterAll(async (done) => {
      await Authors.deleteMany();
      await Posts.deleteMany();
      done();
   });

   test("Should create new post as singed-in author", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .set('Cookie', cookie).send({ query: 'mutation {createPost(slug: "hello-world", title: "Hello World!", content: "Hello content", categories: []) { title categories slug }}' })
         .then(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('createPost');
            expect(res.body.data.createPost).toHaveProperty('title');
            expect(res.body.data.createPost.title).toEqual('Hello World!');
            expect(res.body.data.createPost).toHaveProperty('slug');
            expect(res.body.data.createPost.slug).toEqual('hello-world');
            done();
         });
   });

   test("Should NOT able to create new post as normal user", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .send({ query: 'mutation {createPost(slug: "hello-world2", title: "Hello World2!", content: "Hello content 2", categories: []) { title slug }}' })
         .then(res => {
            expect(res.body).toHaveProperty('errors');
            expect(res.body.errors[0]).toHaveProperty('message');
            done();
         });
   });

   test("Should get post as normal user", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .send({ query: '{post(slug: "hello-world"){ title author{ fullName } }}' })
         .then(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('post');
            expect(res.body.data.post).toHaveProperty('title');
            expect(res.body.data.post.title).toEqual('Hello World!');
            expect(res.body.data.post).toHaveProperty('author');
            expect(res.body.data.post.author).toHaveProperty('fullName');
            done();
         });
   });

   test("Should get posts list as normal user", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .send({ query: '{posts{ status list {title} total page }}' })
         .then(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('posts');
            expect(res.body.data.posts).toHaveProperty('list');
            expect(res.body.data.posts.list[0]).toHaveProperty('title');
            expect(res.body.data.posts).toHaveProperty('total');
            expect(res.body.data.posts.total).toEqual(1);
            expect(res.body.data.posts).toHaveProperty('page');
            expect(res.body.data.posts.page).toEqual(1);
            done();
         });
   });

   test("Should edit post as singed-in author", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .set('Cookie', cookie).send({ query: 'mutation {editPost(slug: "hello-world", updatedSlug: "hello-better-world", updatedTitle: "Hello Better World!", updatedContent: "Hello better content") { title slug }}' })
         .then(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('editPost');
            expect(res.body.data.editPost).toHaveProperty('title');
            expect(res.body.data.editPost.title).toEqual('Hello Better World!');
            expect(res.body.data.editPost).toHaveProperty('slug');
            expect(res.body.data.editPost.slug).toEqual('hello-better-world');
            done();
         });
   });

   test("Should able to delete post as author", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .set('Cookie', cookie).send({ query: 'mutation {deletePost(slug: "hello-better-world") { status }}' })
         .then(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('deletePost');
            expect(res.body.data.deletePost).toHaveProperty('status');
            expect(res.body.data.deletePost.status).toEqual(true);
            done();
         });
   });

});
