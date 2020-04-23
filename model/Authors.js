const mongoose = require('mongoose');
const connectionURL = require('../config').mongoURI;
var autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection(connectionURL);

autoIncrement.initialize(connection);

const AuthorsSchema = mongoose.Schema({
   fullName: { type: String, require: true },
   email: { type: String, require: true, unique: true },
   password: { type: String, require: true },
   username: { type: String, require: true, unique: true },
   isManager: { type: Boolean, require: true, default: false },
   updated_at: Date,
   created_at: Date,
});

AuthorsSchema.pre('save', function (next) {
   var currentDate = new Date();
   this.updated_at = currentDate;
   if (!this.created_at) {
      this.created_at = currentDate;
   }
   next();
});


var Authors = mongoose.model('Authors', AuthorsSchema);

module.exports = Authors;