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

router.get('/grade2topics', isLoggedIn, (req, res) => {
  res.render('grade2topics', {title: 'Grade 2: Topics'});
})

router.get('/grade2time', isLoggedIn, (req, res) => {
  res.render('grade2time', {title: 'Grade 2: Time Signatures'});
})

router.get('/grade2stave', isLoggedIn, (req, res) => {
  res.render('grade2stave', {title: 'Grade 2: The Stave'});
})

router.get('/grade2scales', isLoggedIn, (req, res) => {
  res.render('grade2scales', {title: 'Grade 2: Minor Scales'});
})

router.get('/grade2terms', isLoggedIn, (req, res) => {
  res.render('grade2terms', {title: 'Grade 2: Terms'});
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
    correct = eval('req.body.' + 'correct' + i);
    if (answer == correct) {
      totalScore++
    }
  }
  percentage = Math.floor((totalScore/count)*100)
  var gameData = {
    gameType: "Quiz",
    category: req.body.category[0],
    grade: req.body.grade[0],
    username: req.session.username,
    scores: [{percentage: percentage}]
  }
  Stats.findOneAndUpdate(
    { category: gameData.category, grade: gameData.grade, username: gameData.username },
    { $push: { scores: gameData.scores } },
    (err, doc) => {
      if(err || !doc){
        Stats.create(gameData, (err) => {
          if(err){
            res.render('quizSelection', {title: 'Games: Quiz Selection', err: 'Something Went Wrong'});
          }
        })
      }
    }
  );
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
    email: req.body.email
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
