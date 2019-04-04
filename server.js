const
express = require('express'),
path = require('path'),
routes = require('./routes'),
mongoose = require('mongoose'),
session = require('express-session'),
MongoStore = require('connect-mongo')(session),
cookieParser = require('cookie-parser'),
app = express(),
port = 3000;

mongoose.connect('mongodb+srv://admin:S0lac3_Music@solacecluster-ihwta.mongodb.net/Solace?retryWrites=true', { useNewUrlParser: true });
const db = mongoose.connection;

app.use(express.urlencoded());

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.set('view engine', 'ejs');

// Add touch method to session to reset idle timer for stores that automatically delete idle sessions
app.use(session({
  secret: 'solace learning', // Change to a randomly generated secret string
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db,
    autoRemove: 'native'
  })
}));

app.use((req, res, next) => {
  if (req.cookies.userId && !req.session.user) {
    res.clearCookie('userId');
  }
  next();
});

app.use('/', routes);

app.listen(port, () => {
  console.log('Server has stared on port:' + port);
})
