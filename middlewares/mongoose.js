const express = require('express');
const mongoose = require('mongoose');
const config = require('../config/config');

module.exports =  mongoose.Promise = global.Promise;
mongoose.connect(
  config.DATABASE,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) console.log(err);
    console.log("database is connected");
  }
);