const
express = require('express'),
router = express.Router(),
User = require('../models/user'),
bcrypt = require('bcryptjs');

router.get('/', (req, res) => {
  res.render('index', {title: 'Solace', username:req.session.username});
})

router.get('/learn', (req, res) => {
  res.render('learn', {title: 'Learn'});
})

router.get('/games', (req, res) => {
  res.render('games', {title: 'Games'});
})

router.get('/stats', (req, res) => {
  res.render('stats', {title: 'Stats'});
})

router.get('/grade1topics',  (req, res) => {
  res.render('grade1topics', {title: 'Grade 1: Topics'});
})

router.get('/grade1notevalues',  (req, res) => {
  res.render('grade1notevalues', {title: 'Grade 1: Note Values'});
})

router.get('/grade1time',  (req, res) => {
  res.render('grade1time', {title: 'Grade 1: Time Signatures'});
})

router.get('/grade1stave',  (req, res) => {
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
      return res.render('login', {title: 'Login', err: 'Wrong username or password'});
    } else {
      req.session.userId = user._id;
      req.session.username = user.username;
      console.log(req.session.username);
      if(req.session){
        console.log("TRUE");
      }
      return res.redirect('/');
    }
  });
})

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('login', {title: 'Login'});
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
      return res.render('register', {title: 'Register', err: 'Username or email already in use'});
    } else {
      return res.redirect('login');
    }

  });
})

module.exports = router;
