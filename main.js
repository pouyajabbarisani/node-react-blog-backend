import express from 'express';
const app = express();

import cookieParser from 'cookie-parser';
require('dotenv').config({ path: __dirname + '/.env' });
app.use(cookieParser(process.env.COOKIE_SIGN));
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import schemaDirectives from './directives';
const PORT = process.env.PORT || 1111;

// Connect to DB
import config from './config';
mongoose.connect(process.env.ENV_TYPE == 'test' ? config.mongoURI_TEST : config.mongoURI, { useNewUrlParser: true }).then(() => console.log(`🍃${process.env.ENV_TYPE == 'test' ? 'Test' : ''} Database Successfully connected!`)).catch(err => console.log(err));


import typeDefs from './typeDefs'
import resolvers from './resolvers'

const server = new ApolloServer({
   typeDefs,
   resolvers,
   schemaDirectives,
   playgorund: process.env.NODE_ENV !== 'production',
   context: ({ req, res }) => ({ req, res })
});

server.applyMiddleware({ app });
app.listen({ port: PORT }, () => console.log(`⚙️✅Server is running on http://localhost:${PORT}${server.graphqlPath}`));
