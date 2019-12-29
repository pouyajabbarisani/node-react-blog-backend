const mongoose = require('mongoose');
const connectionURL = require('../config').mongoURI;
const connection = mongoose.createConnection(connectionURL);

autoIncrement.initialize(connection);

const AdminsSchema = mongoose.Schema({
   name: { type: String, require: true },
   family: { type: String, require: true },
   email: { type: String, require: true, unique: true },
   password: { type: String, require: true },
   username: { type: String, require: true, unique: true },
   updated_at: Date,
   created_at: Date,
});

AdminsSchema.pre('save', function (next) {
   var currentDate = new Date();
   this.updated_at = currentDate;
   if (!this.created_at) {
      this.created_at = currentDate;
   }
   next();
});

AdminsSchema.plugin(autoIncrement.plugin, {
   model: 'Admins',
   field: 'adminID',
   startAt: 100,
   incrementBy: 1
});

var Admins = mongoose.model('Admins', AdminsSchema);

module.exports = Admins;
