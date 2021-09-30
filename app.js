var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var udemy = require('./routes/udemy');
var courseraRouter = require('./routes/coursera');
var codingApple = require('./routes/coding-apple');
var goormedu = require('./routes/goormedu');
var teamnova = require('./routes/teamnova');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/udemy', udemy);
app.use('/coursera', courseraRouter);
app.use('/coding-apple', codingApple);
app.use('/goormedu', goormedu);
app.use('/teamnova', teamnova);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("LOG");

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