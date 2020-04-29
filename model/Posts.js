const mongoose = require('mongoose');
const connectionURL = process.env.ENV_TYPE == 'test' ? process.env.mongoURI_TEST : process.env.mongoURI;
var autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection(connectionURL);

autoIncrement.initialize(connection);

const PostsSchema = mongoose.Schema({
   author: { type: String, require: true },
   slug: { type: String, require: true },
   title: { type: String, require: true },
   content: { type: String, require: false },
   categories: { type: Array, require: false },
   featuredImage: { type: String },
   updated_at: Date,
   created_at: Date
});

PostsSchema.pre('save', function (next) {
   var currentDate = new Date();
   this.updated_at = currentDate;
   if (!this.created_at) {
      this.created_at = currentDate;
   }
   next();
});

PostsSchema.plugin(autoIncrement.plugin, {
   model: 'Posts',
   field: 'postID',
   startAt: 100000,
   incrementBy: 1
});

var Posts = mongoose.model('Posts', PostsSchema);

module.exports = Posts;