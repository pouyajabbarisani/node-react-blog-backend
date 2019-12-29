const graphql = require('graphql');
const {
   GraphQLSchema,
   GraphQLObjectType,
   GraphQLID,
} = graphql;

// Import schemas
const AdminType = require('./admin');
const PostType = require('./post');
const CategoryType = require('./category');

// Build rood query
const RootQuery = new GraphQLObjectType({
   name: 'RootQueryType',
   fields: {
      post: {
         // name of root element in query which comes from front-end
         type: PostType,
         args: { id: { type: GraphQLID } },
         resolve(parent, args) {
            // code to get data from DB / other sources
            // we can get arguments in here in args. eg: args.id
         }
      },
      // category: {
      //    type: CategoryType,
      //    args: { id: { type: GraphQLID } },
      //    resolve(parent, args) {

      //    }
      // }
   }
});


module.exports = new GraphQLSchema({
   query: RootQuery
});