var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var mongoose = require('mongoose');
var dotenv = require('dotenv');
var cors = require('cors');
var compression = require('compression');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var friendsRouter = require('./routes/friends');

var app = express();
app.use(cors());
app.use(compression());

dotenv.config();

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);

// database connection
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true},(err,result)=>{
  if(err) return console.log("Error Occured========>",err);
  console.log("Database Connected");
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','html');
app.use(express.static(path.join(__dirname, 'docs')));

app.get("/docs",function(req, res){
    res.sendFile(path.join(__dirname,'/docs/index.html'));
});

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/friends', friendsRouter);

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
