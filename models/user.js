const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Set schema for users
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

// Authentication against DB
UserSchema.statics.authenticate = function (username, password, callback) {
  User.findOne({ username: username }).exec( function (err, user) {
    if (err) {
      return callback(err)
    } else if (!user) {
      var err = new Error('User not found.');
      err.status = 401;
      return callback(err);
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (result === true) {
        return callback(null, user);
      } else {
        return callback();
      }
    });
  });
};

// Hashing password and email before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, saltRounds, function (err, hashPassword) {
    if (err) {
      return next(err);
    }
    user.password = hashPassword;
  });
  bcrypt.hash(user.email, saltRounds, function (err, hashEmail) {
    if (err) {
      return next(err);
    }
    user.email = hashEmail;
    next();
  });
});

const User = mongoose.model('User', UserSchema, 'user');
module.exports = User;
