import express from 'express';
const app = express();
import cookieParser from 'cookie-parser';
require('dotenv').config({ path: __dirname + '/.env' });
app.use(cookieParser(process.env.COOKIE_SIGN));
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { PORT } from './config';
import schemaDirectives from './directives';

// Connect to DB
import { mongoURI } from './config'
mongoose.connect(mongoURI, { useNewUrlParser: true }).then(() => console.log('🍃 Database Successfully connected!')).catch(err => console.log(err));

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
