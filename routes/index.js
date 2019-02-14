const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
  res.render('index', {title: 'Solace', username:req.session.username});
})

router.get('/learn', (req, res) => {
  res.render('learn', {title: 'Learn'});
})

router.get('/games', (req, res) => {
  res.render('games', {title: 'Games'});
})

router.get('/grade1topics',  (req, res) => {
  res.render('grade1topics', {title: 'Grade 1: Topics'});
})

router.get('/grade1notevalues',  (req, res) => {
  res.render('grade1notevalues', {title: 'Grade 1: Note Values'});
})

router.route('/login')
.get( (req, res) => {
  res.render('login', {title: 'Login'});
})
.post( (req, res, next) => {
  // Authenticate form data against DB
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err || !user) {
      var err = new Error('Wrong username or password.');
      err.status = 401;
      return res.render('login', {title: 'Login', err: 'Wrong username or password'});
    } else {
      req.session.userId = user._id;
      req.session.username = user.username;
      console.log(req.session);
      return res.redirect('/');
    }
  });
})

router.route('/register')
.get( (req, res) => {
  res.render('register', {title: 'Register'});
})
.post( (req, res, next) => {
  const userData = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  }
  // Insert user form data into DB with the User Schema
  User.create(userData, (err, user) => {
    if (err) {
      var err = new Error('Username or email already in use.');
      err.status = 401;
      return next(err);
    } else {
      return res.redirect('login');
    }

  });
})

module.exports = router;
