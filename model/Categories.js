const mongoose = require('mongoose');

const CategoriesSchema = mongoose.Schema({
   title: { type: String, require: true },
   slug: { type: String, require: true },
   updated_at: Date,
   created_at: Date
});

CategoriesSchema.pre('save', function (next) {
   var currentDate = new Date();
   this.updated_at = currentDate;
   if (!this.created_at) {
      this.created_at = currentDate;
   }
   next();
});

var Categories = mongoose.model('Categories', CategoriesSchema);

module.exports = Categories;