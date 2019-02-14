const express = require('express');
const path = require('path');
const routes = require('./routes');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express()
const port = 3000;

mongoose.connect('mongodb+srv://admin:S0lac3_Music@solacecluster-ihwta.mongodb.net/Solace?retryWrites=true', { useNewUrlParser: true });
const db = mongoose.connection;

app.use(express.urlencoded());

app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

app.use(session({
  secret: 'solace learning',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use('/', routes);

app.listen(port, () => {
  console.log('Server has stared on port:' + port);
})
