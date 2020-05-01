import mongoose from 'mongoose';
import request from 'supertest';
import Authors from '../model/Authors';
import Categories from '../model/Categories';
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
      await Categories.deleteMany();
      done();
   });

   test("Should create new category as singed-in author", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .set('Cookie', cookie).send({ query: 'mutation {createCategory(slug: "javascript", title: "JavaScript") { title slug }}' })
         .then(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('createCategory');
            expect(res.body.data.createCategory).toHaveProperty('title');
            expect(res.body.data.createCategory.title).toEqual('JavaScript');
            expect(res.body.data.createCategory).toHaveProperty('slug');
            expect(res.body.data.createCategory.slug).toEqual('javascript');
            done();
         });
   });

   test("Should NOT able to create new category as normal user", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .send({ query: 'mutation {createCategory(slug: "angular", title: "Angular") { title slug }}' })
         .then(res => {
            expect(res.body).toHaveProperty('errors');
            expect(res.body.errors[0]).toHaveProperty('message');
            done();
         });
   });

   test("Should get category as normal user", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .send({ query: '{category(slug: "javascript"){ title slug }}' })
         .then(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('category');
            expect(res.body.data.category).toHaveProperty('title');
            expect(res.body.data.category.title).toEqual('JavaScript');
            expect(res.body.data.category).toHaveProperty('slug');
            expect(res.body.data.category.slug).toEqual('javascript');
            done();
         });
   });

   test("Should get categories list as normal user", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .send({ query: '{categories{ title }}' })
         .then(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('categories');
            expect(res.body.data.categories[0]).toHaveProperty('title');
            done();
         });
   });

   test("Should edit category as singed-in author", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .set('Cookie', cookie).send({ query: 'mutation {editCategory(slug: "javascript", updatedSlug: "js", updatedTitle: "JS") { title slug }}' })
         .then(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('editCategory');
            expect(res.body.data.editCategory).toHaveProperty('title');
            expect(res.body.data.editCategory.title).toEqual('JS');
            expect(res.body.data.editCategory).toHaveProperty('slug');
            expect(res.body.data.editCategory.slug).toEqual('js');
            done();
         });
   });

   test("Should able to delete category as author", (done) => {
      request(url).post('/graphql').set('Content-Type', 'application/json').set('Accept', 'application/json')
         .set('Cookie', cookie).send({ query: 'mutation {deleteCategory(slug: "js") { status }}' })
         .then(res => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('deleteCategory');
            expect(res.body.data.deleteCategory).toHaveProperty('status');
            expect(res.body.data.deleteCategory.status).toEqual(true);
            done();
         });
   });

});