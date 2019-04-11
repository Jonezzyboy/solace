const
express = require('express'),
router = express.Router(),
User = require('../models/user'),
Quiz = require('../models/quiz'),
Stats = require('../models/stats'),
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

router.get('/grade1scales', isLoggedIn, (req, res) => {
  res.render('grade1scales', {title: 'Grade 1: Major Scales'});
})

router.get('/grade1terms', isLoggedIn, (req, res) => {
  res.render('grade1terms', {title: 'Grade 1: Terms'});
})

router.route('/quizGame')
.get( isLoggedIn, (req, res) => {
  res.render('quizSelection', {title: 'Games: Quiz Selection'});
})
.post( (req, res) => {
  // Return all questions depending on grade and category
  var questionQuery = JSON.parse(req.body.quizSelection);
  Quiz.find({ $and: [{category: questionQuery.category}, {grade: questionQuery.grade}] })
  .exec( function (err, allQuestions) {
    if (err) {
      return err
      res.redirect('quizSelection');
    }
    // Randomly select 10 questions from all questions returned
    var rand = 0;
    var selectedQuestions = [];
    for (var i = 0; i < 10; i++) {
      rand = Math.floor(Math.random()*allQuestions.length);
      selectedQuestions.push(allQuestions[rand]);
      allQuestions.splice(rand, 1);
    }
    res.render('quizGame', {title: 'Quiz: Grade ' + questionQuery.grade + ' '
    + questionQuery.quizTitle, questions: selectedQuestions});
  })
})

router.post('/quizEnd', isLoggedIn, (req, res) => {
  var count = req.body.count;
  var totalScore = 0
  var
  question,
  answer,
  correct,
  percentage
  for (var i = 0; i < count; i++) {
    answer = eval('req.body.' + 'group' + i);
    question = eval('req.body.' + 'question' + i);

    Quiz.findOne({ $and: [{question: question}, {correct: answer}] }, checkAnswer)

    var checkAnswer = function(err, correct){
      if (err) return handleError(err);
      if (!correct) {
        console.log("False");
      } else {
        // Add this score to db
        totalScore++
        percentage = Math.floor((totalScore/count)*100)
      }
    }
  }
  res.redirect('/quizgame');
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
