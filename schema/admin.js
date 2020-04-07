const graphql = require('graphql');
const {
   GraphQLObjectType,
   GraphQLID,
   GraphQLString
} = graphql;

const AdminType = new GraphQLObjectType({
   name: 'admin',
   fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      family: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString }
   })
});

module.export = AdminType;