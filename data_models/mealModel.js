// require mongoose and setup the Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// use bluebird promise library with mongoose
// mongoose.Promise = require("bluebird");

// define the photo (album) schema
const mealSchema = new Schema({
  "filename": {
    type: String,
    unique: true
  },
  "name": String,
  "foodCategory": String,
  "numberOfMeals": Number,
  "synopsis": String,
  "price": Number,
  "isTopPackage": Boolean,
  "createdOn": {
    type: Date,
    default: Date.now
  }
});

// module.exports = mongoose.model("web322_week8_photos", photoSchema);
module.exports = mongoose.model("meals", mealSchema);