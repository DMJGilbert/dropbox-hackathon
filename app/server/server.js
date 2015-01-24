var http = require('http');
var path = require('path');
var port = 80;

var express = require('express.io'),
	passport = require('passport'),
	DropboxOAuth2Strategy = require('passport-dropbox-oauth2').Strategy,
	Dropbox = require("dropbox");

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
app.use(express.session({
	secret: 'devbox'
}));
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, '../client')));


passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(new DropboxOAuth2Strategy({
		clientID: DROPBOX_APP_KEY,
		clientSecret: DROPBOX_APP_SECRET,
		callbackURL: "http://localhost:8080/auth/dropbox/callback"//"https://dev-box.herukoapp.com/auth/dropbox/callback"
	},
	function (accessToken, refreshToken, profile, done) {
		console.log(profile);
		var user = {
			id: profile.id,
			displayName: profile.displayName,
			email: profile.emails[0].value,
			dropboxToken: {
				'accessToken': accessToken,
				'refreshToken': refreshToken
			}
		};
		return done(null, user);
	}
));

app.get('/auth/dropbox',
	passport.authenticate('dropbox-oauth2'),
	function (req, res) {});

app.get('/auth/dropbox/callback',
	passport.authenticate('dropbox-oauth2', {
		failureRedirect: '/index.html'
	}),
	function (req, res) {
		req.io.user = req.user;
		req.session.user = req.user;
		req.session.save();
		res.redirect('/projects.html');
	});

//socket stuff
var _projects = require('./routes/projects');

app.io.route("projects", {
	files: _projects.files,
	list: _projects.list,
	create: _projects.create,
	readFile: _projects.readFile,
	createFile: _projects.create,
	createDir: _projects.createDir,
	delete: _projects.delete,
	editFile: _projects.edit
});

var _files = require('./routes/files');

app.io.route("files", {
	list: _files.list
});

app.listen(port);
