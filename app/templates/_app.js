'use strict';
var express = require('express');
var path = require('path');
var app = express();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');

app.configure(function () {
  app.set('view engine', 'ejs');
  app.use(express.cookieParser('<%= _.slugify(randomCookie) %>'));
  app.use(express.static(path.join(__dirname, 'bower_components')));
  app.use(express.static(path.join(__dirname, 'static')));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.cookieSession({ secret: '<%= _.slugify(randomPhrase) %>' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.errorHandler());
  app.use(express.logger('dev'));
  app.use(app.router);
  app.set('view cache', false);
});

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.findByUserame(username, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Unknown user ' + username });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Invalid password' });
      }
      return done(null, user);
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

function ensureAuthenticated(req, res, next) {
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.get('/', ensureAuthenticated, function (req, res) {
  res.sendfile(__dirname + '/views/index.html');
});

// clean up our proc file since we're dead
process.on('SIGINT', function () {
  fs.unlinkSync('proc.pid');
  process.exit();
});

var port = process.env.PORT || 5000;
var pidfile = fs.openSync('proc.pid', 'w');
fs.writeSync(pidfile, process.pid);
app.listen(port);

