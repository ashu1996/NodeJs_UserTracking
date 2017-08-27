var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var API_PREFIX = "/api/v1";

// require('./mongoose/Connector.js');
// require('./utils/CronJob.js');

var index = require('./routes/index');
var usercontroller = require('./routes/usercontroller');
var constant = require('./utils/Constants.js');

var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

var app = express();
var cors = require('cors');

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'morgan');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride());

var connection  = require('express-myconnection'); 
var mysql = require('mysql');

/*------------------------------------------
Reference URL: https://github.com/codetrash/rest-crud/
Reference URL: https://www.npmjs.com/package/mysql
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/
app.use(
    
    connection(mysql,{
        
        host: 'usertracking.c0taqmog2tal.us-east-1.rds.amazonaws.com',
        user: 'masteruser',
        password : 'Novuse123',
        port : 3306,
        database:'usertracking'
    },'request')
);

app.use(API_PREFIX + '/user', usercontroller);
app.use('*', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
	console.error(err.message);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.sendFile(path.resolve('views') + '/error.html');
});

module.exports = app;
