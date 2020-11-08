var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session')
const flash = require('connect-flash');
//const fileUpload = require('express-fileupload');

//======================= set connection =============================//
const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cobaDB',
  password: 'kucing',
  port: 5432,
})
//====================================================================//
// ======== nanti di rubah index router ---> <module.exports = router;> tambahin pool
//========= module.exports = (pool) => { ....return router; }
var indexRouter = require('./routes/index')(pool);//===================== router index need (pool)========//
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat'   //=====================D ## session
}));

app.use(flash());          //========================D ##flash

app.use(function(req, res, next) { //===== handling back button bug
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home', homeRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
