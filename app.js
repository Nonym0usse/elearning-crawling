var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var udemy = require('./routes/udemy');
var index = require('./routes/index');
var courseraRouter = require('./routes/coursera');
var codingApple = require('./routes/coding-apple');
var goormedu = require('./routes/goormedu');
var teamnova = require('./routes/teamnova');
var inflearn = require('./routes/inflearn');
var taling = require('./routes/taling');
var youtube = require('./routes/youtube');
var programmers = require('./routes/programmers');
var edwith = require('./routes/edwith');
var fastcampus = require('./routes/fastcampus');
var kocw = require('./routes/kocw');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/udemy', udemy);
app.use('/coursera', courseraRouter);
app.use('/coding-apple', codingApple);
app.use('/goormedu', goormedu);
app.use('/teamnova', teamnova);
app.use('/inflearn', inflearn);
app.use('/taling', taling);
app.use('/youtube', youtube);
app.use('/programmers', programmers);
app.use('/edwith', edwith);
app.use('/fastcampus', fastcampus);
app.use('/kocw', kocw);

// catch 404 and forward to error handler
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
