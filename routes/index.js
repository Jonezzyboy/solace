const
express = require('express'),
router = express.Router(),
User = require('../models/user'),
bcrypt = require('bcryptjs');

function isLoggedIn (req, res, next){
  if (req.session.username){
    return next();
  }
  res.redirect('login');
}

router.get('/', isLoggedIn, (req, res) => {
  res.render('index', {title: 'Solace', username:req.session.username});
})

router.get('/learn', isLoggedIn, (req, res) => {
  res.render('learn', {title: 'Learn'});
})

router.get('/games', isLoggedIn, (req, res) => {
  res.render('games', {title: 'Games'});
})

router.get('/stats', isLoggedIn, (req, res) => {
  res.render('stats', {title: 'Stats'});
})

router.get('/grade1topics', isLoggedIn, (req, res) => {
  res.render('grade1topics', {title: 'Grade 1: Topics'});
})

router.get('/grade1notevalues', isLoggedIn, (req, res) => {
  res.render('grade1notevalues', {title: 'Grade 1: Note Values'});
})

router.get('/grade1time', isLoggedIn, (req, res) => {
  res.render('grade1time', {title: 'Grade 1: Time Signatures'});
})

router.get('/grade1stave', isLoggedIn, (req, res) => {
  res.render('grade1stave', {title: 'Grade 1: The Stave'});
})

router.route('/login')
.get( (req, res) => {
  res.render('login', {title: 'Login'});
})
.post( (req, res, next) => {
  // Authenticate form data against DB
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err || !user) {
      res.render('login', {title: 'Login', err: 'Wrong username or password'});
    } else {
      req.session.userId = user._id;
      req.session.username = user.username;
      res.redirect('/');
    }
  });
})

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('login');
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
      res.render('register', {title: 'Register', err: 'Username or email already in use'});
    } else {
      res.redirect('login');
    }

  });
})

module.exports = router;
