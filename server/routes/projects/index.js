'use strict';
var Dropbox = require('dropbox');
var dmp = new require('../../min.js');

var projects = [];

exports.list = function (req) {
	if (req.session.user) {
		var retProjects = [];
		for (var i = 0; i < 0; i++) {
			console.log(project[i]);
			var project = projects[i];
			if (project.users.indexOf(req.session.user.id) != -1) {
				retProjects.push(project);
			}
		}
		req.io.emit('projects:list', {
			projects: retProjects
		});
	} else {
		req.io.emit('error:login', {});
	}
};

exports.edit = function (req) {
	if (req.session.user) {
		var project = projects[req.data.id];
		if (project) {
			var client = new Dropbox.Client({
				token: project.token
			});
			client.readFile(req.data.path, {}, function (err, content, stat, statarr) {
				var patches = dmp.patch_fromText(req.data.patch);
				var results = dmp.patch_apply(patches, content);
				client.writeFile(req.data.path, results[0], {}, function (err, arr, stat, statarr) {
					req.io.broadcast('projects:editFile', req.data);
				});
			});
		}
	} else {
		req.io.emit('error:login', {});
	}
};

exports.create = function (req) {
	console.log(req.session.user);
	if (req.session.user) {
		var tokens = req.session.user.dropboxToken;
		var project = {
			name: req.data.name,
			token: tokens.accessToken,
			path: req.data.path,
			users: [req.session.user.id]
		};
		console.log(project);
		projects.push(project);
		req.io.emit('projects:create', {
			id: projects.length - 1,
			project: project
		});
	} else {
		req.io.emit('error:login', {});
	}
};

exports.files = function (req) {
	if (req.session.user) {
		var project = projects[req.data.id];
		if (project) {
			var client = new Dropbox.Client({
				token: project.token
			});

			client.readdir(project.path, {}, function (err, arr, stat, statarr) {
				req.io.emit('projects:files', {
					err: err,
					arr: arr,
					stat: stat,
					statarr: statarr,
					path: req.data.path
				});

			});
		}
	} else {
		req.io.emit('error:login', {});
	}
};

exports.readFile = function (req) {
	if (req.session.user) {
		var project = projects[req.data.id];
		if (project) {
			var client = new Dropbox.Client({
				token: project.token
			});

			client.readFile(req.data.path, {}, function (err, content, stat, statarr) {
				req.io.emit('projects:readFile', {
					err: err,
					content: content,
					stat: stat,
					path: req.data.path
				});
			});
		}
	} else {
		req.io.emit('error:login', {});
	}
};

exports.createFile = function (req) {
	if (req.session.user) {
		var project = projects[req.data.id];
		if (project) {
			var client = new Dropbox.Client({
				token: project.token
			});

			client.writeFile(req.data.path, "", {}, function (err, arr, stat, statarr) {
				req.io.emit('projects:createFile', {
					err: err,
					arr: arr,
					stat: stat,
					statarr: statarr,
					path: req.data.path
				});
			});
		}
	} else {
		req.io.emit('error:login', {});
	}
};

exports.createDir = function (req) {
	if (req.session.user) {
		var project = projects[req.data.id];
		if (project) {
			var client = new Dropbox.Client({
				token: project.token
			});

			client.mkdir(req.data.path, "", function (err, arr, stat, statarr) {
				req.io.emit('projects:createDir', {
					err: err,
					arr: arr,
					stat: stat,
					statarr: statarr,
					path: req.data.path
				});
			});
		}
	} else {
		req.io.emit('error:login', {});
	}
};

exports.delete = function (req) {
	if (req.session.user) {
		var project = projects[req.data.id];
		if (project) {
			var client = new Dropbox.Client({
				token: project.token
			});

			client.remove(req.data.path, function (err, arr, stat, statarr) {
				req.io.emit('projects:delete', {
					err: err,
					arr: arr,
					stat: stat,
					statarr: statarr,
					path: req.data.path
				});
			});
		}
	} else {
		req.io.emit('error:login', {});
	}
};
