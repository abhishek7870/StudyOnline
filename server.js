var express = require('express');
var ejs = require('ejs');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongodb = require('mongodb');


var app = express();
mongoose.connect('mongodb://Kumar_yogi:Yogendra32@ds129536.mlab.com:29536/infinitydatabase',{ useNewUrlParser: true });
var dbConn = mongodb.MongoClient.connect('mongodb://Kumar_yogi:Yogendra32@ds129536.mlab.com:29536/infinitydatabase',{ useNewUrlParser: true });


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));

app.post('/post-feedback', function (req, res) {
    dbConn.then(function(db) {
        delete req.body._id; // for safety reasons
        db.collection('feedbacks').insertOne(req.body);
    });    
    res.send('Data received:\n' + JSON.stringify(req.body));
});


app.get('/view-feedbacks',  function(req, res) {
  dbConn.then(function(db) {
      db.collection('feedbacks').find({}).toArray().then(function(feedbacks) {
          res.status(200).json(feedbacks);
      });
  });
});


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
console.log("mongodb connected");
db.once('open', function () {
});


app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

var index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});
// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});
app.use('/content', express.static('public'))
// listen on port 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, 'public')));


app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});

