process.env.NODE_ENV = process.env.NODE_ENV || 'development';
global.__base = __dirname + '/';
global.__config = require(__base + 'config/config');
// global.__p2c = require('promise-to-callback');
global.__async = require('async');
global.__mongodb = require(__base + 'services/mongodb');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');
__mongodb.init();

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
app.use(cookieParser("lightning-secret"));
// Access-control-allow-origin and credential
var corsOptions = {
  origin: true,
  credentials: true,
  allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Cache-Control, organic'
};
app.use(cors(corsOptions));

app.get('/client', function(req, res, next) {
    res.render('client.html');
});
app.get('/server', function(req, res, next) {
    res.render('server.html');
});
app.get('/user', function(req, res, next) {
    res.render('user.html');
});
require('./api/routes')(app);

__mongodb.connect(__config.mongo.uri, __config.mongo.options, function(err) {
  console.log("Mongoose connected", err);
  app.listen(__config.port, function() {
    console.log("Node app is running at localhost:" + __config.port)
  })
})
