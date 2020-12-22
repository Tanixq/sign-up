const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const findOrCreate = require('mongoose-findorcreate')

const userSchema = mongoose.Schema({
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
  },
  phone_number: {
    type: String,
  },
  github_id:{
    type: String
  },
  facebook_id:{
    type: String
  },
  google_id:{
    type: String
  },
  twitter_id:{
    type: String
  },
  github_id:{
    type: String
  }
});

userSchema.plugin(findOrCreate);

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);  
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);  
};

module.exports = mongoose.model("User", userSchema);