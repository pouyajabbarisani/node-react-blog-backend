const graphql = require('graphql');
const {
   GraphQLObjectType,
   GraphQLID,
   GraphQLString
} = graphql;

const CategoryType = new GraphQLObjectType({
   name: 'category',
   fields: () => ({
      id: { type: GraphQLID },
      slug: { type: GraphQLString },
      title: { type: GraphQLString }
   })
});

module.export = CategoryType;