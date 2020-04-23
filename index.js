import express from 'express';
const app = express();
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { PORT } from './config';
import SchemaDirectives from './directives';

// Connect to DB
import { mongoURI } from './config'
mongoose.connect(mongoURI, { useNewUrlParser: true }).then(() => console.log('🍃 Database Successfully connected!')).catch(err => console.log(err));

import typeDefs from './typeDefs'
import resolvers from './resolvers'

const server = new ApolloServer({
   typeDefs,
   resolvers,
   SchemaDirectives,
   playgorund: process.env.NODE_ENV !== 'production'
});

server.applyMiddleware({ app });
app.listen({ port: PORT }, () => console.log(`⚙️✅ Server is running on http://localhost:${PORT}${server.graphqlPath}`));
