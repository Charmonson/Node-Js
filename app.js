var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const passport = require('passport');
const config = require('./config');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const campsiteRouter = require('./routes/campsiteRouter');
const promotionRouter = require('./routes/promotionRouter');
const partnerRouter = require('./routes/partnerRouter');
const favoriteRouter = require ('./routes/favoriteRouter');
const uploadRouter = require('./routes/uploadRouter');

const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true, 
    useUnifiedTopology: true
});

connect.then(() => console.log('Connected correctly to server'), 
    err => console.log(err) //another way to catch errors 
);

var app = express();

app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
      console.log(`Redirecting to: https://${req.hostname}:${app.get('secPort')}${req.url}`);
      res.redirect(301, `https://${req.hostname}:${app.get('secPort')}${req.url}`);
  }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321'));//random key 

app.use(passport.initialize());


app.use('/', indexRouter);
app.use('/users', usersRouter);
//we are not protecting access to static files in public folder, that's fine
app.use(express.static(path.join(__dirname, 'public')));
 // files will be protected individually with control routes authentication 

app.use('/campsites', campsiteRouter);
app.use('/promotions', promotionRouter);
app.use('/partners', partnerRouter);
app.use('/favorites', favoriteRouter);
app.use('/imageUpload', uploadRouter);


app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
