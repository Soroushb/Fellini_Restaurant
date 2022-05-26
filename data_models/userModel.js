// require mongoose and setup the Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


var userSchema = new Schema({
    "username":  String,
    "email": {
      "type": String,
      "unique": true
    },
    "password": String,
    "role": {
     "type": String,
     default: 'customer'
    },
    "createdOn": {
      type: Date,
      default: Date.now
    }
  });
  

  module.exports = mongoose.model("users", userSchema);