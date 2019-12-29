const graphql = require('graphql');
const {
   GraphQLObjectType,
   GraphQLID,
   GraphQLString
} = graphql;

const PostType = new GraphQLObjectType({
   name: 'post',
   fields: () => ({
      postID: { type: GraphQLID },
      slug: { type: GraphQLString },
      title: { type: GraphQLString },
      content: { type: GraphQLString },
      categories: { type: GraphQLString }
   })
});

module.export = PostType;