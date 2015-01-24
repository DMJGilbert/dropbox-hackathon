var http = require('http');
var path = require('path');
var port = 80;

var express = require('express.io'),
    passport = require('passport'),
    DropboxStrategy = require('passport-dropbox').Strategy;

var DROPBOX_APP_KEY = "aaw7bo9qqrx3lpr"
var DROPBOX_APP_SECRET = "c06uxmcxvhomzor";

app = express().http().io();

app.set('port', process.env.PORT || port);
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser())
app.use(passport.initialize());
app.use(express.session({secret: 'devbox'}));
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../client')));


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new DropboxStrategy({
    consumerKey: DROPBOX_APP_KEY,
    consumerSecret: DROPBOX_APP_SECRET,
    callbackURL: "http://localhost/auth/dropbox/callback"
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.get('/auth/dropbox',
  passport.authenticate('dropbox'),
  function(req, res){
  });

app.get('/auth/dropbox/callback',
  passport.authenticate('dropbox', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/projects.html');
  });

app.listen(port);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login')
}
